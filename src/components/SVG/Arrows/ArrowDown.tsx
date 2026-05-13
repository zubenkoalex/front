import { FC } from "react";

export const ArrowDown: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 8.94201C3.55804 9.00006 3.62695 9.04611 3.70278 9.07753C3.77862 9.10895 3.85991 9.12512 3.942 9.12512C4.02409 9.12512 4.10538 9.10895 4.18122 9.07753C4.25705 9.04611 4.32596 9.00006 4.384 8.94201L7.884 5.44201L7 4.55801L4.567 6.99101V5.72205e-06H3.317V6.99101L0.884 4.55801L0 5.44201L3.5 8.94201Z" />
        </svg>
    );
};