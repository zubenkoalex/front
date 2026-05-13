import {FC, useEffect, useMemo } from 'react';
import styles from "./Toast.module.scss";
import { AnimatePresence, motion } from 'motion/react';
import { useActions, useAppSelector } from '../../../hooks/redux';
import { allActions } from '../../../store/reducers/actions';
import { ToastIcons } from '../../../types/UI';

interface ComponentProps {
    position: 'bottom-center';
    autoDelete?: boolean;
    autoDeleteTime?: number;
}

export const Toast: FC<ComponentProps> = ({
    position,
    autoDelete = true,
    autoDeleteTime = 3000,
}) => {
    const {toasts} = useAppSelector(state => state.pageReducer)
    const {deleteToast} = useActions(allActions.page)

    useEffect(() => {
        if (!autoDelete || toasts.length === 0) return;

        const interval = setInterval(() => {
            if (toasts.length > 0) {
                deleteToast(toasts[0]);
            }
        }, autoDeleteTime);

        return () => clearInterval(interval);
    }, [toasts, autoDelete, autoDeleteTime]);

    const visibleToasts = useMemo(() => 
        toasts.slice(0, 4), [toasts]
    );

    return (
        <div className={`${styles["toast-conatiner"]} ${styles[position]}`}>
            <AnimatePresence>
                {visibleToasts.map((toast) => {
                    const Icon = ToastIcons[toast.type];
                    return (
                        <motion.div 
                            key={toast.id} 
                            className={`${styles["toast"]} ${styles[toast.type]}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Icon className={`${styles["icon"]} ${styles[toast.type]}`}/>
                            <span className={`${styles["title"]} ${styles[toast.type]}`}>{toast.description}</span>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    );
};