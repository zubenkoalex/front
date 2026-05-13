import { FC } from "react";

export const YandexDirect: FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg {...props} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_213_502)">
                <path d="M39.829 0.119995H0.137087V39.8119H39.829V0.119995Z" fill="url(#paint0_linear_213_502)"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M45.058 2.51031C47.8596 3.41138 49.3709 6.40332 48.4335 9.19297L38.3316 39.2588C37.3942 42.0485 34.3634 43.5796 31.5618 42.6786C28.7602 41.7773 27.249 38.7855 28.1863 35.9958L31.5664 25.9353L-15.3977 69.036L-22.871 60.8926L24.061 17.8213L13.8387 20.3056C10.9789 21.0005 8.1274 19.2386 7.4695 16.3702C6.8116 13.5017 8.59674 10.613 11.4562 9.91804L41.4143 2.63759C42.5403 2.18864 43.8216 2.1126 45.058 2.51031Z" fill="url(#paint1_linear_213_502)"/>
            </g>
            <defs>
                <linearGradient id="paint0_linear_213_502" x1="-12.561" y1="10.7248" x2="36.9894" y2="60.7681" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#315BEA"/>
                    <stop offset="1" stopColor="#2F2DD4"/>
                </linearGradient>
                <linearGradient id="paint1_linear_213_502" x1="-12.2761" y1="43.9047" x2="67.8569" y2="9.14261" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF01E"/>
                    <stop offset="1" stopColor="#FFD21E"/>
                </linearGradient>
                <clipPath id="clip0_213_502">
                    <rect width="40" height="40" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
};