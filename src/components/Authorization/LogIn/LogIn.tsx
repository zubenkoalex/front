import {FC, HTMLProps, useEffect, useState} from 'react'
import styles from '../Authorization.module.scss'
import { Button, Checkbox, Input } from '../../UI';
import useInput from '../../../hooks/useInput';
import { useActions } from '../../../hooks/redux';
import { allActions } from '../../../store/reducers/actions';
import { ArrowRight, Google, Lock, Mail } from '../../SVG';
import { useLoginMutation } from '../../../services/authorizationService';
import { getErrorMessage } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const LogIn: FC<ComponentProps> = ({
    className
}) => {
    const {setPage} = useActions(allActions.authorization);
    const [login, { isLoading, error, isError, data }] = useLoginMutation();

    const navigate = useNavigate();

    const loginOrEmailInput = useInput("");
    const passwordInput = useInput("");

    const [rememberUser, setRememberUser] = useState<boolean>(false);
    const [disableAuthorizationButton, setDisableAuthorizationButton] = useState<boolean>(true);

    useEffect(() => {
        if (loginOrEmailInput.value.length > 0 && passwordInput.value.length > 0)
            setDisableAuthorizationButton(false);
        else if (loginOrEmailInput.value.length == 0 || passwordInput.value.length == 0)
            setDisableAuthorizationButton(true);
    }, [
        loginOrEmailInput.value,
        passwordInput.value
    ])

    const handleRememberUser = (remember: boolean) => setRememberUser(remember);

    const handleLocalLogin = async () => {
        await login({ loginOrEmail: loginOrEmailInput.value, password: passwordInput.value, remember: rememberUser }).unwrap();
        navigate('/dashboard');
    }
    const handleGoogleLogin = async () => navigate('/google');

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
                    {...loginOrEmailInput} 
                    type="text" 
                    placeholder="Введите логин/email" 
                    disabled={false}
                    className={styles["input"]}
                    Icon={Mail}
                />
                <Input 
                    {...passwordInput} 
                    type="password" 
                    placeholder="Введите пароль" 
                    disabled={false} 
                    className={styles["input"]}
                    Icon={Lock}
                />
            </div>
            <div className={styles["options"]}>
                <Checkbox 
                    className={styles["checkbox-container"]} 
                    boxClassName={styles["checkbox"]}
                    markClassName={styles["checkmark"]}
                    checked={rememberUser} 
                    onChange={handleRememberUser}
                    label="Запомнить меня"
                />
                <Button 
                    className={styles["forgot-button"]} 
                    variant="secondary" 
                    onClick={() => setPage("recovery")}
                >
                    Забыли пароль?
                </Button>
            </div>
            <Button 
                className={styles["action-button"]} 
                contentClassName={styles["content"]}
                disabled={disableAuthorizationButton}
                onClick={handleLocalLogin}
                isLoading={isLoading}
            >
                <span>Войти</span>
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