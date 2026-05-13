import {FC, HTMLProps, useEffect, useState} from 'react'
import styles from '../Authorization.module.scss'
import { Button, Input } from '../../UI';
import { useAppSelector } from '../../../hooks/redux';
import useInput from '../../../hooks/useInput';
import { Variant } from '../../../types/UI';
import { ArrowRight, Lock } from '../../SVG';
import { isInvalidPassword, validateInput } from '../../../utils/validator';
import { useChangePasswordMutation } from '../../../services/accountService';
import { getErrorMessage } from '../../../utils';
import { motion } from 'motion/react';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const RecoveryPassword: FC<ComponentProps> = ({
    className
}) => {
    const {email} = useAppSelector(state => state.authorizationReducer)

    const [changePassword, { isLoading, error, isError }] = useChangePasswordMutation();

    const passwordInput = useInput("");
    const [passwordInputVariant, setPasswordInputVariant] = useState<Variant>("default");
    const [passwordInputError, setPasswordInputError] = useState<string | undefined>("");

    const repeatPasswordInput = useInput("");
    const [repeatPasswordInputVariant, setRepeatPasswordInputVariant] = useState<Variant>("default");
    const [repeatPasswordInputError, setRepeatPasswordInputError] = useState<string | undefined>("");

    const [disableButton, setDisableButton] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (passwordInput.value.length > 0 || (passwordInput.value.length === 0 && passwordInputVariant != 'default'))
                validateInput(passwordInput.value, isInvalidPassword, setPasswordInputVariant, setPasswordInputError);

            if ((repeatPasswordInput.value.length === 0 && passwordInput.value.length > 0) || repeatPasswordInput.value.length > 0)
            {
                if (passwordInputVariant != "success")
                {
                    setRepeatPasswordInputError("")
                    setRepeatPasswordInputVariant('error')
                }
                else {

                    if (passwordInput.value !== repeatPasswordInput.value) {
                        setRepeatPasswordInputError("Пароли должны совпадать.")
                        setRepeatPasswordInputVariant('error')
                    }
                    else {
                        if (passwordInputVariant === "success")
                        {
                            setRepeatPasswordInputError("")
                            setRepeatPasswordInputVariant('success')
                        }
                    }
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [
        passwordInput.value,
        repeatPasswordInput.value
    ])
    
    useEffect(() => {
        if (
            passwordInputVariant === "success" &&
            repeatPasswordInputVariant === "success"
        )
            setDisableButton(false);
        else
            setDisableButton(true);
    }, [
        passwordInputVariant,
        repeatPasswordInputVariant
    ]);

    const handleRecoveryPassword = async () => await changePassword({ 
        email: email,
        password: passwordInput.value,
        repeatPassword: repeatPasswordInput.value
    }).unwrap();

    return (
        <div className={`${styles["form"]} ${className ? className : ""}`}>
            <div className={styles["info"]}>
                <div className={styles["icon-container"]}>
                    <Lock className={styles["icon"]} />
                </div>
                <span className={styles["title"]}>Новый пароль</span>
                <span className={styles["description"]}>Введите новый пароль для вашего аккаунта.</span>
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
            <div className={styles["inputs"]}>
                <Input 
                    {...passwordInput} 
                    type="password" 
                    placeholder="Введите пароль" 
                    disabled={false} 
                    variant={passwordInputVariant} 
                    errorMessage={passwordInputError}
                    Icon={Lock}
                />
                <Input 
                    {...repeatPasswordInput} 
                    type="password" 
                    placeholder="Повторите пароль" 
                    disabled={false} 
                    variant={repeatPasswordInputVariant} 
                    errorMessage={repeatPasswordInputError}
                    Icon={Lock}
                />
            </div>
            <div />
            <Button 
                className={styles["action-button"]} 
                contentClassName={styles["content"]}
                disabled={disableButton}
                onClick={handleRecoveryPassword}
                isLoading={isLoading}
            >
                <span>Сменить пароль</span>
                <ArrowRight className={styles["icon"]} />
            </Button>
        </div>
    )
};