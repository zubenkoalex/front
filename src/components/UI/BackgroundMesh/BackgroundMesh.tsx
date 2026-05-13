import {FC, HTMLProps} from 'react'
import styles from './BackgroundMesh.module.scss'

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const BackgroundMesh: FC<ComponentProps> = ({
    className
}) => {

    return (
        <div className={`${styles["background-mesh"]} ${className ? className : ""}`} />
    )
};