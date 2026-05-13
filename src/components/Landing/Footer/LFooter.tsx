import {FC, HTMLProps} from 'react';
import styles from './Footer.module.scss'
import { Logotype } from '../../SVG';
import { Section } from '../../UI';
import { motion } from 'motion/react';
import { socialLinks } from '../../../types/Lending';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const Footer: FC<ComponentProps> = ({
    className
}) => {

    return (
        <Section
            className={`${styles["footer-container"]} ${className ? className : ""}`}
            backgroundEffects={
                <div className={styles["background-glow"]} />
            }
            contentClassName={styles["footer-content"]}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={styles["info"]}
            >
                <div className={styles["logotype"]}>
                    <div className={styles["icon-container"]}>
                        <Logotype className={styles["icon"]} />
                    </div>
                    <span className={styles["name"]}>Adzen</span>
                </div>
                <span className={styles["description"]}>Умный калькулятор рекламных кампаний с AI</span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={styles["social-links"]}
            >
                {socialLinks.map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles["social-link"]}
                    >
                        <social.icon className={styles["icon"]} />
                    </motion.a>
                ))}
            </motion.div>
                
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles["line"]}
            />

            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={styles["copyright"]}
            >
                © 2026 Adzen. Все права защищены.
            </motion.span>
        </Section>
    )
};