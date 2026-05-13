import {FC, HTMLProps} from 'react'
import styles from './CTASection.module.scss'
import { ArrowRight, Sparkles } from '../../SVG';
import { BackgroundBlob, Button, Section, SectionMarker } from '../../UI';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const CTASection: FC<ComponentProps> = ({
    className
}) => {

    const navigate = useNavigate();

    return (
        <Section
            className={`${styles["section"]} ${className ? className : ""}`}
            backgroundEffects={<>
                <div className={`${styles["radial-overlay"]} ${styles["orange"]}`} />
            </>}
            contentClassName={styles["cta-content"]}
        >
            <div className={styles["blobs"]}>
                <BackgroundBlob className={styles["blob"]} color="orange" animation="pulse" />
            </div>
            
            <SectionMarker className={styles["section-marker"]} type="secondary">
                <Sparkles className={styles["icon"]} />
                <span>Начните прямо сейчас</span>
            </SectionMarker>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles["title"]}
            >
                <span>Готовы</span>
                <span className={styles["gradient"]}>оптимизировать</span>
                <span>вашу рекламу?</span>
            </motion.div>

            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className={styles["description"]}
            >
                Начните использовать AI для создания эффективных рекламных стратегий уже сегодня
            </motion.span>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={styles["actions"]}
            >
                <Button className={`${styles["action"]} ${styles["primary"]}`} contentClassName={styles["action-content"]} onClick={() => navigate("/login")}>
                    <span>Начать сейчас</span>
                    <ArrowRight className={styles["icon"]} />
                </Button>
                <Button variant="secondary" className={`${styles["action"]} ${styles["secondary"]}`}>
                    <span>Связаться с нами</span>
                </Button>
            </motion.div>
        </Section>
    )
};