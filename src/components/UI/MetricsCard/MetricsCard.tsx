import { FC, HTMLProps } from "react";
import styles from "./MetricsCard.module.scss";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    metricType: string;
    content: string;
    value: string;
}

export const MetricsCard: FC<ComponentProps> = ({
    className,
    Icon,
    metricType,
    content,
    value
}) => {

    return (
        <div className={`${styles["metrics-card"]} ${styles[metricType]} ${className ?? ""}`}>
            <div className={styles["icon-wrapper"]}>
                <Icon className={styles["icon"]} />
            </div>
            <div className={styles["card-content"]}>
                <span className={styles["value"]}>{value}</span>
                <span className={styles["key"]}>{content}</span>
            </div>
        </div>
    );
};