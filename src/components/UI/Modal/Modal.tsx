import { FC, HTMLProps } from "react";
import styles from "./Modal.module.scss";
import { Cross } from "../../SVG";
import { AnimatePresence, motion } from "motion/react";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    classNameContainer?: HTMLProps<HTMLElement>["className"];
    children: React.ReactNode;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    closeButton?: boolean;
    closeButtonStyle?: "inside" | "outside"
}

export const Modal: FC<ComponentProps> = ({
    className,
    classNameContainer,
    children, 
    visible, 
    setVisible,
    closeButton = true,
    closeButtonStyle = "outside"
}) => {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${styles["modal"]} ${visible ? styles["active"] : ''} ${classNameContainer ?? ""}`} 
            onClick={() => setVisible(false)}
        >
            <div className={styles["blur-layer"]} />
            {closeButton &&  closeButtonStyle === "outside" &&              
                <div className={`${styles["close"]} ${styles[closeButtonStyle]}`} onClick={() => setVisible(false)}>
                    <Cross className={styles["icon"]} />
                </div>
            }
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.1 }}
                className={`${styles["content"]} ${className ?? ""}`} 
                onClick={(e) => e.stopPropagation()}
            >
                {closeButton &&  closeButtonStyle === "inside" &&               
                    <div className={`${styles["close"]} ${styles[closeButtonStyle]}`} onClick={() => setVisible(false)}>
                        <Cross className={styles["icon"]} />
                    </div>
                }
                {children}
            </motion.div>
        </motion.div>
    )
}