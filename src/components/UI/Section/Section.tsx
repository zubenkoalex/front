import {FC, HTMLProps} from 'react'
import styles from './Section.module.scss'

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    contentClassName?: HTMLProps<HTMLElement>["className"];
    children: React.ReactNode;
    backgroundEffects?: React.ReactNode;
}

export const Section: FC<ComponentProps> = ({
    className,
    contentClassName,
    children,
    backgroundEffects
}) => {

    return (
        <div className={`${styles["section"]} ${className ? className : ""}`} >
            {backgroundEffects}
            <div className={`${styles["content"]} ${contentClassName ? contentClassName : ""}`}>
                {children}
            </div>
        </div>
    )
};