import { FC } from "react";
import styles from "./ReportModal.module.scss";
import { Button, Input, Modal } from "../../../UI";
import { Bug } from "../../../SVG";
import useInput from "../../../../hooks/useInput";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { useReportBugMutation } from "../../../../services/dashboardService";


export const ReportModal: FC = () => {
    const {activeModal} = useAppSelector(state => state.dashboardReducer)
    const {setActiveModal} = useActions(allActions.dashboard)

    const bugInput = useInput("");
    const [reportBug, { isLoading }] = useReportBugMutation();

    const isNextDisabled = bugInput.value.trim().length === 0;

    const handleSubmit = async () => {
        if (isNextDisabled) return;

        try {
            await reportBug({ message: bugInput.value }).unwrap();
            
            setActiveModal(null);
            bugInput.setValue("");
        } catch (error) {
            console.error("Ошибка при отправке репорта: ", error);
        }
    };

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={`${styles["report-modal"]}`}
            visible={activeModal === "report"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            <div className={styles["icon-container"]}>
                <Bug className={styles["icon"]} />
            </div>
            <div className={styles["header"]}>
                <span className={styles["title"]}>Сообщить об ошибке</span>
                <div className={styles["description"]}>
                    <span>Что-то пошло не так? Пожалуйста, подробно опишите проблему, с которой вы столкнулись. Ваши отзывы помогают нам быстро всё исправлять и делать сервис лучше.</span>
                </div>
            </div>
            <div className={styles["input-container"]}>
                <span className={styles["label"]}>Что случилось ?</span>
                <Input 
                    mode="textarea"
                    value={bugInput.value}
                    onChange={bugInput.onChange}
                    placeholder="Опишите суть вашей проблемы..." 
                    className={styles["input"]} 
                    innerClassName={styles["input-inner"]} 
                />
            </div>
            <div className={styles["action-buttons"]}>
                <Button 
                    variant="secondary"
                    onClick={() => setActiveModal(null)}
                    className={styles["action-button"]} 
                >
                    <span>Отмена</span>
                </Button>
                <Button 
                    variant="secondary"
                    disabled={isNextDisabled}
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    className={styles["action-button"]}
                    spinnerClassName={styles["spinner"]}
                >
                    <span>Сообщить</span>
                </Button>
            </div>
        </Modal>
    );
};