import {FC, HTMLProps} from 'react'
import styles from './ProcessSection.module.scss'
import { ArrowRight, Logotype } from '../../SVG';
import { GradientCard, Section, SectionHeader } from '../../UI';
import { motion } from 'motion/react';
import { steps } from '../../../types/Lending';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const ProcessSection: FC<ComponentProps> = ({
    className
}) => {

    return (
        <Section
            className={className}
            backgroundEffects={
                <div className={styles["radial-overlay"]} />
            }
        >
            <SectionHeader 
                title="Как это работает"
                description="Всего три простых шага до персонализированной рекламной стратегии"
                marker={{
                    type: "secondary",
                    icon: Logotype,
                    text: "Процесс работы"
                }}
            />
            <div className={styles["process"]}>
                <div className={styles["timeline-container"]}>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={styles["timeline"]}
                    />
                </div>
                <div className={styles["cards"]}>
                    {steps.map((step, index) => (
                        <GradientCard
                            key={index}
                            index={index}
                            data={step}
                            contentChildren={ 
                                index < steps.length - 1 && (
                                    <div className={styles["navigation"]}>
                                        <span>Далее</span>
                                        <ArrowRight className={styles["icon"]} />
                                    </div>
                                )
                            }
                            layoutChildren={
                                <motion.div
                                    initial={{ scale: 0   , x: "-50%", y: "-50%" }}
                                    whileInView={{ scale: 1, x: "-50%", y: "-50%" }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 + 0.6 }}
                                    className={styles["indicator-dot"]}
                                    style={{ background: step.gradient }}
                                />  
                            }
                            children={
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 0.1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 + 0.3 }}
                                    className={styles["card-number"]}
                                    style={{ 
                                        background: step.gradient,
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text"
                                    }}
                                >
                                    {`0${index+1}`}
                                </motion.div>

                            }
                            className={styles["process-container"]}
                            layoutClassName={styles["process-layout"]}
                            contentClassName={styles["process-content"]}
                            nameClassName={styles["process-name"]}
                        />
                    ))}
                </div>
            </div>
        </Section>
    )
};