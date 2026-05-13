import {FC, HTMLProps} from 'react'
import styles from './SectionHeader.module.scss'
import { SectionMarker } from '../SectionMarker/SectionMarker';
import { motion } from 'motion/react';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    marker: {
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        type: "primary" | "secondary";
        text: string;
    }
    title: string;
    titleHighlight?: string;
    description: string;
}

export const SectionHeader: FC<ComponentProps> = ({
    className,
    marker,
    title,
    titleHighlight,
    description
}) => {

    return (
        <div className={`${styles["section-header"]} ${className ? className : ""}`} >
            <SectionMarker type={marker.type} Icon={marker.icon}>
                <span>{marker.text}</span>
            </SectionMarker>
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={styles["title"]}
            >
                {title}
                {titleHighlight &&
                    <span className={styles["highlighted"]}>
                        <span className={styles["text"]}>
                            {titleHighlight}
                        </span>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className={styles["underline"]}
                        />
                    </span>
                }
            </motion.span>
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles["description"]}
            >
                {description}
            </motion.span>
        </div>
    )
};