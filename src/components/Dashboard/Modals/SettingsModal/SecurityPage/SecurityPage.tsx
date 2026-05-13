import { FC, useMemo, useState } from "react";
import styles from "./SecurityPage.module.scss";
import { Setting } from "../../../../../types/Dashboard";
import { Google, PlugConnected, PlugDisconnected } from "../../../../SVG";
import { useActions, useAppSelector } from "../../../../../hooks/redux";
import { allActions } from "../../../../../store/reducers/actions";
import { useGetSessionsQuery } from "../../../../../services/accountService";
import { AuthenticatorModal, ManageEmailModal, ManagePasswordModal } from "../..";


export const SecurityPage: FC = () => {
    const {user} = useAppSelector(state => state.accountReducer);
    const {setModalPage} = useActions(allActions.dashboard);

    const { data: sessions = [] } = useGetSessionsQuery();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [serviceHovered, setServiceHovered] = useState<string | null>(null);

    const emailStatus = user?.emailStatus || false;
    const googleStatus = user?.googleStatus || false;

    const settings: Setting[] = useMemo(() => [
        {
            key: "google-authenticator",
            Icon: Google,
            name: "Google Authenticator",
            values: [],
            button: {
                name: googleStatus ? "Отключить" : "Подключить",
                action: () => setActiveModal("authenticator")
            }
    
        },
        {
            key: "sessions",
            name: "Сеансы",
            values: [{
                name: `${sessions.length} ${sessions.length === 1 ? "активная" : "активных"}`
            }],
            button: {
                name: "Управление",
                action: () => setModalPage("sessions")
            }
    
        },
        {
            key: "email",
            name: "Почта",
            values: [{
                name: user?.email || ""
            }],
            button: {
                name: emailStatus ? "Изменить" : "Подтвердить",
                action: () => setActiveModal("manage-email")
            }
        },
        {
            key: "password",
            name: "Пароль",
            values: [{
                name: "***********"
            }],
            button: {
                name: "Изменить",
                action: () => setActiveModal("manage-password")
            }
        }
    ], [user?.email, emailStatus, googleStatus, sessions.length, setModalPage]);

    return (
        <div className={styles["account-page"]}>
            <div className={styles["settings"]}>
                {settings.map(setting => (
                    <div key={setting.key} className={`${styles["setting"]} ${styles[setting.key]}`}>
                        <div className={styles["info"]}>
                            {setting.Icon  && <setting.Icon className={`${styles["setting-icon"]} ${styles[setting.key]}`} />}
                            <div className={styles["key"]}>{setting.name}</div>
                            {setting.values.map(value => (
                                <div key={value.name} className={styles["value"]}>
                                    {value.Icon && <value.Icon className={styles["icon"]} />}
                                    <span>{value.name}</span>
                                </div>
                            ))}
                        </div>
                        {setting.key === "google-authenticator" ?
                            <div 
                                className={`${styles["action-button"]} ${googleStatus ? styles["connected"] : ""}`}
                                onMouseEnter={() => setServiceHovered(setting.key)}
                                onMouseLeave={() => setServiceHovered(null)}
                                onClick={setting.button.action}
                            >
                                {googleStatus ?
                                    <>
                                        <span>{serviceHovered === setting.key ? "Отключить" : "Подключено"}</span>
                                        {serviceHovered === setting.key ?
                                            <PlugDisconnected className={styles["icon"]} />
                                            :
                                            <PlugConnected className={styles["icon"]} />
                                        }
                                    </>
                                :
                                    <span>Подключить</span>
                                }
                            </div>
                            :
                            <div 
                                className={`${styles["action-button"]} ${setting.key === "email" && !emailStatus ? styles["disconnected"] : ""}`} 
                                onClick={setting.button.action}
                            >
                                {setting.button.Icon && <setting.button.Icon className={styles["icon"]} />}
                                <span>{setting.button.name}</span>
                            </div>
                        }
                    </div>
                ))}
            </div>
            <AuthenticatorModal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            />
            <ManageEmailModal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            />
            <ManagePasswordModal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            />
        </div>
    );
};