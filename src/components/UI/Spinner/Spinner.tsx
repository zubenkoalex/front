import {FC, HTMLProps} from 'react'
import styles from './Spinner.module.scss'

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const Spinner: FC<ComponentProps> = ({
    className
}) => {

    return (
        <span className={`${styles["loader"]} ${className ? className : ""}`} />
    )
};