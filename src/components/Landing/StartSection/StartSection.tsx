import {FC, HTMLProps} from 'react'
import styles from './StartSection.module.scss'
import { motion } from 'motion/react';
import { BackgroundBlob, BackgroundMesh, Button, SectionMarker } from '../../UI';
import { ArrowRight, Sparkles } from '../../SVG';
import { Stocks } from '../../SVG/Arrows/Stocks';
import { PlatformName, platforms } from '../../../types/Lending';
import { useNavigate } from 'react-router-dom';

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const StartSection: FC<ComponentProps> = ({
    className
}) => {

    const navigate = useNavigate();

    const getLineXPosition = (platformName: PlatformName): string => {
        switch(platformName.toLowerCase()) {
            case 'youtube':
                return '24%';
            case 'instagram':
                return '24%';
            case 'facebook':
                return '76%';
            case 'linkedin':
                return '86%';
            case 'google':
                return '61%';
            default:
                return '50%';
        }
    };

    const getLineYPosition = (platformName: PlatformName): string => {
        switch(platformName.toLowerCase()) {
            case 'youtube':
                return '19%';
            case 'facebook':
                return '19%';
            case 'instagram':
                return '81%';
            case 'linkedin':
                return '66%';
            case 'google':
                return '84%';
            default:
                return '50%';
        }
    };

    return (
        <div className={`${styles["section"]} ${className ? className : ""}`}>
            <div className={styles["blobs"]}>
                <BackgroundBlob className={`${styles["blob"]} ${styles["top-left"]}`} color="orange" animation="scale" />
                <BackgroundBlob className={`${styles["blob"]} ${styles["top-right"]}`} color="pink" animation="scale" delay={1000} />
                <BackgroundBlob className={`${styles["blob"]} ${styles["bottom-left"]}`} color="purple" animation="scale" delay={2000} />
            </div>

            <BackgroundMesh />

            <div className={styles["container"]}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles["content"]}
                >
                    <SectionMarker className={styles["section-marker"]}>
                        <Sparkles className={styles["icon"]} />
                        <span>AI-powered рекомендации</span>
                    </SectionMarker>

                    <div className={styles["title"]}>
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Умный
                        </motion.span>

                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            калькулятор
                        </motion.span>
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className={styles["highlight"]}
                        >
                            <span className={styles["gradient"]}>
                                рекламных

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className={styles["underline"]}
                            />
                            </span>
                        </motion.span>
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className={styles["gradient"]}
                        >
                            кампаний
                        </motion.span>
                    </div>
                                
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className={styles["description"]}
                    >
                        Получите персонализированные рекомендации по размещению рекламы на основе вашего бюджета с помощью AI-агента.
                    </motion.span>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className={styles["actions"]}
                    >
                        <Button className={styles["action"]} contentClassName={styles["action-content"]} onClick={() => navigate("/login")}>
                            <span>Начать бесплатно</span>
                            <ArrowRight className={styles["icon"]} />
                        </Button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={styles["visualisation-container"]}
                >
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={styles["central-hub"]}
                    >
                        <Stocks className={styles["icon"]} />
                        <span>AI Engine</span>
                    </motion.div>

                    {/* Connection lines */}
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={`line-${index}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                            className={`${styles["connection-line"]} ${styles[platform.name.toLowerCase()]}`}
                        >
                            <svg className={styles["svg"]} style={{ overflow: 'visible' }}>
                                <motion.line
                                    x1="50%"
                                    y1="50%"
                                    x2={getLineXPosition(platform.name)}
                                    y2={getLineYPosition(platform.name)}
                                    stroke="url(#gradient)"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>
                    ))}
                    
                    {/* Platform cards */}
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={platform.name}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                y: [0, -10, 0],
                            }}
                            transition={{
                                delay: 1 + index * 0.2,
                                y: {
                                    delay: 2,
                                    repeat: Infinity,
                                    duration: 2 + index * 0.3,
                                    ease: "easeInOut"
                                }
                            }}
                            whileHover={{ 
                                scale: 1.1, 
                                rotate: 5
                            }}
                            className={`${styles["platform-card"]} ${styles[platform.name.toLowerCase()]}`}
                        >
                            <div className={styles["icon-container"]}>
                                <platform.icon className={styles["icon"]} />
                            </div>
                            <div className={styles["name"]}>{platform.name}</div>
                        </motion.div>
                    ))}

                    {/* Animated particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            className={styles["particle"]}
                            animate={{
                                x: [0, Math.random() * 400 - 200],
                                y: [0, Math.random() * 400 - 200],
                                opacity: [0, 1, 0],
                                scale: [0.2, 1, 0.2]
                            }}
                            transition={{
                                delay: 2 + i * 0.3,
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </div> 
    )
};