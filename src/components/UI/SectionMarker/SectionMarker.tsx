import {FC, HTMLProps} from 'react'
import styles from './SectionMarker.module.scss'
import { motion } from 'motion/react';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    children: React.ReactNode;
    type?: "primary" | "secondary";
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const SectionMarker: FC<ComponentProps> = ({
    className,
    children,
    type = "primary",
    Icon
}) => {

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`${styles["section-marker"]} ${styles[type]} ${className ? className : ""}`}
        >
            {Icon && <Icon className={styles["icon"]} />}
            {children}
        </motion.div>
    )
};