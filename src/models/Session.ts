export interface Session {
    sessionId: number;
    accountId: number;
    geoCountry: string;
    geoCity: string;
    createdAt: string;
    lastSeenAt: string;
    os: string;
    deviceName: string;
    deviceType: "mobile" | "desktop" | "unknown";
    browser: "google-chrome" | "samsung-browser" | "microsoft-edge" | "vivaldi" | "firefox" | "opera" | "yandex" | "safari" | "unknown";
    isCurrent: boolean;
    suspicious: boolean;
}