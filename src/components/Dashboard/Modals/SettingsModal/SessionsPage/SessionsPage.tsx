import { FC, useMemo, useState } from "react";
import styles from "./SessionsPage.module.scss";
import { ArrowRightLong, PlugDisconnected } from "../../../../SVG";
import { useActions, useAppSelector } from "../../../../../hooks/redux";
import { allActions } from "../../../../../store/reducers/actions";
import { Button, DeviceCard, Spinner } from "../../../../UI";
import { Session } from "../../../../../models/Session";
import { useEndAllOtherSessionsMutation, useEndSessionMutation, useGetSessionsQuery } from "../../../../../services/accountService";
import { playSound2D } from "../../../../../utils/sounds";
import { getErrorMessage } from "../../../../../utils";
import { ConfirmationModal, InactivityModal } from "../..";

const getInactivity = (days: number) => {
    let value;
    
    switch (days) {
        case 7:
            value = "1 нед."
            break;
        case 30:
            value = "1 месяц"
            break;
        case 90:
            value = "3 месяца"
            break;
        case 180:
            value = "6 месяцев"
            break;
        case 360:
            value = "12 месяцев"
            break;
    }

    return value;
}

export const SessionsPage: FC = () => {
    const {user} = useAppSelector(state => state.accountReducer);
    const {setModalPage} = useActions(allActions.dashboard);
    const {addToast} = useActions(allActions.page);

    const [selectedSession, setSelectedSession] = useState<Session>();
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const { data: sessions = [], isLoading: isSessionsLoading } = useGetSessionsQuery();
    const [endSession, {isLoading: isEnding}] = useEndSessionMutation();
    const [endAllOthers, {isLoading: isAllEnding}] = useEndAllOtherSessionsMutation();

    const currentSession = useMemo(() => {
        return sessions.find(s => s.isCurrent) as Session ?? undefined;
    }, [sessions]);

    const handleEndSession = (session: Session | null) => {
        if (isEnding) return;
        if (!session) return;

        if (currentSession?.suspicious)
            setActiveModal("end-not-available-session");
        else {
            setSelectedSession(session);
            setActiveModal("end-session");
        }
    }

    const handleEndAllSessions = () => {
        if (isAllEnding) return;

        if (currentSession?.suspicious)
            setActiveModal("end-not-available-session");
        else 
            setActiveModal("end-all-sessions");
    }

    const handleEndSessionResult = async (result: boolean) => {
        if (currentSession?.suspicious) return;

        setActiveModal(null);
        
        if (result && selectedSession) {
            try {
                await endSession(selectedSession.sessionId).unwrap();

                playSound2D("success", 0.15);
                addToast({ msg: "Сеанс завершен", type: "success" });
            } catch (err) {
                playSound2D("error", 1);
                addToast({ msg: getErrorMessage(err), type: "error" });
            }
        }
    }

    const handleEndAllSessionsResult = async (result: boolean) => {
        if (currentSession?.suspicious) return;

        setActiveModal(null);

        if (result) {
            try {
                await endAllOthers().unwrap();

                playSound2D("success", 0.15);
                addToast({ msg: "Все другие сеансы завершены", type: "success" });
            } catch (err) {
                playSound2D("error", 1);
                addToast({ msg: getErrorMessage(err), type: "error" });
            }
        }
    }
    

    return (
        <div className={styles["sessions-page"]}>
            <div className={styles["header"]}>
                <div className={`${styles["action-button"]} ${styles["back"]}`} onClick={() => setModalPage("security")}>
                    <ArrowRightLong className={`${styles["icon"]} ${styles["arrow"]}`} />
                    <span>Назад</span>
                </div>
                <div className={styles["sessions-info"]}>
                    <span>Активно сеансов:</span>
                    <span className={styles["count"]}>
                        <span className={styles["active"]}>{sessions.length}</span>
                    </span>
                </div>
            </div>
            {isSessionsLoading ?
                <div className={styles["spinner-container"]}>
                    <Spinner className={styles["spinner"]} />
                </div>
                :      
                <>          
                    <div className={styles["content"]}>
                        <div className={styles["description"]}>
                            <span>Здесь перечислены все устройства, на которых выполнен вход в вашу учётную запись. </span>
                            <span>Вы можете выйти из учётной записи на каждом из них по отдельности или на всех сразу. Если вы обнаружили в списке незнакомое устройство, немедленно выполните выход на этом устройстве и смените пароль от вашей учётной записи.</span>
                        </div>
                        <div className={styles["inactivity-container"]}>
                            <div className={styles["inactivity"]}>
                                <span>Период неактивности сеанса:</span>
                                <span className={styles["value"]}>{getInactivity(user?.sessionInactiveDays || 7)}</span>
                            </div>
                            <Button 
                                variant="secondary"
                                className={styles["button"]}
                                onClick={() => setActiveModal("inactivity")}
                            >
                                <span>Изменить</span>
                            </Button>
                        </div>
                        <div className={styles["devices"]}>
                            <span className={styles["title"]}>Текущее устройство</span>
                            {currentSession &&                    
                                <DeviceCard 
                                    session={currentSession} 
                                    onEndSession={handleEndSession}
                                />
                            }
                            <Button 
                                variant="secondary"
                                disabled={sessions.length <= 1}
                                className={`${styles["button"]} ${styles["end-sessions"]}`}
                                spinnerClassName={styles["spinner"]}
                                onClick={handleEndAllSessions}
                            >
                                <span>Завершить все другие сеансы</span>
                            </Button>
                        </div>
                        <div className={styles["devices"]}>
                            <span className={styles["title"]}>Другие устройства</span>
                            {sessions.filter(s => !s.isCurrent).map(s => (
                                <DeviceCard 
                                    key={s.sessionId}
                                    session={s}
                                    onEndSession={handleEndSession}
                                />
                            ))}
                        </div>
                    </div>
                    <ConfirmationModal
                        title={selectedSession?.isCurrent ? "Завершение этого сеанса приведет к выходу из аккаунта. Завершить этот сеанс ?" : "Завершить этот сеанс ?"}
                        buttonNo="Отмена"
                        buttonYes="Завершить"
                        activeModal={activeModal === "end-session"}
                        setActiveModal={setActiveModal}
                        onResult={handleEndSessionResult}
                    />
                    <ConfirmationModal
                        title="Вы точно хотите завершить все сеансы, кроме текущего ?"
                        buttonNo="Отмена"
                        buttonYes="Завершить"
                        activeModal={activeModal === "end-all-sessions"}
                        setActiveModal={setActiveModal}
                        onResult={handleEndAllSessionsResult}
                    />
                    <ConfirmationModal
                        Icon={PlugDisconnected}
                        title="Завершение сеансов"
                        description={["Завершение сеансов с нового устройства недоступно в целях безопасности. Пожалуйста, используйте устройство, где Вы авторизовались раньше, или попробуйте снова через несколько часов."]}
                        buttonNo="OK"
                        activeModal={activeModal === "end-not-available-session"}
                        setActiveModal={setActiveModal}
                    />
                    <InactivityModal
                        activeModal={activeModal}
                        setActiveModal={setActiveModal}
                    />
                </>
            }
        </div>
    );
};