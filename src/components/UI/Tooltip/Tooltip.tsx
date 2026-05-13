import { FC, HTMLProps, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Tooltip.module.scss";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    contentClassName?: HTMLProps<HTMLElement>["className"];
    children?: ReactNode;
    content: ReactNode;
}

export const Tooltip: FC<ComponentProps> = ({
    className,
    contentClassName,
    content,
    children
}) => {
    const [visible, setVisible] = useState(false);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setTimeout(() => setVisible(false), 150);
    };

    return (
        <>
            <div
                onMouseEnter={show}
                onMouseLeave={hide}
                className={`${styles["trigger"]} ${children ? "" : styles["tooltip"]} ${className ?? ""}`}
            >
                {children ?? <span>?</span>}
            </div>

            {visible && (
                <div className={`${styles["content"]} ${visible ? styles["mounted"] : ""} ${contentClassName ?? ""}`}>
                    {content}
                </div>
            )}
        </>
    )
}