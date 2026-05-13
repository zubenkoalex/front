import { FC, useEffect, useMemo, useState } from "react";
import styles from "./DeleteAccountModal.module.scss";
import { Button, Input, Modal } from "../../../UI";
import { Trash } from "../../../SVG";
import useInput from "../../../../hooks/useInput";
import { useDeleteAccountMutation } from "../../../../services/accountService";
import { getErrorMessage } from "../../../../utils";
import { playSound2D } from "../../../../utils/sounds";
import { useActions } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";

interface ComponentProps {
    activeModal: string | null;
    setActiveModal: (state: string | null) => void;
}

type Step = "question" | "confirm";

export const DeleteAccountModal: FC<ComponentProps> = ({
    activeModal,
    setActiveModal
}) => {
    const { addToast } = useActions(allActions.page);
    
    const [step, setStep] = useState<Step>("question");

    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
    
    const confirmInput = useInput("");

    useEffect(() => {
        if (activeModal === "delete-account") {
            setStep("question");
            confirmInput.setValue("");
        }
    }, [activeModal]);

    const isDeleteDisabled = useMemo(() => {
        return confirmInput.value.length === 0;
    }, [confirmInput.value]);

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount({ 
                password: confirmInput.value 
            }).unwrap();
            
            addToast({ msg: "Аккаунт деактивирован. Окончательное удаление произойдет через 6 месяцев. Ссылка для восстановления отправлена на почту.", type: "success" });
            
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
            className={styles["delete-account-modal"]}
            visible={activeModal === "delete-account"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            <div className={styles["icon-container"]}>
                <Trash className={styles["icon"]} />
            </div>
            <div className={styles["header"]}>
                <span className={styles["title"]}>Удаление аккаунта</span>
                {step === "question" ?
                    <div className={styles["description"]}>
                        <span>Вы уверены, что хотите удалить учётную запись Adzen?</span>
                        <span>Это действие необратимо и восстановить данные будет нельзя.</span>
                    </div>
                    :
                    <div className={styles["description"]}>
                        <span>Введите пароль от вашего профиля, чтобы безвозвратно</span>
                        <span>удалить учётную запись.</span>
                    </div>
                }
            </div>
            {step === "confirm" &&                
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Пароль от учётной записи</span>
                    <Input 
                        type="password"
                        value={confirmInput.value}
                        onChange={confirmInput.onChange}
                    />
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
                {step === "question" ?
                    <Button 
                        variant="secondary"
                        onClick={() => setStep("confirm")}
                        className={styles["action-button"]} 
                    >
                        <span>Я уверен</span>
                    </Button>
                    :
                    <Button 
                        variant="secondary"
                        disabled={isDeleteDisabled}
                        isLoading={isDeleting}
                        onClick={handleDeleteAccount}
                        className={`
                            ${styles["action-button"]} 
                            ${styles["attention"]}
                        `}
                        spinnerClassName={styles["spinner"]}
                    >
                        <span>Удалить аккаунт</span>
                    </Button>
                }
            </div>
        </Modal>
    );
};
