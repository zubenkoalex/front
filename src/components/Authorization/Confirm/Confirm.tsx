import {FC, HTMLProps, useEffect, useState} from 'react'
import styles from '../Authorization.module.scss'
import { useAppSelector } from '../../../hooks/redux';
import { TwoFactorCodeInput } from '../../UI/TwoFactorCodeInput/TwoFactorCodeInput';
import { Security } from '../../SVG';
import { useConfirmServiceMutation } from '../../../services/accountService';
import { Variant } from '../../../types/UI';
import { motion } from 'motion/react';
import { getErrorMessage } from '../../../utils';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    type: "email" | "google";
    receiveService?: () => void;
    title: string;
    value?: string;
}

export const Confirm: FC<ComponentProps> = ({
    className,
    type,
    receiveService,
    title,
    value
}) => {
    const {email} = useAppSelector(state => state.authorizationReducer)
    const [confirmService, { error, isError, isSuccess }] = useConfirmServiceMutation();

    const [code, setCode] = useState<string[]>([]);
    const [receiveTimer, setReceiveTimer] = useState<number>(60);
    const [inputVariant, setInputVariant] = useState<Variant>("default");

    const handleCodesChange = (newCode: string[]) => {
        setCode(newCode);
    };

    const handleService = async () => await confirmService({
        service: type,
        type: "auth",
        code,
        email: type === "email" ? email : undefined
    }).unwrap();

    useEffect(() => {
        if (code.filter(e => e != '').length === 6) 
            handleService();
    }, [code]);

    const handleReceive = () => {
        if (receiveTimer > 0) return;

        if (receiveService) {
            receiveService();
            setReceiveTimer(60);
        }
    };

    useEffect(() => {
        if (receiveTimer <= 0) return;

        const interval = setInterval(() => {
            setReceiveTimer(receiveTimer - 1)
        }, 1000);
        return () => clearInterval(interval);
    }, [receiveTimer]);

    useEffect(() => {
        if (isError)
            setInputVariant("error");
        else if (isSuccess)
            setInputVariant("success");
        else
            setInputVariant("default");


        const timeout = setTimeout(() => {
            if (isError)
                setInputVariant("default");
        }, 500);

        return () => clearTimeout(timeout);
    }, [isError, isSuccess])

    return (
        <div className={`${styles["form"]} ${className ? className : ""}`}>
            <div className={styles["info"]}>
                <div className={styles["icon-container"]}>
                    <Security className={styles["icon"]} />
                </div>
                <span className={styles["title"]}>Введите код</span>
                <div className={styles["description"]}>
                    <span>{title}</span>
                    {value && <span className={styles["value"]}>{value}</span>}
                </div>
                {isError && 
                    <motion.div
                        key="error"
                        initial={{ 
                            opacity: 0, 
                            height: 0, 
                        }}
                        animate={{ 
                            opacity: 1, 
                            height: 'auto',
                        }}
                        transition={{ duration: 0.05 }}
                        className={`${styles["feedback"]} ${styles["error"]}`}
                    >
                        {getErrorMessage(error)}
                    </motion.div>
                }
            </div>
            <TwoFactorCodeInput variant={inputVariant} onCodesChange={handleCodesChange} />
            {
                value &&
                <span
                    className={`${styles["receive-letter"]} ${receiveTimer > 0 ? styles["disabled"] : ''}`}
                    onClick={handleReceive}
                >
                    {receiveTimer > 0 ? `Повторить через ${receiveTimer} сек.` : "Не пришёл код?"}
                </span>
            }
        </div>
    )
};