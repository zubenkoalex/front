import { FC } from "react";

export const ArrowStroke: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.67505 4.67499L4.67505 0.674988L0.675049 4.67499" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};