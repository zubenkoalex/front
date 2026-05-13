import { Barchart, CircleCheck, Clock, Darts, Dimond, Dollar, Energy, Facebook, Google, Instagram, LinkedIn, Mail, Security, Signal, Sparkles, Youtube } from "../components/SVG";
import { Stocks } from "../components/SVG/Arrows/Stocks";

export type PlatformName = 'YouTube' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'Google';

export interface Platform {
    name: PlatformName;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const platforms: Platform[] = [
  { name: 'YouTube', icon: Youtube },
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'LinkedIn', icon: LinkedIn },
  { name: 'Google', icon: Google }
];

export interface GradientCardData {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description: string;
    gradient?: string;
}

export const features: GradientCardData[] = [
    {
        icon: Sparkles,
        title: 'AI-рекомендации',
        description: 'Искусственный интеллект анализирует ваши данные и предлагает оптимальные платформы для размещения',
        gradient: 'linear-gradient(to right, #f97316, #ef4444)',
    },
    {
        icon: Darts,
        title: 'Точный таргетинг',
        description: 'Определяем идеальное аудиторию на десятках платформах с максимальной эффективностью',
        gradient: 'linear-gradient(to right, #3b82f6, #06b6d4)',
    },
    {
        icon: Stocks,
        title: 'Прогноз результатов',
        description: 'Получите прогноз охвата, конверсий и ROI до запуска кампании',
        gradient: 'linear-gradient(to right, #10b981, #10b981',
    },
    {
        icon: Energy,
        title: 'Быстрый запуск',
        description: 'Подготовьте проект кампании всего за 5 минут от идеи до готовой стратегии',
        gradient: 'linear-gradient(to right, #eab308, #f97316)',
    },
    {
        icon: Security,
        title: 'Безопасность данных',
        description: 'Все ваши данные защищены и хранятся в зашифрованном виде',
        gradient: 'linear-gradient(to right, #8b5cf6, #ec4899)',
    },
    {
        icon: Clock,
        title: 'Экономия времени',
        description: 'Автоматизируйте рутинные задачи и сосредоточьтесь на творчестве',
        gradient: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    }
];

export const steps: GradientCardData[] = [
    {
        icon: Barchart,
        title: 'Введите данные',
        description: 'Заполните информацию о бюджете, целевой аудитории, целях и временных рамках кампании',
        gradient: 'linear-gradient(to right, #3b82f6, #06b6d4)',
    },
    {
        icon: Sparkles,
        title: 'AI-анализ',
        description: 'Наш искусственный интеллект анализирует тысячи параметров и подбирает оптимальные платформы',
        gradient: 'linear-gradient(to right, #f97316, #ef4444)',
    },
    {
        icon: Stocks,
        title: 'Получите результат',
        description: 'Изучите персонализированные рекомендации с прогнозом эффективности и распределением бюджета',
        gradient: 'linear-gradient(to right, #10b981, #10b981',
    }
];

export const stats: GradientCardData[] = [
    { 
        icon: Energy, 
        title: 'Быстрый анализ', 
        description: '< 1 мин', 
        gradient: 'linear-gradient(to right, #f97316, #ec4899)'
    },
    { 
        icon: Darts, 
        title: 'Точность', 
        description: 'AI-powered',
        gradient: 'linear-gradient(to right, #f97316, #ec4899)'
    },
    { 
        icon: Dimond, 
        title: 'Качество', 
        description: 'Premium',
        gradient: 'linear-gradient(to right, #f97316, #ec4899)'
    }
];

export const benefits: GradientCardData[] = [
    { 
        icon: Dollar,
        title: 'Оптимизация рекламного бюджета', 
        description: 'Распределение средств по самым эффективным каналам',
        gradient: 'linear-gradient(to right, #10b981, #10b981'
    },
    { 
        icon: Stocks,
        title: 'Прогнозирование эффективности кампаний', 
        description: 'Предсказание результатов до запуска',
        gradient: 'linear-gradient(to right, #3b82f6, #06b6d4)'
    },
    { 
        icon: Signal,
        title: 'Поддержка всех популярных платформ', 
        description: 'Интеграция с десятками рекламных площадок',
        gradient: 'linear-gradient(to right, #8b5cf6, #ec4899)'
    },
    { 
        icon: CircleCheck,
        title: 'Детальная аналитика и отчёты', 
        description: 'Понятные визуализации и insights',
        gradient: 'linear-gradient(to right, #f97316, #ef4444)'
    },
];

export interface SocialLink {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
    label: string;
}

export const socialLinks: SocialLink[] = [
    { 
        icon: Mail, 
        href: '#', 
        label: 'Email'
    }
    // { Icon: Sparkles, href: '#', label: 'Twitter' },
    // { Icon: Sparkles, href: '#', label: 'LinkedIn' },
    // { Icon: Sparkles, href: '#', label: 'GitHub' },
];