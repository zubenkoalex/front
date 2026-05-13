import { FC, HTMLProps } from 'react';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    progress: number;
    radius: number;
    strokeWidth?: number;
}

export const CircularProgress: FC<ComponentProps> = ({
    className,
    progress,
    radius,
    strokeWidth = 2
}) => {
    const circumference = 2 * Math.PI * radius;
    const safeProgress = Math.min(Math.max(progress, 0), 100);
    const offset = circumference - (safeProgress / 100) * circumference;

    const size = (radius + strokeWidth) * 2;
    const center = size / 2;

    return (
        <svg 
            className={className} 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`} 
        >
            <g transform={`rotate(-90 ${center} ${center})`}>
                <circle 
                    cx={center} 
                    cy={center} 
                    r={radius} 
                    fill="none" 
                />
                <circle 
                    cx={center} 
                    cy={center} 
                    r={radius} 
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
            </g>
        </svg>
    );
};