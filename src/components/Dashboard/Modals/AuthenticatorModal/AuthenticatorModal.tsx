import { FC, useEffect, useState } from "react";
import styles from "./AuthenticatorModal.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { Button, Modal } from "../../../UI";
import { GoogleAuthenticator } from "../../../SVG";
import { TwoFactorCodeInput } from "../../../UI/TwoFactorCodeInput/TwoFactorCodeInput";
import googleApp from "../../../../assets/2faApp-mockup.png";
import { Variant } from "../../../../types/UI";
import { useConfirmServiceMutation, useGetGoogleQrQuery } from "../../../../services/accountService";
import { getErrorMessage } from "../../../../utils";
import { playSound2D } from "../../../../utils/sounds";

interface ComponentProps {
    activeModal: string | null;
    setActiveModal: (state: string | null) => void;
}

export const AuthenticatorModal: FC<ComponentProps> = ({
    activeModal,
    setActiveModal
}) => {
    const { user } = useAppSelector(state => state.accountReducer);
    const {addToast} = useActions(allActions.page)

    const googleStatus = user?.googleStatus || false;
    
    const { data: qrData } = useGetGoogleQrQuery(undefined, { skip: googleStatus || activeModal !== "authenticator" });

    const [confirmService, { isLoading: serviceIsLoading, isError: serviceIsError, isSuccess: serviceIsSuccess }] = useConfirmServiceMutation();

    const [code, setCode] = useState<string[]>([]);
    const [inputVariant, setInputVariant] = useState<Variant>("default");

    useEffect(() => {
        if (activeModal === "authenticator") {
            setCode([]);
            setInputVariant("default");
        }
    }, [activeModal]);

    const handleCodesChange = (newCode: string[]) => {
        setCode(newCode);
    };

    const handleConfirm = async () => {
        if (serviceIsLoading) return;

        try {
            setInputVariant("default");
            
            await confirmService({
                service: "google",
                type: "settings",
                code 
            }).unwrap();

            const successMsg = googleStatus 
                ? "Google Authenticator успешно отключен!" 
                : "Google Authenticator успешно подключен!";
            
            addToast({ msg: successMsg, type: "success" });
            
            setTimeout(() => {
                setActiveModal(null);
            }, 500);
        } catch (error) {
            setInputVariant("error");
            addToast({ msg: getErrorMessage(error), type: "error" });
            playSound2D("error", 1);

            console.error("Ошибка 2FA:", error);
        }
    };

    useEffect(() => {
        if (code.filter(e => e !== '').length === 6) handleConfirm();
    }, [code]);

    useEffect(() => {
        if (serviceIsError) setInputVariant("error");
        else if (serviceIsSuccess) setInputVariant("success");
        else setInputVariant("default");

        const timeout = setTimeout(() => {
            if (serviceIsError) setInputVariant("default");
        }, 500);

        return () => clearTimeout(timeout);
    }, [serviceIsError, serviceIsSuccess]);
    

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={styles["authenticator-modal"]}
            visible={activeModal === "authenticator"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            {googleStatus ?
                <div className={styles["disconnect"]}>
                    <div className={styles["icon-container"]}>
                        <GoogleAuthenticator className={styles["icon"]} />
                    </div>
                    <div className={styles["header"]}>
                        <span className={styles["title"]}>Google Authenticator</span>
                        <div className={styles["description"]}>
                            <span>Введите код из приложения Google Authenticator, чтобы</span>
                            <span>отключить привязку.</span>
                        </div>
                    </div>
                    <TwoFactorCodeInput
                        variant={inputVariant} 
                        onCodesChange={handleCodesChange}
                        inputClassName={styles["code-input"]}
                    />
                    <Button
                        variant="secondary"
                        onClick={() => setActiveModal(null)}
                        className={styles["button"]}
                    >
                        <span>Отмена</span>
                    </Button>
                </div>
                :
                <div className={styles["connect"]}>                
                    <div className={styles["header"]}>
                        <span className={styles["title"]}>Подключение Google Authenticator</span>
                        <span className={styles["description"]}>Google 2FA является инструментом входа и/или восстановления доступа к учётной записи через двухфакторную аутентификацию.</span>
                    </div>
                    <div className={styles["content"]}>
                        <div className={styles["card"]}>
                            <div className={styles["icon-container"]}>
                                <GoogleAuthenticator />
                            </div>
                            <div className={styles["info"]}>
                                <span className={styles["title"]}>Приложение аутентификатор</span>
                                <span className={styles["description"]}>Скачайте и установите Google Authenticator на смартфон или планшет.</span>
                            </div>
                        </div>
                        <div className={styles["card"]}>
                            <div className={styles["icon-container"]}>
                                <img src={qrData?.base64} className={styles["qr"]} />
                            </div>
                            <div className={styles["info"]}>
                                <span className={styles["title"]}>Сканировать QR-код</span>
                                <span className={styles["description"]}>Откройте приложение для аутентификации и просканируйте изображение слева с помощью камеры вашего смартфона.</span>
                            </div>
                        </div>
                        <div className={styles["card"]}>
                            <div className={styles["icon-container"]}>
                                <img src={googleApp} />
                            </div>
                            <div className={styles["card-content"]}>
                                <div className={styles["info"]}>
                                    <span className={styles["title"]}>Войти с вашим кодом</span>
                                    <span className={styles["description"]}>Введите сгенерированный 6-значный код подтверждения из приложения Google Authenticator.</span>
                                </div>
                                <TwoFactorCodeInput
                                    variant={inputVariant} 
                                    onCodesChange={handleCodesChange}
                                    inputClassName={styles["code-input"]}
                                />
                                <Button
                                    variant="secondary"
                                    disabled
                                    className={styles["button"]}
                                >
                                    <span>Заполните код</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </Modal>
    );
};