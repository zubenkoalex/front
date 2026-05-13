import {FC, HTMLProps} from 'react'
import styles from './FeaturesSection.module.scss'
import { Logotype } from '../../SVG';
import { BackgroundBlob, GradientCard, Section, SectionHeader } from '../../UI';
import { features } from '../../../types/Lending';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const FeaturesSection: FC<ComponentProps> = ({
    className
}) => {

    return (
        <Section
            className={className}
            backgroundEffects={<div className={styles["blobs"]}>
                <BackgroundBlob className={`${styles["blob"]} ${styles["top-left"]}`} color="orange" animation="opacity" />
                <BackgroundBlob className={`${styles["blob"]} ${styles["bottom-right"]}`} color="purple" animation="opacity" delay={1000} />
            </div>}
        >
            <SectionHeader 
                title="Всё что нужно для успешной рекламыт"
                description="Комплексный инструмент для планирования и оптимизации ваших рекламных кампаний"
                marker={{
                    type: "secondary",
                    icon: Logotype,
                    text: "Преимущества"
                }}
            />
            <div className={styles["cards"]}>
                {features.map((feature, index) => (
                    <GradientCard
                        key={index}
                        index={index}
                        data={feature}
                        children={
                            <div className={styles["border-gradient"]} style={{ background: feature.gradient }} /> 
                        }
                        cardChildren={
                            <div className={styles["background-gradient"]} style={{ background: feature.gradient }} />
                        }
                        layoutChildren={
                            <div className={styles["shine-effect"]} />
                        }
                        cardMotionProps={{
                            whileHover: {y: -8},
                            transition: {duration: 0.1}
                        }}
                        className={styles["feature-container"]}
                    />
                ))}
            </div>
        </Section>
    )
};