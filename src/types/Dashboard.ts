import { Account, ArrowRightLong, Art, Barchart, Beauty, Cars, Chat, Click, DarkMode, Darts, Document, Education, Estate, Fashon, Finish, Food, History, LayoutDashboard, LightMode, Music, Projector, Recomendations, Security, SecurityFilled, ShowEye, Sparkles, SparklesFilled, Sport, Sustainability, SystemMode, Technology, Trips, Upload } from "../components/SVG";
import MainInfoIcon from "../assets/NewCompany/Checklist.png";
import TargetPeopleIcon from "../assets/NewCompany/Target.png";
import CreativesIcon from "../assets/NewCompany/Creatives.png";
import ForecastsIcon from "../assets/NewCompany/Forecasts.png";
import RegistrationIcon from "../assets/NewCompany/Registration.png";
import { FileMetadata } from "./UI";

export interface SideBarCategory {
    key: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    link?: string;
}

export const sideBarCategories: SideBarCategory[] = [
    { 
        key: "home",
        Icon: LayoutDashboard, 
        title: "Главная",
        link: "/dashboard"
    },
    { 
        key: "new-company",
        Icon: Sparkles, 
        title: "Новая кампания",
        link: "/dashboard/new-company"
    },
    { 
        key: "chat",
        Icon: Chat, 
        title: "Чат с AI",
        link: "/dashboard/chat"
    },
    { 
        key: "companies-history",
        Icon: History, 
        title: "История кампаний",
        link: "/dashboard/companies-history"
    }
]

export interface NewCompanyStep {
    key: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    name: string;
}

export const newCompanySteps: Record<number, NewCompanyStep> = {
    0: { key: "start", Icon: ArrowRightLong, name: "Начало" },
    1: { key: "main-info", Icon: Document, name: "Основная информация" },
    2: { key: "target-people", Icon: Darts, name: "Целевая аудитория" },
    3: { key: "creatives", Icon: SparklesFilled, name: "Креативы" },
    4: { key: "forecasts", Icon: Recomendations, name: "Прогнозы и выбор стратегии" },
    5: { key: "registration", Icon: Finish, name: "Регистрация" }
}

export const stepToKeyMap: Record<number, string> = Object.fromEntries(
    Object.entries(newCompanySteps).map(([step, stepData]) => [Number(step), stepData.key])
);

export const keyToStepMap: Record<string, number> = Object.fromEntries(
    Object.entries(newCompanySteps).map(([step, stepData]) => [stepData.key, Number(step)])
);

export interface NewCompanyMainInfo {
    name: string;
    theme: string;
    url: string;
    purpose: string;
    budget: string;
    start: string;
    end: string;
    description: string;
}

export interface NewCompanyTargetPeople {
    gender: string;
    age: string;
    country: string | string[];
    interests: string[];
}   

export interface CompanyCreative extends FileMetadata {
    generated?: boolean;
}

export interface NextRef {
  next: () => void;
}

export interface Interest {
    key: string;
    name: string;
}

export const interests: Record<string, string> = {
    "fashon": "Мода и стиль",
    "sport": "Спорт",
    "music": "Музыка",
    "trips": "Путешествия",
    "technology": "Технологии",
    "beauty": "Красота",
    "art": "Искусство",
    "education": "Образование",
    "food": "Еда и кулинария",
    "cars": "Автомобили",
    "estate": "Недвижимость",
    "sustainability": "Экологичность",
}

export const interestsIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    "fashon": Fashon,
    "sport": Sport,
    "music": Music,
    "trips": Trips,
    "technology": Technology,
    "beauty": Beauty,
    "art": Art,
    "education": Education,
    "food": Food,
    "cars": Cars,
    "estate": Estate,
    "sustainability": Sustainability,
}

export interface CompanyForecast {
    name: string;
    description: string;
    platforms: {
        key: string;
        strategies: {
            key: "cpm" | "cpc" | "cpa";
            metrics: {
                shows: number;
                clicks: number;
                ctr: number;
                conversions: number;
            },
            expense: {
                shows: number;
                clicks: number;
                conversions: number;
            }
            recommended?: boolean;
        }[];
        recommended?: boolean;
    }[];
}

export const AdCompanyMetricsIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    "shows": ShowEye,
    "clicks": Click,
    "ctr": Click,
    "conversions": Barchart
}

export const AdCompanyMetricsNames: Record<string, string> = {
    "shows": "Показов",
    "clicks": "Кликов",
    "ctr": "CTR",
    "conversions": "Конверсий"
}
export const AdCompanyExpensesNames: Record<string, string> = {
    "shows": "За 1000 показов",
    "clicks": "За 1 клик",
    "conversions": "За 1 конверсию",
    "cpm": "за 1000 показов",
    "cpc": "за 1 клик",
    "cpa": "за 1 конверсию"
}

export interface NewCompanyElementsInfo {
    Icon: string;
    name: string;
    description: string[];
}

export const newCompanyElementsInfo: Record<string, NewCompanyElementsInfo> = {
    "main-info": {
        Icon: MainInfoIcon,
        name: "Основная информация",
        description: [
            "Укажите базовую информацию о вашей кампании",
            "Ваш AI-ассистент поможет на каждом этапе."
        ]
    },
    "target-people": {
        Icon: TargetPeopleIcon,
        name: "Целевая аудитория",
        description: [
            "Определите, кому будет показываться",
            "ваша реклама."
        ]
    },
    "creatives": {
        Icon: CreativesIcon,
        name: "Креативы",
        description: [
            "Создайте или выберите изображения",
            "для вашей будущей рекламы."
        ]
    },
    "forecasts": {
        Icon: ForecastsIcon,
        name: "Прогнозы и выбор стратегии",
        description: [
            "На основе полученных данных AI-ассистент подготовил прогноз эффективности рекламной кампании.",
            "Выберите платформу и стратегию оплаты вашей рекламы."
        ]
    },
    "registration": {
        Icon: RegistrationIcon,
        name: "Регистрация кампании",
        description: [
            "Убедитесь, что вся информация в сводке компании указана правильно,",
            "и затем зарегистрируйте кампанию."
        ]
    }
}

export const companyForecastTest: CompanyForecast = {
    name: "Зимняя распродажа 2026",
    description: "Кампания направлена на продвижение сезонных акций и привлечение целевой аудитории, заинтересованной в зимних скидках и специальных предложениях. Кампания оптимизирована для достижения максимальной эффективности при контролируемой стоимости клика и высокой вероятности конверсий.",
    platforms: [
        {
            key: "google-ads",
            strategies: [
                {
                    key: "cpm",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    },
                    recommended: true
                },
                {
                    key: "cpc",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                },
                {
                    key: "cpa",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                }
            ],
            recommended: true
        },
        {
            key: "vk",
            strategies: [
                {
                    key: "cpm",
                    metrics: {
                        shows: 15000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                },
                {
                    key: "cpc",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    },
                    recommended: true
                },
                {
                    key: "cpa",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                }
            ]
        },
        {
            key: "yandex-direct",
            strategies: [
                {
                    key: "cpm",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                },
                {
                    key: "cpc",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                },
                {
                    key: "cpa",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    },
                    recommended: true
                }
            ]
        },
        {
            key: "meta",
            strategies: [
                {
                    key: "cpm",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    },
                    recommended: true
                },
                {
                    key: "cpc",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                },
                {
                    key: "cpa",
                    metrics: {
                        shows: 12000,
                        clicks: 50000,
                        ctr: 1.2,
                        conversions: 10.2
                    },
                    expense: {
                        shows: 234.5,
                        clicks: 50000,
                        conversions: 10.2
                    }
                }
            ]
        }
    ]
}

export interface Attachment {
    id: string;
    url: string;
    name: string;
    size: number;
    type: string;
}

export interface Message {
    id: string;
    chatId: string;
    sender: 'user' | 'ai';
    content: string;
    timestamp: number;
    status?: 'sending' | 'sent' | 'error' | 'thinking' | 'streaming' | 'done';
    attachments?: Attachment[];
    thinkingTime?: number;
    errorMessage?: string;
}

export interface Chat {
    id: string;
    name: string;
    messages: string[];
    createdAt: number;
    updatedAt: number;
}

export interface StreamChunkResponse {
  type: 'chunk' | 'complete' | 'error';
  data?: string;
  messageId?: string;
}

export interface Plan {
    type: "default" | "plus" | "ultra";
    price: number;
    discount?: number;
    description: string;
    advantages: {
        Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        name: string;
    }[];
}

export type SettingPages = "account" | "security" | "services" | "sessions";

export const settingsCategories: SideBarCategory[] = [
    { 
        key: "account",
        Icon: Account,
        title: "Учетная запись"
    },
    { 
        key: "security",
        Icon: SecurityFilled, 
        title: "Безопасность"
    }
]

export interface Setting {
    key: string;
    name: string;
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    values: {
        Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        name: string;
    }[];
    button: {
        name: string;
        action: () => void;
        Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }
}

export interface Theme {
    key: "dark" | "light" | "system";
    name: string;
    description: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const themes: Record<string, Theme> = {
    "dark": {
        key: "dark",
        name: "Тёмная тема",
        description: "Оформление интерфейса в тёмных тонах. Снижает нагрузку на зрение в условиях слабой освещённости и делает использование приложения более комфортным в вечернее и ночное время.",
        Icon: DarkMode
    },
    "light": {
        key: "light",
        name: "Светлая тема",
        description: "Оформление интерфейса в светлых тонах. Обеспечивает высокую контрастность и чёткость текста, что делает использование приложения максимально комфортным при хорошем освещении и ярком дневном свете.",
        Icon: LightMode
    },
    "system": {
        key: "system",
        name: "Как в системе",
        description: "Автоматическая адаптация интерфейса под системные настройки вашего устройства. Приложение само переключится на нужный режим, обеспечивая привычный комфорт в любое время суток без лишних действий.",
        Icon: SystemMode
    }
};

export interface Service {
    key: string;
    status: boolean;
    buttonAction: () => void;
}