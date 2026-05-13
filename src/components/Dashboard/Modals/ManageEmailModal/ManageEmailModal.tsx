import { FC, useEffect, useMemo, useState } from "react";
import styles from "./ManageEmailModal.module.scss";
import { Button, Input, Modal, TwoFactorCodeInput } from "../../../UI";
import { Key } from "../../../SVG";
import useInput from "../../../../hooks/useInput";
import { Variant } from "../../../../types/UI";
import { isInvalidEmail, validateInput } from "../../../../utils/validator";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { useCheckPasswordMutation, useConfirmServiceMutation, useSendEmailMutation } from "../../../../services/accountService";
import { allActions } from "../../../../store/reducers/actions";
import { playSound2D } from "../../../../utils/sounds";
import { getErrorMessage } from "../../../../utils";

interface ComponentProps {
    activeModal: string | null;
    setActiveModal: (state: string | null) => void;
}

type Step = "confirm-old" | "new" | "confirm";

export const ManageEmailModal: FC<ComponentProps> = ({
    activeModal,
    setActiveModal
}) => {
    const {user} = useAppSelector(state => state.accountReducer);
    const {addToast} = useActions(allActions.page);

    const email = user?.email || "";
    const emailStatus = user?.emailStatus || false;

    const [confirmService, { isError: serviceIsError, isSuccess: serviceIsSuccess }] = useConfirmServiceMutation();
    const [checkPassword, { isLoading: passwordIsLoading }] = useCheckPasswordMutation();
    const [sendEmail, { isLoading: emailIsLoading }] = useSendEmailMutation();

    const [step, setStep] = useState<Step>("confirm-old");
    const [receiveTimer, setReceiveTimer] = useState<number>(0);
    const [modalStatus, setModalStatus] = useState<string>("");
    
    const emailInput = useInput("");
    const [emailInputVariant, setEmailInputVariant] = useState<Variant>("default");
    const [emailInputError, setEmailInputError] = useState<string | undefined>("");

    const passwordInput = useInput("");

    const [code, setCode] = useState<string[]>([]);
    const [inputVariant, setInputVariant] = useState<Variant>("default");
    
    useEffect(() => {
        if (activeModal === "manage-email") {
            if (emailStatus) {
                setStep("confirm-old");
                setReceiveTimer(0);
            } else {
                setStep("confirm");
                setReceiveTimer(60); 
            }
            
            emailInput.setValue("");
            passwordInput.setValue("");
            setCode([]);
            setEmailInputVariant("default");
            setInputVariant("default");
            setEmailInputError("");
        }
    }, [activeModal, emailStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (emailInput.value.length > 0 || (emailInput.value.length === 0 && emailInputVariant != 'default'))
                validateInput(emailInput.value, isInvalidEmail, setEmailInputVariant, setEmailInputError);
        }, 1000);

        return () => clearTimeout(timer);
    }, [emailInput.value])

    useEffect(() => {
        if (receiveTimer <= 0) return;
        const interval = setInterval(() => setReceiveTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [receiveTimer]);

    useEffect(() => {
        if (code.filter(e => e !== '').length === 6) handleFinalSubmit();
    }, [code]);

    useEffect(() => {
        if (serviceIsError) {
            setInputVariant("error");
            setModalStatus("error");
        }
        else if (serviceIsSuccess) {
            setInputVariant("success");
            setModalStatus("success");
        }
        else {
            setInputVariant("default");
            setModalStatus("default");
        }

        const timeout = setTimeout(() => {
            if (serviceIsError) {
                setInputVariant("default");
                setModalStatus("default");
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [serviceIsError, serviceIsSuccess])


    const isNextDisabled = useMemo(() => {
        if (step === "confirm-old") return passwordInput.value.length == 0;
        if (step === "new") return emailInputVariant !== "success";

        return false;
    }, [step, passwordInput.value, emailInputVariant]);


    const handleNextStep = async () => {
        try {
            if (step === "confirm-old") {
                await checkPassword({
                    password: passwordInput.value
                }).unwrap();
                
                setStep("new");
            } else if (step === "new") {
                sendEmail({
                    type: "settings.new",
                    email: emailInput.value
                }).unwrap();

                setStep("confirm");
                setReceiveTimer(60);
                setInputVariant("default");
            }
        } catch (error) {
            addToast({ msg: getErrorMessage(error), type: "error"});
            playSound2D("error", 1);

            console.error(error);
        }
    };

    const handleFinalSubmit = async () => {
        try {
            console.log("Submit code:", code.join(""));

            await confirmService({
                service: "email",
                type: "settings",
                code,
                email: emailStatus ? emailInput.value : undefined
            }).unwrap();

            addToast({ type: "success", msg: `Почта успешно ${emailStatus ? "изменена" : "Подтверждена"}!` });
            setTimeout(() => {
                setActiveModal(null);
            }, 500);
        } catch (error) {
            setInputVariant("error");
            addToast({ msg: getErrorMessage(error), type: "error"});
            playSound2D("error", 1);

            console.error(error);
        }
    };
    
    const handleReceive = async () => {
        if (receiveTimer > 0) return;
        
        try {
            await sendEmail({ 
                type: emailStatus ? "settings.confirm.receive" : "settings.new.receive",
                email: email
            }).unwrap();

            setReceiveTimer(60);
        } catch (error) {
            addToast({ msg: getErrorMessage(error), type: "error"});
            playSound2D("error", 1);

            console.error(error);
        }
    };

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={`${styles["manage-email-modal"]} ${styles[modalStatus]}`}
            visible={activeModal === "manage-email"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            <div className={styles["icon-container"]}>
                <Key className={styles["icon"]} />
            </div>
            <div className={styles["header"]}>
                <span className={styles["title"]}>{emailStatus ? "Изменение почты" : "Подтверждение почты"}</span>
                <div className={styles["description"]}>
                    {step === "confirm-old" && 
                        <>
                            <span>В целях безопасности подтвердите это действие.</span>
                            <span>Для изменения email введите ваш текущий пароль.</span>
                        </>
                    }
                    {step === "new" &&
                        <>
                            <span>Введите новый адрес электронной почты.</span>
                            <span>Мы отправим на него письмо с кодом для подтверждения.</span>
                        </>
                    }
                    {step === "confirm" && 
                        <>
                            <span>
                                    <span>Введите код, который был выслан на почту </span>
                                    <span className={styles["value"]}>{emailInput.value || email}</span>
                                </span>
                                <span>Если кажется, что письмо не доставлено, проверьте папку “Спам”</span>
                        </>
                    }
                </div>
            </div>
            {step === "confirm-old" &&
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Пароль от учётной записи</span>
                    <Input 
                        type="password"
                        value={passwordInput.value}
                        onChange={passwordInput.onChange}
                    />
                </div>
            }
            {step === "new" && 
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Новая электронная почта</span>
                    <Input 
                        type="email"
                        placeholder="example@mail.com"
                        value={emailInput.value}
                        onChange={emailInput.onChange}
                        variant={emailInputVariant} 
                        errorMessage={emailInputError}
                    />
                </div>
            }
            {step === "confirm" && 
                <>
                    <TwoFactorCodeInput
                        variant={inputVariant} 
                        onCodesChange={setCode}
                        inputClassName={styles["code-input"]}
                    />
                    <span
                        className={`${styles["receive-letter"]} ${receiveTimer > 0 ? styles["disabled"] : ''}`}
                        onClick={handleReceive}
                    >
                        {receiveTimer > 0 ? `Повторить через ${receiveTimer} сек.` : "Не пришёл код?"}
                    </span>
                </>
            }
            <div className={styles["action-buttons"]}>
                <Button 
                    variant="secondary"
                    onClick={() => setActiveModal(null)}
                    className={styles["action-button"]} 
                >
                    <span>Отмена</span>
                </Button>
                {step !== "confirm" && (
                    <Button 
                        variant="secondary"
                        disabled={isNextDisabled}
                        isLoading={passwordIsLoading || emailIsLoading}
                        onClick={handleNextStep}
                        className={styles["action-button"]}
                        spinnerClassName={styles["spinner"]}
                    >
                        <span>Продолжить</span>
                    </Button>
                )}
            </div>
        </Modal>
    );
};