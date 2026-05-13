import { FC, HTMLProps } from "react";
import styles from "./DeviceCard.module.scss";
import { Cross } from "../../SVG";
import { Session } from "../../../models/Session";
import { devices } from "../../../types/UI";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    session: Session;
    onEndSession: (session: Session | null) => void;
}

export const DeviceCard: FC<ComponentProps> = ({
    className,
    session,
    onEndSession
}) => {

    const getDeviceKey = (): string => {
        if (session.browser && session.browser !== "unknown" && devices[session.browser]) {
            return session.browser;
        }

        const osLower = session.os.toLowerCase();
        if (osLower.includes("android")) return "android";
        if (osLower.includes("ios") || osLower.includes("mac")) return "apple";
        
        return "desktop";
    };

    const deviceKey = getDeviceKey();
    
    const Icon = devices[deviceKey].Icon;
    const browserName = devices[deviceKey].name;

    return (      
        <div className={`${styles["device"]} ${className ? className : ""}`}>
            <div className={styles["device-information"]}>
                <Icon className={styles["icon"]}/>
                <div className={styles["info-container"]}>
                    <div className={styles["info"]}>
                        <span className={styles["value"]}>{session.deviceName} </span>
                    </div>
                    <div className={styles["info"]}>
                        <span className={styles["value"]}>{browserName}, </span>
                        <span className={styles["value"]}>{session.os} </span>
                    </div>
                    <div className={styles["info"]}>
                        <span>{session.geoCity}, {session.geoCountry}</span>
                        {session.lastSeenAt && 
                            <>                            
                                <span className={styles["point"]}>•</span>
                                <span>Последний сеанс {session.lastSeenAt}</span>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className={styles["end-icon--container"]} onClick={() => onEndSession(session)}>
                <Cross className={styles["icon"]} />
            </div>
        </div>
    );
};