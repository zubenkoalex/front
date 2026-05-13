import { ArhiveFile, CodeFile, File, ImageFile, SheetsFile, SoundFile, Sparkles, VideoFile } from "../components/SVG";
import { DocumentFile } from "../components/SVG/Files/DocumentFile";
import { FileMetadata } from "../types/UI";

export function secondsToHoursMinutes(sec: number): string {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);

    return `${hours}ч. ${minutes}мин.`;
}

export function pluralize(n: number, forms: [string, string, string]): string {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;

    if (abs > 10 && abs < 20) return forms[2];
    if (last === 1) return forms[0];
    if (last >= 2 && last <= 4) return forms[1];
    return forms[2];
}

export const getYearsWord = (n: number) => {
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "лет";
    if (lastDigit === 1) return "год";
    if (lastDigit >= 2 && lastDigit <= 4) return "года";
    return "лет";
};

export function getAge(birthDate: string | Date): string {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const hasBirthdayPassed =
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

    if (!hasBirthdayPassed) {
        age--;
    }

    return `${age} ${getYearsWord(age)}`;
}

export function timeAgo(dateInput: Date | string): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "в будущем";

    if (diffDays === 0) return "сегодня";

    if (diffDays <= 6) {
        return `${diffDays} ${pluralize(diffDays, ["день", "дня", "дней"])} назад`;
    }

    const weeks = Math.floor(diffDays / 7);
    if (weeks <= 4) {
        return `${weeks} ${pluralize(weeks, ["неделю", "недели", "недель"])} назад`;
    }

    const months = Math.floor(diffDays / 30);
    if (months <= 12) {
        return `${months} ${pluralize(months, ["месяц", "месяца", "месяцев"])} назад`;
    }

    const years = Math.floor(diffDays / 365);
    return `${years} ${pluralize(years, ["год", "года", "лет"])} назад`;
}

export function maskPhoneNumber(number: string | null): string | null {
    if (!number) return null;
    return number.replace(/(\+7|7|8)?(\d{3})(\d{3})(\d{2})(\d{2})/, "+7 *** *** $4-$5");
}

export function maskEmail(email: string): string {
    if (!email) return "";
    return email.replace(/(?<=.{2}).(?=.*.{2}@)/g, "*");
}

export function getErrorMessage(error: unknown): string {
    if (!error) return 'Неизвестная ошибка';
    
    if (typeof error === 'object' && error !== null) {
        const rtkError = error as any;
        
        if (rtkError.data?.error) {
            return rtkError.data.error;
        }

        if (rtkError.data?.message) {
            return rtkError.data.message;
        }

        if ('error' in rtkError && typeof rtkError.error === 'string') {
            return rtkError.error;
        }

        if ('message' in rtkError && typeof rtkError.message === 'string') {
            return rtkError.message;
        }
    }

    return 'Неизвестная ошибка';
}

export function formatThousands(x: number, separator = ' ') {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}


type DateFormatType = 'short' | 'long' | 'full' | 'time' | 'datetime';

interface DateFormatOptions {
    format?: DateFormatType;
    locale?: string;
    removeDot?: boolean;
    capitalize?: boolean;
}

export const formatDate = (dateInput: string | Date | number, options: DateFormatOptions = {}): string => {
    const {
        format = 'short',
        locale = 'ru-RU',
        removeDot = true,
        capitalize = true,
    } = options;

    const date = new Date(dateInput);
  
    if (isNaN(date.getTime())) return "Invalid date";
  

    const formatConfig: Record<DateFormatType, Intl.DateTimeFormatOptions> = {
        short: { day: 'numeric', month: 'short' },
        long: { day: 'numeric', month: 'long' },
        full: { day: 'numeric', month: 'long', year: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' },
        datetime: { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        },
    };

    let formattedDate = date.toLocaleDateString(locale, formatConfig[format]);
  
    if (format === 'datetime') {
        const timeStr = date.toLocaleTimeString(locale, formatConfig.time);
        formattedDate = `${formattedDate}, ${timeStr}`;
    } else if (format === 'time') {
        formattedDate = date.toLocaleTimeString(locale, formatConfig.time);
    }

  
    if (removeDot) {
        formattedDate = formattedDate.replace(/\.$/, '');
    }

    if (capitalize && formattedDate.length > 0) {
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
};

export const getFileMetadata = (file: { name: string; type: string }) => {
    const mimeType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();
    const extension = fileName.split('.').pop() || '';

    if (mimeType.startsWith('image/'))
        return {
            key: "image",
            category: 'Изображение', 
            Icon: ImageFile, 
            isImage: true 
        };

    if (mimeType.startsWith('video/')) 
        return { 
            key: "video",
            category: 'Видео', 
            Icon: VideoFile, 
            isImage: false 
        };
    
  
    if (mimeType.startsWith('audio/'))
        return { 
            key: "audio",
            category: 'Аудио', 
            Icon: SoundFile, 
            isImage: false 
        };
  
    if (mimeType === 'application/pdf')
        return { 
            key: "application",
            category: 'Документы', 
            Icon: DocumentFile, 
            isImage: false 
        };
    
    if (['doc', 'docx', 'txt', 'rtf', 'md'].includes(extension))
        return { 
            key: "application",
            category: 'Документы', 
            Icon: DocumentFile, 
            isImage: false 
        };
    

    if (['xls', 'xlsx', 'csv', 'tsv'].includes(extension))
        return { 
            key: "tabel",
            category: 'Таблица', 
            Icon: SheetsFile, 
            isImage: false 
        };
    
    if (['py', 'js', 'ts', 'html', 'css', 'sql', 'java', 'c', 'cpp', 'cs', 'go', 'r', 'php', 'rb', 'ipynb', 'json'].includes(extension))
        return { 
            key: "file",
            category: 'Код и разметка', 
            Icon: CodeFile, 
            isImage: false 
        };

    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension))
        return {
            key: "arhives",
            category: 'Архивы',
            Icon: ArhiveFile,
            isImage: false
        };

    return {
        key: "file",
        category: 'Файл', 
        Icon: File, 
        isImage: false 
    };
};