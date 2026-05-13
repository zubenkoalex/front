import successSound from "/sounds/notification-scc.ogg";
import infoSound from "/sounds/notification-info.ogg";
import warningSound from "/sounds/notification-warning.ogg";
import errorSound from "/sounds/notification-err.ogg";
import uiClickSound from "/sounds/ui-click.mp3";
import uiLoadSound from "/sounds/ui-load.mp3";
import uiKeyboardClick from "/sounds/keyboard-click.mp3";

export type SoundName =
    | "success"
    | "warning"
    | "info"
    | "error"
    | "ui-load"
    | "ui-click"
    | "ui-keyboard-click";

const soundNames: Record<SoundName, string | string[]> = {
    success: successSound,
    warning: warningSound,
    info: infoSound,
    error: errorSound,
    "ui-click": uiClickSound,
    "ui-load": uiLoadSound,
    "ui-keyboard-click": uiKeyboardClick
};

type AudioInstance = {
  el: HTMLAudioElement;
  src: string;
  loop: boolean;
  rampFrame?: number | null;
  // stored base volume (0..1) requested by caller
  baseVolume: number;
  // fade to use on play (ms)
  fadeMsOnPlay: number;
  // playlist-loop mode (true => after ended play random next)
  playlistLoop?: boolean;
};
const audioInstances: Map<SoundName, AudioInstance> = new Map();
const playlistHistory: Map<SoundName, string[]> = new Map();

let masterVolume = 50; // global multiplier 0..1

function clamp(v: number, lo = 0, hi = 1) {
    return Math.max(lo, Math.min(hi, v));
}

function chooseSrc(name: SoundName, exclude?: string): string {
    const entry = soundNames[name];

    if (!entry) throw new Error(`Sound "${name}" not found`);

    if (Array.isArray(entry)) {
        if (!playlistHistory.has(name)) playlistHistory.set(name, []);
        
        const history = playlistHistory.get(name)!;
        const availableTracks = entry.filter(track => !history.includes(track));
        const selectedTrack = availableTracks.length > 0 ? 
            availableTracks[Math.floor(Math.random() * availableTracks.length)] 
            : 
            entry[Math.floor(Math.random() * entry.length)];

        history.push(selectedTrack);

        if (history.length > 3) history.shift();

        return selectedTrack;
    }

    return entry;
}

function rampVolume(record: AudioInstance, from: number, to: number, durationMs: number, onComplete?: () => void) {
    if (record.rampFrame) {
        cancelAnimationFrame(record.rampFrame);
        record.rampFrame = null;
    }

    if (durationMs <= 0) {
        try {
            record.el.volume = clamp(to * masterVolume);
        } catch (e) {}

        if (onComplete) onComplete();

        return;
    }

    const start = performance.now();
    const delta = to - from;

    function step(now: number) {
        const t = Math.min(1, (now - start) / durationMs);
        const value = clamp(from + delta * t);
        
        try {
            record.el.volume = clamp(value * masterVolume);
        } catch (e) {}

        if (t < 1) {
            record.rampFrame = requestAnimationFrame(step);
        } else {
            record.rampFrame = null;

            if (onComplete) onComplete();
        }
    }

    record.rampFrame = requestAnimationFrame(step);
}

function playNextFromPlaylist(soundName: SoundName) {
    const rec = audioInstances.get(soundName);

    if (!rec || !rec.playlistLoop) return;

    let nextSrc: string;
    try {
        nextSrc = chooseSrc(soundName, rec.src);
    } catch (e) {
        return;
    }

    const oldAudio = rec.el;
    // remove old handlers
    try {
        oldAudio.pause();
    } catch (e) {}
    try {
        oldAudio.currentTime = 0;
    } catch (e) {}

    const newAudio = new Audio(nextSrc);
    newAudio.preload = "auto";
    newAudio.loop = false;
    rec.el = newAudio;
    rec.src = nextSrc;
    rec.loop = false;

    const onEnded = () => {
        const current = audioInstances.get(soundName);
        if (current && current.playlistLoop) {
        playNextFromPlaylist(soundName);
        } else {
        const cur = audioInstances.get(soundName);
        if (cur && cur.el === newAudio) audioInstances.delete(soundName);
        }
        newAudio.removeEventListener("ended", onEnded);
    };
    newAudio.addEventListener("ended", onEnded);

    newAudio.play().catch(() => {});
    if (rec.fadeMsOnPlay > 0) {
        rampVolume(rec, 0, rec.baseVolume, rec.fadeMsOnPlay);
    } else {
        try {
        rec.el.volume = clamp(rec.baseVolume * masterVolume);
        } catch (e) {}
    }
}

export function playSound2D(soundName: SoundName, volumePercent: number, loop: boolean = false, fadeMs: number = 0) {
    const targetVolume = clamp(volumePercent / 100);

    let src: string;
    try {
        src = chooseSrc(soundName);
    } catch (e) {
        console.warn("[Sound] Unknown sound:", soundName);
        return;
    }

    const existing = audioInstances.get(soundName);
    if (existing) {
        // stop existing cleanly (no fade) so we can start new
        try {
        if (existing.rampFrame) {
            cancelAnimationFrame(existing.rampFrame);
            existing.rampFrame = null;
        }
        } catch (e) {}
        try {
        existing.el.pause();
        existing.el.currentTime = 0;
        } catch (e) {}
        audioInstances.delete(soundName);
    }

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;

    const record: AudioInstance = {
        el: audio,
        src,
        loop: !!loop,
        rampFrame: null,
        baseVolume: targetVolume,
        fadeMsOnPlay: fadeMs,
        playlistLoop: false
    };

    if (Array.isArray(soundNames[soundName]) && loop) {
        record.playlistLoop = true;
        audio.loop = false;
    }

    const onEnded = () => {
        const cur = audioInstances.get(soundName);
        if (cur && cur.playlistLoop) {
        playNextFromPlaylist(soundName);
        } else {
        const cur2 = audioInstances.get(soundName);
        if (cur2 && cur2.el === audio) audioInstances.delete(soundName);
        }
        audio.removeEventListener("ended", onEnded);
    };
    audio.addEventListener("ended", onEnded);

    audioInstances.set(soundName, record);

    if (fadeMs > 0) {
        try {
            audio.volume = 0;
        } catch (e) {}

        audio.play().catch(() => {});
        rampVolume(record, 0, targetVolume, fadeMs);
    } else {
        try {
            audio.volume = clamp(targetVolume * masterVolume);
        } catch (e) {}

        audio.play().catch(() => {});
    }

    console.log(`[Sound] Playing ${soundName} at ${volumePercent}% (${targetVolume})`);
}

export function stopSound2D(soundName: SoundName, fadeMs: number = 0) {
    const rec = audioInstances.get(soundName);
    if (!rec) return;

    rec.playlistLoop = false;

    if (rec.rampFrame) {
        try {
            cancelAnimationFrame(rec.rampFrame);
            rec.rampFrame = null;
        } catch (e) {}
    }

    const finish = () => {
        try {
            rec.el.pause();
            rec.el.currentTime = 0;
        } catch (e) {}

        audioInstances.delete(soundName);
    };

    if (fadeMs > 0) {
        rampVolume(rec, rec.el.volume / (masterVolume || 1), 0, fadeMs, finish);
    } else {
        finish();
    }
};