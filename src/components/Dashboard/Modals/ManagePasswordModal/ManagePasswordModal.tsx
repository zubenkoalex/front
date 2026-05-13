import { FC, useEffect, useMemo, useState } from "react";
import styles from "./ManagePasswordModal.module.scss";
import { Button, Input, Modal } from "../../../UI";
import { Key } from "../../../SVG";
import useInput from "../../../../hooks/useInput";
import { Variant } from "../../../../types/UI";
import { isInvalidPassword, validateInput } from "../../../../utils/validator";
import { useChangePasswordMutation, useCheckPasswordMutation } from "../../../../services/accountService";
import { useActions } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { getErrorMessage } from "../../../../utils";
import { playSound2D } from "../../../../utils/sounds";

interface ComponentProps {
    activeModal: string | null;
    setActiveModal: (state: string | null) => void;
}

type Step = "confirm" | "new";

export const ManagePasswordModal: FC<ComponentProps> = ({
    activeModal,
    setActiveModal
}) => {
    const { addToast } = useActions(allActions.page);
    
    const [step, setStep] = useState<Step>("confirm");

    const [checkPassword, { isLoading: checkIsLoading }] = useCheckPasswordMutation();
    const [changePassword, { isLoading: changeIsLoading }] = useChangePasswordMutation();

    const confirmPasswordInput = useInput("");
    
    const newPasswordInput = useInput("");
    const [passwordInputVariant, setPasswordInputVariant] = useState<Variant>("default");
    const [passwordInputError, setPasswordInputError] = useState<string | undefined>("");
    
    const repeatNewPasswordInput = useInput("");
    const [repeatPasswordInputVariant, setRepeatPasswordInputVariant] = useState<Variant>("default");
    const [repeatPasswordInputError, setRepeatPasswordInputError] = useState<string | undefined>("");

    useEffect(() => {
        if (activeModal === "manage-password") {
            setStep("confirm");

            confirmPasswordInput.setValue("");
            newPasswordInput.setValue("");
            repeatNewPasswordInput.setValue("");

            setPasswordInputVariant("default");
            setRepeatPasswordInputVariant("default");
            setPasswordInputError("");
            setRepeatPasswordInputError("");
        }
    }, [activeModal]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (newPasswordInput.value.length > 0 || passwordInputVariant !== 'default') {
                validateInput(newPasswordInput.value, isInvalidPassword, setPasswordInputVariant, setPasswordInputError);
            }

            if (repeatNewPasswordInput.value.length > 0) {
                if (newPasswordInput.value !== repeatNewPasswordInput.value) {
                    setRepeatPasswordInputVariant('error');
                    setRepeatPasswordInputError("Пароли должны совпадать.");
                } else if (passwordInputVariant === "success") {
                    setRepeatPasswordInputVariant('success');
                    setRepeatPasswordInputError("");
                } else {
                    setRepeatPasswordInputVariant('default');
                    setRepeatPasswordInputError("");
                }
            } else {
                setRepeatPasswordInputVariant('default');
                setRepeatPasswordInputError("");
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [newPasswordInput.value, repeatNewPasswordInput.value]);
    
    const isConfirmDisabled = useMemo(() => {
        return confirmPasswordInput.value.length === 0;
    }, [confirmPasswordInput.value]);

    const isChangeDisabled = useMemo(() => {
        return passwordInputVariant !== "success" || repeatPasswordInputVariant !== "success";
    }, [passwordInputVariant, repeatPasswordInputVariant]);

    const handleConfirmPassword = async () => {
        try {
            await checkPassword({
                password: confirmPasswordInput.value
            }).unwrap();
            
            setStep("new");
        } catch (error) {
            addToast({ msg: getErrorMessage(error), type: "error" });
            playSound2D("error", 1);
            console.error(error);
        }
    };

    const handleChangePassword = async () => {
        try {
            await changePassword({
                password: newPasswordInput.value,
                repeatPassword: repeatNewPasswordInput.value
            }).unwrap();

            addToast({ msg: "Пароль успешно изменён!", type: "success" });
            
            setTimeout(() => {
                setActiveModal(null);
            }, 500);
        } catch (error) {
            addToast({ msg: getErrorMessage(error), type: "error" });
            playSound2D("error", 1);
            console.error(error);
        }
    };

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={styles["manage-password-modal"]}
            visible={activeModal === "manage-password"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            <div className={styles["icon-container"]}>
                <Key className={styles["icon"]} />
            </div>
            <div className={styles["header"]}>
                <span className={styles["title"]}>Редактирование пароля</span>
                {step === "confirm" ?
                    <div className={styles["description"]}>
                        <span>В целях безопасности, пожалуйста, введите ваш текущий пароль</span>
                        <span>перед его изменением.</span>
                    </div>
                    :
                    <div className={styles["description"]}>
                        <span>Придумайте надёжный пароль для вашей учётной записи.</span>
                        <span>Пожалуйста, убедитесь, что он отличается от того, который вы использовали ранее.</span>
                    </div>
                }
            </div>
            {step === "confirm" ?            
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Пароль от учётной записи</span>
                    <Input 
                        type="password"
                        value={confirmPasswordInput.value}
                        onChange={confirmPasswordInput.onChange}
                    />
                </div>
                :
                <div className={styles["inputs"]}>
                    <div className={styles["input-container"]}>
                        <span className={styles["label"]}>Новый пароль</span>
                        <Input 
                            type="password"
                            value={newPasswordInput.value}
                            onChange={newPasswordInput.onChange}
                            variant={passwordInputVariant} 
                            errorMessage={passwordInputError}
                        />
                    </div>
                    <div className={styles["input-container"]}>
                        <span className={styles["label"]}>Подтверждение нового пароля</span>
                        <Input 
                            type="password"
                            value={repeatNewPasswordInput.value}
                            onChange={repeatNewPasswordInput.onChange}
                            variant={repeatPasswordInputVariant} 
                            errorMessage={repeatPasswordInputError}
                        />
                    </div>
                </div>
            }
            <div className={styles["action-buttons"]}>
                <Button 
                    variant="secondary"
                    onClick={() => setActiveModal(null)}
                    className={styles["action-button"]} 
                >
                    <span>Отмена</span>
                </Button>
                {step === "confirm" ?
                    <Button 
                        variant="secondary"
                        isLoading={checkIsLoading}
                        disabled={isConfirmDisabled}
                        onClick={handleConfirmPassword}
                        className={styles["action-button"]}
                        spinnerClassName={styles["spinner"]}
                    >
                        <span>Подтвердить</span>
                    </Button>
                    :
                    <Button 
                        variant="secondary"
                        isLoading={changeIsLoading}
                        disabled={isChangeDisabled}
                        onClick={handleChangePassword}
                        className={styles["action-button"]}
                        spinnerClassName={styles["spinner"]}
                    >
                        <span>Изменить</span>
                    </Button>
                }
            </div>
        </Modal>
    );
};