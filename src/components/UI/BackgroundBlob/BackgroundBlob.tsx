import {FC, HTMLProps} from 'react'
import styles from './BackgroundBlob.module.scss'

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    color?: "orange" | "pink" | "purple" | "blue";
    animation?: "opacity" | "scale" | "pulse" | "pulse-2";
    delay?: number;
}

export const BackgroundBlob: FC<ComponentProps> = ({
    className,
    color = "orange",
    animation,
    delay
}) => {

    return (
        <div className={`
                ${styles["background-blob"]}
                ${styles[color]} 
                ${animation ? styles[`animation-${animation}`] : ""} 
                ${delay ? styles[`delay-${delay}`] : ""} 
                ${className ? className : ""}
            `} 
        />
    )
};