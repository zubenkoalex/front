import { FC, useEffect, useMemo, useState } from "react";
import styles from "./InactivityModal.module.scss";
import { Button, Input, Modal, Radio } from "../../../UI";
import { Devices, Trash } from "../../../SVG";
import useInput from "../../../../hooks/useInput";
import { useDeleteAccountMutation, useUpdateInactivityTimeoutMutation } from "../../../../services/accountService";
import { getErrorMessage } from "../../../../utils";
import { playSound2D } from "../../../../utils/sounds";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";

interface ComponentProps {
    activeModal: string | null;
    setActiveModal: (state: string | null) => void;
}

export const InactivityModal: FC<ComponentProps> = ({
    activeModal,
    setActiveModal
}) => {
    const {user} = useAppSelector(state => state.accountReducer);
    const {addToast} = useActions(allActions.page);
    
    const [selectedSessionInactiveDays, setSelectedSessionInactiveDays] = useState<number>(user?.sessionInactiveDays || 7);

    const [updateInactivity, { isLoading }] = useUpdateInactivityTimeoutMutation();

    const handleSave = async () => {
        try {
            await updateInactivity(selectedSessionInactiveDays).unwrap();

            setActiveModal(null);
        } catch (err) {
            playSound2D("error", 1);
            addToast({ msg: getErrorMessage(err), type: "error" });
        }
    }

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={styles["inactivity-modal"]}
            visible={activeModal === "inactivity"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            <div className={styles["icon-modal"]}>
                <div className={styles["icon-container"]}>
                    <Devices className={styles["icon"]} />
                </div>
            </div>
            <div className={styles["header"]}>
                <span className={styles["title"]}>Завершение сеансов</span>
                <div className={styles["description"]}>
                    <span>Сеансы, с которых не будет никакой активности в течение этого периода, будут завершаться автоматически.</span>
                </div>
            </div>
            <div className={styles["radio-buttons"]}>
                <Radio 
                    className={styles["radio-button"]} 
                    circleClassName={styles["circle"]} 
                    label={"1 нед."} 
                    value={"7"}
                    checked={selectedSessionInactiveDays === 7} 
                    onChange={() => setSelectedSessionInactiveDays(7)}
                />
                <Radio 
                    className={styles["radio-button"]} 
                    circleClassName={styles["circle"]} 
                    label={"1 месяц"} 
                    value={"30"} 
                    checked={selectedSessionInactiveDays === 30} 
                    onChange={() => setSelectedSessionInactiveDays(30)}
                />
                <Radio 
                    className={styles["radio-button"]} 
                    circleClassName={styles["circle"]} 
                    label={"3 месяца"} 
                    value={"90"} 
                    checked={selectedSessionInactiveDays === 90} 
                    onChange={() => setSelectedSessionInactiveDays(90)}
                />
                <Radio 
                    className={styles["radio-button"]} 
                    circleClassName={styles["circle"]} 
                    label={"6 месяцев"} 
                    value={"180"} 
                    checked={selectedSessionInactiveDays === 180} 
                    onChange={() => setSelectedSessionInactiveDays(180)}
                />
                <Radio 
                    className={styles["radio-button"]} 
                    circleClassName={styles["circle"]} 
                    label={"12 месяцев"} 
                    value={"360"} 
                    checked={selectedSessionInactiveDays === 360} 
                    onChange={() => setSelectedSessionInactiveDays(360)}
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
                    onClick={handleSave}
                    isLoading={isLoading}
                    className={styles["action-button"]}
                    spinnerClassName={styles["spinner"]}
                >
                    <span>Сохранить</span>
                </Button>
            </div>
        </Modal>
    );
};

