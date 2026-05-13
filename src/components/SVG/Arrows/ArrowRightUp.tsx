import { FC } from "react";

export const ArrowRightUp: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 162 162" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M45 18C40.0294 18 36 13.9705 36 9C36 4.02948 40.0294 0 45 0H153C157.97 0 162 4.02948 162 9V117C162 121.97 157.97 126 153 126C148.03 126 144 121.97 144 117V30.7279L15.3639 159.364C11.8493 162.878 6.15069 162.878 2.63601 159.364C-0.87867 155.849 -0.87867 150.151 2.63601 146.636L131.272 18H45Z" />
        </svg>
    );
};