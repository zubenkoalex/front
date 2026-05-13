import { Android, Apple, CalendarChecked, Desktop, FilledCheck, FilledError, Firefox, GoogleAds, GoogleChrome, Info, Meta, MicrosoftEdge, Opera, Pause, Safari, SamsungBrowser, SparklesFilled, Vivaldi, Vk, Warning, Yandex, YandexDirect } from "../components/SVG";

export type Variant = "success" | "error" | "default";

export const ToastIcons = {
    success: FilledCheck,
    info: Info,
    warning: Warning,
    error: FilledError,
}

export type ToastTypes = "success" | "info" | "warning" | "error";

export interface ToastProps {
    id: string;
    description: string;
    type: ToastTypes;
}

export interface StatisticsCardProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    value: number;
    unit?: string;
    description: string[];
    profit: number;
    color?: string;
}

export interface StatisticsValues {
    value: number;
    profit: number;
}

export interface ChartData {
    date: string;
    [key: string]: number | string;
}

export interface ChartSeries {
    key: string;
    color: string;
    name: string;
}

export interface AdCompanyProps {
    type: "google-ads" | "yandex-direct" | "meta" | "vk";
    name: string;
    status: boolean;
    statistics: {
        spent: number;
        ctr: number;
        conversions: number;
    }
}

export const AdCompanyNames: Record<string, string> = {
    "google-ads": "Google Ads",
    "yandex-direct": "Yandex Direct",
    "meta": "Meta",
    "vk": "ВКонтакте"
}

export const AdCompanyIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    "google-ads": GoogleAds,
    "yandex-direct": YandexDirect,
    "meta": Meta,
    "vk": Vk
}

export const AdCompanyDesc: Record<string, string> = {
    "google-ads": "Охват в сервисах экосистемы компании Google.",
    "yandex-direct": "Охват рекламных баннеров в сервисах Яндекс.",
    "meta": "Охват в сервисах экосистемы компании Meta.",
    "vk": "Охват сервисов mail.ru, одноклассники, вконтакте."
}

export interface DropdownItem {
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<React.ImgHTMLAttributes<HTMLImageElement>>;
    key: string;
    name: string;
    description?: string;
}

export interface ContextMenuItem {
    key: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description?: string;
    subCategories?: ContextMenuItem[];
    link?: string;
    onClick?: () => void;
}

export interface FileUploaderRef {
    openFilePicker: () => void;
}

export interface FileMetadata {
    id: string;
    file?: File;
    previewUrl: string;
    name: string;
    type: string;
    size: number;
    status: 'uploading' | 'completed' | 'error';
    progress: number;
    serverUrl?: string;
}

export interface Device {
    name: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const devices: Record<string, Device> = {
    "google-chrome": {
        name: "Google Chrome",
        Icon: GoogleChrome
    },
    "samsung-browser": {
        name: "Samsung",
        Icon: SamsungBrowser
    },
    "microsoft-edge": {
        name: "Microsoft Edge",
        Icon: MicrosoftEdge
    },
    "vivaldi": { 
        name: "Vivaldi",
        Icon: Vivaldi
    },
    "firefox": {
        name: "Firefox",
        Icon: Firefox
    },
    "opera": {
        name: "Opera",
        Icon: Opera
    },
    "yandex": {
        name: "Yandex",
        Icon: Yandex
    },
    "safari": {
        name: "Safari",
        Icon: Safari
    },
    "desktop": {
        name: "Desktop",
        Icon: Desktop
    },
    "android": {
        name: "Android",
        Icon: Android
    },
    "apple": {
        name: "Apple",
        Icon: Apple
    }
}

export interface Status {
    name: "Активна" | "На паузе" | "Завершена";
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const statuses: Record<string, Status> = {
    "active": {
        name: "Активна",
        Icon: SparklesFilled
    },
    "pause": {
        name: "На паузе",
        Icon: Pause
    },
    "end": {
        name: "Завершена",
        Icon: CalendarChecked
    }
}


export type FilterType = "days" | "current-month" | "other";

export interface FilterState {
  type: FilterType;
  item: DropdownItem;
  rangeStart?: string;
  rangeEnd?: string;
}

export const graphFilterItems: DropdownItem[] = [
    {key: "current-month", name: "Текущий месяц"},
    {key: "7", name: "Последние 7 дней"},
    {key: "30", name: "Последние 30 дней"},
    {key: "60", name: "Последние 60 дней"},
    {key: "90", name: "Последние 90 дней"},
    {key: "365", name: "Последние 365 дней"},
    {key: "other", name: "Другое"}
]