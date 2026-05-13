import {FC, HTMLProps, useEffect, useState} from 'react'
import styles from '../Authorization.module.scss'
import { Button, Input } from '../../UI';
import { ArrowRight, Key, Mail } from '../../SVG';
import useInput from '../../../hooks/useInput';
import { Variant } from '../../../types/UI';
import { isInvalidEmail, validateInput } from '../../../utils/validator';
import { useSendEmailMutation } from '../../../services/accountService';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const Recovery: FC<ComponentProps> = ({
    className
}) => {
    const [sendEmail, { isLoading }] = useSendEmailMutation();

    const emailInput = useInput("");
    const [emailInputVariant, setEmailInputVariant] = useState<Variant>("default");
    const [emailInputError, setEmailInputError] = useState<string | undefined>("");

    const [disableButton, setDisableButton] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (emailInput.value.length > 0 || (emailInput.value.length === 0 && emailInputVariant != 'default'))
                validateInput(emailInput.value, isInvalidEmail, setEmailInputVariant, setEmailInputError);
        }, 1000);

        return () => clearTimeout(timer);
    }, [emailInput.value])

    useEffect(() => {
        if (emailInputVariant === "success")
            setDisableButton(false);
        else
            setDisableButton(true);
    }, [emailInputVariant]);

    const handleRecoveryButton = async () => await sendEmail({ 
        type: "authorization",
        email: emailInput.value
    }).unwrap();
    

    return (
        <div className={`${styles["form"]} ${className ? className : ""}`}>
            <div className={styles["info"]}>
                <div className={styles["icon-container"]}>
                    <Key className={styles["icon"]} />
                </div>
                <span className={styles["title"]}>Забыли пароль?</span>
                <span className={styles["description"]}>Введите email, указанный при регистрации, и мы отправим вам код для восстановления пароля.</span>
            </div>
            <Input 
                {...emailInput} 
                type="text" 
                placeholder="Введите email" 
                disabled={false} 
                variant={emailInputVariant} 
                errorMessage={emailInputError}
                Icon={Mail}
            />
            <Button 
                className={styles["action-button"]} 
                contentClassName={styles["content"]}
                disabled={disableButton}
                onClick={handleRecoveryButton}
                isLoading={isLoading}
            >
                <span>Отправить код</span>
                <ArrowRight className={styles["icon"]} />
            </Button>
        </div>
    )
};