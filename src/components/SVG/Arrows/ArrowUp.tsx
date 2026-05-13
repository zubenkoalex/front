import { FC } from "react";

export const ArrowUp: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 0.183117C3.55804 0.125063 3.62695 0.0790106 3.70278 0.0475911C3.77862 0.0161716 3.85991 0 3.942 0C4.02409 0 4.10538 0.0161716 4.18122 0.0475911C4.25705 0.0790106 4.32596 0.125063 4.384 0.183117L7.884 3.68312L7 4.56712L4.567 2.13412V9.12512H3.317V2.13412L0.884 4.56712L0 3.68312L3.5 0.183117Z" />
        </svg>
    );
};