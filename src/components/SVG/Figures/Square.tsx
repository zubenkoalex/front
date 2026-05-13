import { FC } from "react";

export const Square: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="5" height="5" />
        </svg>
);
};