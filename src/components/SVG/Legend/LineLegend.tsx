import { FC } from "react";

export const LineLegend: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0.798799H10V2H9C8.31 2 7.63 1.78979 7 1.3994C5.75 2.18018 4.25 2.18018 3 1.3994C2.37 1.78979 1.685 2 1 2H0V0.798799H1C1.695 0.798799 2.39 0.516517 3 0C4.22 1.02703 5.78 1.02703 7 0C7.61 0.516517 8.305 0.798799 9 0.798799Z" />
        </svg>
    );
};