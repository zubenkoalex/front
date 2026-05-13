import { allActions } from "../store/reducers/actions";
import { getErrorMessage } from "../utils";
import { playSound2D } from "../utils/sounds";
import { Attachment } from "../types/Dashboard";

type StreamArgs = {
    chatId: string;
    messageId: string;
    text: string;
    attachments: Attachment[];
    dispatch: any;
};

let currentAbortController: AbortController | null = null;

export const stopChatStream = () => {
    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }
};

export const startChatStream = async ({
    chatId,
    messageId,
    text,
    attachments,
    dispatch
}: StreamArgs) => {
    if (currentAbortController) {
        currentAbortController.abort();
    }

    currentAbortController = new AbortController();

    try {
        const processLine = (line: string): "done" | void => {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith('data:')) return;

            const dataStr = trimmedLine.slice(5).trim();

            if (dataStr === '[DONE]') {
                dispatch(allActions.dashboard.chatCompleteMessage({ id: messageId }));
                return "done";
            }

            try {
                const payload = JSON.parse(dataStr);
                if (payload.data) {
                    dispatch(allActions.dashboard.chatAppendChunk({
                        id: messageId,
                        chunk: payload.data
                    }));
                } else if (payload.message || payload.error) {
                    // Если бэкенд прислал сообщение об ошибке (например, нет ключа API)
                    dispatch(allActions.dashboard.chatErrorMessage({ 
                        id: messageId, 
                        error: payload.message || payload.error 
                    }));
                    return "done";
                }
            } catch {
                console.warn("Не удалось распарсить чанк JSON:", dataStr);
            }
        };

        const response = await fetch('https://adzen-ai.ru/api/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatId, messageId, text, attachments }),
            signal: currentAbortController.signal
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('ReadableStream не поддерживается вашим браузером');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');

            buffer = lines.pop() || '';

            for (const line of lines) {
                const result = processLine(line);
                if (result === "done") return;
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            const result = processLine(buffer);
            if (result === "done") return;
        }

        dispatch(allActions.dashboard.chatCompleteMessage({ id: messageId }));
    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.log('Генерация отменена пользователем');
            dispatch(allActions.dashboard.chatCompleteMessage({ id: messageId }));
        } else {
            console.error("Stream error:", err);

            playSound2D("error", 1);
            dispatch(allActions.dashboard.chatErrorMessage({ id: messageId, error: getErrorMessage(err) }));
        }
    } finally {
        currentAbortController = null;
    }
};