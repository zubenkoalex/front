import { FC } from "react";

export const Copy: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="default-1" d="M13 4V13H4V4H13ZM13 3H4C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V13C3 13.2652 3.10536 13.5196 3.29289 13.7071C3.48043 13.8946 3.73478 14 4 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V4C14 3.73478 13.8946 3.48043 13.7071 3.29289C13.5196 3.10536 13.2652 3 13 3Z" />
            <path id="gradient-1" fill="url(#gradient-1)" d="M13 4V13H4V4H13ZM13 3H4C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V13C3 13.2652 3.10536 13.5196 3.29289 13.7071C3.48043 13.8946 3.73478 14 4 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V4C14 3.73478 13.8946 3.48043 13.7071 3.29289C13.5196 3.10536 13.2652 3 13 3Z" />
            
            <path id="default-2" d="M1 8H0V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H8V1H1V8Z" />
            <path id="gradient-2" fill="url(#gradient-2)" d="M1 8H0V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H8V1H1V8Z" />
            
            <defs>
                <linearGradient id="gradient-1" x1="7.29422" y1="0.881885" x2="7.29422" y2="12.4933" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#169CFD"/>
                    <stop offset="0.5" stopColor="#1276ED"/>
                    <stop offset="1" stopColor="#0E50DE"/>
                </linearGradient>
                <linearGradient id="gradient-2" x1="7.29422" y1="0.881885" x2="7.29422" y2="12.4933" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#169CFD"/>
                    <stop offset="0.5" stopColor="#1276ED"/>
                    <stop offset="1" stopColor="#0E50DE"/>
                </linearGradient>
            </defs>
        </svg>
    );
};