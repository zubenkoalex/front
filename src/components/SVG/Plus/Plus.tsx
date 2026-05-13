import { FC } from "react";

export const Plus: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.125 9.625V5.125M5.125 5.125V0.625M5.125 5.125H9.625M5.125 5.125H0.625" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
    );
};