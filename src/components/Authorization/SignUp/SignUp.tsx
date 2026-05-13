import {FC, HTMLProps, useEffect, useState} from 'react'
import styles from '../Authorization.module.scss'
import { Button, Input } from '../../UI';
import { ArrowRight, Google, Lock, Mail, UserStroke } from '../../SVG';
import useInput from '../../../hooks/useInput';
import { Variant } from '../../../types/UI';
import { isInvalidEmail, isInvalidLogin, isInvalidPassword, validateInput } from '../../../utils/validator';
import { motion } from 'motion/react';
import { useSignupMutation } from '../../../services/authorizationService';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../utils';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const SingUp: FC<ComponentProps> = ({
    className
}) => {
    const [signup, { isLoading, error, isError }] = useSignupMutation();

    const navigate = useNavigate();

    const loginInput = useInput("");
    const [loginInputVariant, setLoginInputVariant] = useState<Variant>("default");
    const [loginInputError, setLoginInputError] = useState<string | undefined>("");

    const emailInput = useInput("");
    const [emailInputVariant, setEmailInputVariant] = useState<Variant>("default");
    const [emailInputError, setEmailInputError] = useState<string | undefined>("");

    const passwordInput = useInput("");
    const [passwordInputVariant, setPasswordInputVariant] = useState<Variant>("default");
    const [passwordInputError, setPasswordInputError] = useState<string | undefined>("");

    const repeatPasswordInput = useInput("");
    const [repeatPasswordInputVariant, setRepeatPasswordInputVariant] = useState<Variant>("default");
    const [repeatPasswordInputError, setRepeatPasswordInputError] = useState<string | undefined>("");

    const [disableRegistrationButton, setDisableRegistrationButton] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loginInput.value.length > 0 || (loginInput.value.length === 0 && loginInputVariant != 'default'))
                validateInput(loginInput.value, isInvalidLogin, setLoginInputVariant, setLoginInputError);
            if (emailInput.value.length > 0 || (emailInput.value.length === 0 && emailInputVariant != 'default'))
                validateInput(emailInput.value, isInvalidEmail, setEmailInputVariant, setEmailInputError);
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
        loginInput.value,
        emailInput.value,
        passwordInput.value,
        repeatPasswordInput.value
    ])

    useEffect(() => {
        if (
            loginInputVariant === "success" &&
            emailInputVariant === "success" &&
            passwordInputVariant === "success" &&
            repeatPasswordInputVariant === "success"
        )
            setDisableRegistrationButton(false);
        else
            setDisableRegistrationButton(true);
    }, [
        loginInputVariant,
        emailInputVariant,
        passwordInputVariant,
        repeatPasswordInputVariant
    ]);

    const handleSignup = async () => {
        await signup({ 
            login: loginInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            repeatPassword: repeatPasswordInput.value
        }).unwrap();

        navigate('/dashboard');
    }

    const handleGoogleLogin = () => navigate('/google');

    return (
        <div className={`${styles["form"]} ${className ? className : ""}`}>
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
            <div className={styles["inputs"]}>
                <Input 
                    {...loginInput} 
                    type="text" 
                    placeholder="Введите логин" 
                    disabled={false} 
                    variant={loginInputVariant} 
                    errorMessage={loginInputError}
                    Icon={UserStroke}
                />
                <Input 
                    {...emailInput} 
                    type="text" 
                    placeholder="Введите email" 
                    disabled={false} 
                    variant={emailInputVariant} 
                    errorMessage={emailInputError}
                    Icon={Mail}
                />
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
            <Button 
                className={styles["action-button"]} 
                contentClassName={styles["content"]}
                disabled={disableRegistrationButton}
                onClick={handleSignup}
                isLoading={isLoading}
            >
                <span>Зарегистрироваться</span>
                <ArrowRight className={styles["icon"]} />
            </Button>
            <span className={styles["line"]} />
            <div className={styles["other-logins"]}>
                <Button
                    className={styles["button"]} 
                    variant="secondary"
                    onClick={handleGoogleLogin}
                >
                    <Google className={`${styles["icon"]} ${styles["google"]}`} />
                    <span>Продолжить через Google</span>
                </Button>
            </div>
        </div>
    )
};