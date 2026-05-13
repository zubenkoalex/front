import {FC, HTMLProps} from 'react'
import styles from './GradientCard.module.scss'
import { GradientCardData } from '../../../types/Lending';
import { motion, MotionProps } from 'motion/react';


export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    layoutClassName?: HTMLProps<HTMLElement>["className"];
    contentClassName?: HTMLProps<HTMLElement>["className"];
    nameClassName?: HTMLProps<HTMLElement>["className"];
    data: GradientCardData;
    children?: React.ReactNode;
    cardChildren?: React.ReactNode;
    layoutChildren?: React.ReactNode;
    contentChildren?: React.ReactNode;
    index?: number;
    cardMotionProps?: MotionProps;
}

export const GradientCard: FC<ComponentProps> = ({
    index = 0,
    data,
    children,
    cardChildren,
    contentChildren,
    layoutChildren,
    cardMotionProps,
    nameClassName,
    contentClassName,
    layoutClassName,
    className,
}) => {

    return (
        <motion.div 
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}   
            className={`${styles["card-container"]} ${className ? className : ""}`}  
            {...cardMotionProps}
        >
            {children}
            <motion.div
                className={styles["card"]}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                {cardChildren}
                <div className={`${styles["layout"]} ${layoutClassName ? layoutClassName : ""}`}>
                    {layoutChildren}
                    <div className={`${styles["content"]} ${contentClassName ? contentClassName : ""}`}>
                        <div className={styles["icon-container"]} style={{ background: data.gradient }}>
                            <data.icon className={styles["icon"]} />
                        </div>
                        <div className={`${styles["name"]} ${nameClassName ? nameClassName : ""}`}>
                            <span className={styles["title"]}>{data.title}</span>
                            <span className={styles["description"]}>{data.description}</span>
                        </div>
                        {contentChildren}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
};