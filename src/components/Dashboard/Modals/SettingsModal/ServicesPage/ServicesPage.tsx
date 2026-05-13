import { FC, useMemo, useState } from "react";
import styles from "./ServicesPage.module.scss";
import { AdCompanyIcons, AdCompanyNames } from "../../../../../types/UI";
import { ArrowRightLong, PlugConnected, PlugDisconnected } from "../../../../SVG";
import { useActions, useAppSelector } from "../../../../../hooks/redux";
import { allActions } from "../../../../../store/reducers/actions";
import { Service } from "../../../../../types/Dashboard";


export const ServicesPage: FC = () => {
    const {user} = useAppSelector(state => state.accountReducer);
    const {setModalPage} = useActions(allActions.dashboard);

    const yandexDirectStatus = user?.yandexDirectStatus || false;
    const vkStatus = user?.vkStatus || false;

    const [serviceHovered, setServiceHovered] = useState<string | null>(null);

    const services: Service[] = useMemo(() => [
        {
            key: "yandex-direct",
            status: yandexDirectStatus,
            buttonAction: () => {}
        },
        {
            key: "vk",
            status: vkStatus,
            buttonAction: () => {}
        }
    ], [yandexDirectStatus, vkStatus])

    const connectedServices = useMemo(() => services.filter(s => s.status).length, [services])

    return (
        <div className={styles["services-page"]}>
            <div className={styles["header"]}>
                <div className={`${styles["action-button"]} ${styles["back"]}`} onClick={() => setModalPage("account")}>
                    <ArrowRightLong className={`${styles["icon"]} ${styles["arrow"]}`} />
                    <span>Назад</span>
                </div>
                <div className={styles["services-info"]}>
                    <span>Подключено сервисов:</span>
                    <span className={styles["count"]}>
                        <span className={styles["active"]}>{connectedServices}</span>
                        <span>/{services.length}</span>
                    </span>
                </div>
            </div>
            <div className={styles["services"]}>
                {services.map(service => {

                    const name = AdCompanyNames[service.key];
                    const Icon = AdCompanyIcons[service.key];

                    return (
                        <div key={service.key} className={`${styles["service"]} ${styles[service.key]}`}>
                            <div className={styles["service-info"]}>
                                <div className={styles["icon-wrapper"]}>
                                    <Icon className={styles["icon"]} />
                                </div>
                                <span className={styles["name"]}>{name}</span>
                            </div>
                            <div 
                                className={`${styles["action-button"]} ${service.status ? styles["connected"] : ""}`}
                                onMouseEnter={() => setServiceHovered(service.key)}
                                onMouseLeave={() => setServiceHovered(null)}
                                onClick={service.buttonAction}
                            >
                                {service.status ?
                                    <>
                                        <span>{serviceHovered === service.key ? "Отключить" : "Подключено"}</span>
                                        {serviceHovered === service.key ?
                                            <PlugDisconnected className={styles["icon"]} />
                                            :
                                            <PlugConnected className={styles["icon"]} />
                                        }
                                    </>
                                :
                                    <span>Подключить</span>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

        </div>
    );
};