import { FC } from "react";

export const CirclePlus: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0.5C23.0081 0.5 29.5 6.99187 29.5 15C29.5 23.0081 23.0081 29.5 15 29.5C6.99187 29.5 0.5 23.0081 0.5 15C0.5 6.99187 6.99187 0.5 15 0.5ZM15 8.5C14.7239 8.5 14.5 8.72386 14.5 9V14.5H9C8.72386 14.5 8.5 14.7239 8.5 15C8.5 15.2761 8.72386 15.5 9 15.5H14.5V21C14.5 21.2761 14.7239 21.5 15 21.5C15.2761 21.5 15.5 21.2761 15.5 21V15.5H21C21.2761 15.5 21.5 15.2761 21.5 15C21.5 14.7239 21.2761 14.5 21 14.5H15.5V9C15.5 8.72386 15.2761 8.5 15 8.5Z" strokeLinecap="round"/>
            <defs>
                <linearGradient id="dark" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="#555555" />
                </linearGradient>
                <linearGradient id="light" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#555555" />
                    <stop offset="1" stopColor="black" />
                </linearGradient>
            </defs>
        </svg>
    );
};