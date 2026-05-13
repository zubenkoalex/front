import {FC, HTMLProps} from 'react'
import styles from './AdCompany.module.scss'
import { AdCompanyIcons, AdCompanyNames, statuses } from '../../../types/UI';
import { formatThousands } from '../../../utils';
import { Company } from '../../../models/Company';

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    company?: Company;
    isLoading?: boolean;
}

export const AdCompany: FC<ComponentProps> = ({
    className,
    company,
    isLoading
}) => {

    if (!company || isLoading) return (
        <div className={`${styles["ad-company"]} ${className ?? ""}`}>
            <div className={styles["info"]}>
                <div className={styles["icon-skeleton"]}/>
                <div className={styles["name"]}>
                    <div className={styles["title-skeleton"]} />
                    <div className={styles["platform-skeleton"]} />
                </div>
                <div className={styles["status-skeleton"]} />
            </div>
            <div className={styles["statistics"]}>
                <div className={styles["statistic"]}>
                    <span className={styles["key"]}>Потрачено</span>
                    <div className={styles["value-skeleton"]} />
                </div>
                <div className={styles["statistic"]}>
                    <span className={styles["key"]}>CTR</span>
                    <div className={styles["value-skeleton"]} />
                </div>
                <div className={styles["statistic"]}>
                    <span className={styles["key"]}>Конверсии</span>
                    <div className={styles["value-skeleton"]} />
                </div>
            </div>
        </div>
    );


    const Icon = AdCompanyIcons[company.platform];
    const platform = AdCompanyNames[company.platform];

    return (
        <div className={`${styles["ad-company"]} ${className ?? ""}`}>
            <div className={styles["info"]}>
                <div className={`${styles["icon-wrapper"]} ${styles[company.platform]}`}>
                    <Icon className={styles["icon"]} />
                </div>
                <div className={styles["name"]}>
                    <span className={styles["title"]}>{company.name}</span>
                    <span className={styles["platform"]}>{platform}</span>
                </div>
                <div className={`${styles["status"]} ${styles[company.status]}`}>
                    <span>{statuses[company.status].name}</span>
                </div>
            </div>
            <div className={styles["statistics"]}>
                <div className={styles["statistic"]}>
                    <span className={styles["key"]}>Потрачено</span>
                    <span className={styles["value"]}>{formatThousands(company.statistics.spent.value)} ₽</span>
                </div>
                <div className={`${styles["statistic"]} ${company.statistics.ctr.value > 0 ? styles["positive"] : styles["negative"]}`}>
                    <span className={styles["key"]}>CTR</span>
                    <span className={styles["value"]}>{company.statistics.ctr.value}%</span>
                </div>
                <div className={styles["statistic"]}>
                    <span className={styles["key"]}>Конверсии</span>
                    <span className={styles["value"]}>{company.statistics.conversions.value}</span>
                </div>
            </div>
        </div>
    )
};