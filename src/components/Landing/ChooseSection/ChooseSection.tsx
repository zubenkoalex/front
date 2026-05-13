import {FC, HTMLProps} from 'react'
import styles from './ChooseSection.module.scss'
import { ArrowRight, Logotype } from '../../SVG';
import { BackgroundBlob, Button, GradientCard, Section, SectionHeader } from '../../UI';
import { benefits, stats } from '../../../types/Lending';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const ChooseSection: FC<ComponentProps> = ({
    className
}) => {

    const navigate = useNavigate();

    return (
        <Section
            className={`${styles["section"]} ${className ? className : ""}`}
            backgroundEffects={<div className={styles["blobs"]}>
                <BackgroundBlob className={`${styles["blob"]} ${styles["top-left"]}`} color="orange" animation="opacity" />
                <BackgroundBlob className={`${styles["blob"]} ${styles["right-bottom"]}`} color="pink" animation="opacity" delay={1000} />
            </div>}
        >
            <SectionHeader 
                title="Почему выбирают "
                titleHighlight="Adzen"
                description="Наш инструмент помогает предпринимателям принимать обоснованные решения и достигать максимальной отдачи от рекламных инвестиций."
                marker={{
                    type: "primary",
                    icon: Logotype,
                    text: "Инновационный подход"
                }}
            />
            <div className={styles["stats-cards"]}>
                {stats.map((card, index) => (
                    <GradientCard
                        key={index}
                        index={index}
                        data={card}
                        children={
                            <div className={styles["glow"]}/>
                        }
                        className={styles["stats-container"]}
                        layoutClassName={styles["stats-layout"]}
                        contentClassName={styles["stats-content"]}
                        nameClassName={styles["stats-name"]}
                    />
                ))}
            </div>
            <div className={styles["benefits-cards"]}>
                {benefits.map((card, index) => (
                    <GradientCard
                        key={index}
                        index={index}
                        data={card}
                        children={
                            <div className={styles["border-gradient"]} style={{ background: card.gradient }} /> 
                        }
                        cardChildren={<>
                            <div className={styles["background-gradient"]} style={{ background: card.gradient }} />
                        </>}
                        cardMotionProps={{
                            whileHover: {y: -8},
                            transition: {duration: 0.1}
                        }}
                        className={styles["benefits-container"]}
                        contentClassName={styles["benefits-content"]}
                        nameClassName={styles["benefits-name"]}
                    />
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={styles["actions"]}
            >
                <Button className={styles["action"]} contentClassName={styles["action-content"]} onClick={() => navigate("/login")}>
                    <span>Начать бесплатно</span>
                    <ArrowRight className={styles["icon"]} />
                </Button>
            </motion.div>
        </Section>
    )
};