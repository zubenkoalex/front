import { FC } from "react";
import { useSpring, animated } from "@react-spring/web";

export const Logout: FC<{ isHovered: boolean } & React.SVGProps<SVGSVGElement>> = ({ isHovered, ...props }) => {

    const { d } = useSpring({
        d: isHovered
            ? "M25 21.25L23.2812 19.4375L26.4688 16.25H16.25V13.75H26.4688L23.2812 10.5625L25 8.75L31.25 15L25 21.25Z"
            : "M20 21.25L18.2812 19.4375L21.4688 16.25H11.25V13.75H21.4688L18.2812 10.5625L20 8.75L26.25 15L20 21.25Z",
        config: { duration: 70 },
    });

    return (
        <svg {...props} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.25 26.25C5.5625 26.25 4.97396 26.0052 4.48438 25.5156C3.99479 25.026 3.75 24.4375 3.75 23.75V6.25C3.75 5.5625 3.99479 4.97396 4.48438 4.48438C4.97396 3.99479 5.5625 3.75 6.25 3.75H15V6.25H6.25V23.75H15V26.25H6.25Z" />
            <animated.path d={d} />
        </svg>
    );
};