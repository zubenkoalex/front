import { useEffect, useMemo, FC } from "react";
import styles from "./Forecasts.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { MetricsCard, Spinner, Tooltip } from "../../../../components/UI";
import { AdCompanyMetricsIcons, AdCompanyMetricsNames, AdCompanyExpensesNames } from "../../../../types/Dashboard";
import { Expenses, FilledCheck, Like, Platform, Signal } from "../../../../components/SVG";
import { formatThousands } from "../../../../utils";
import { AdCompanyDesc, AdCompanyIcons, AdCompanyNames } from "../../../../types/UI";
import { useGetCompanyForecastsQuery } from "../../../../services/dashboardService";
import { skipToken } from "@reduxjs/toolkit/query";
import { useWizardValidation } from "../WizardValidationContext";

export const Forecasts: FC = () => {
    const { setValid } = useWizardValidation();
    const { main, targetPeople, creatives, platform: selectedPlatform, strategy: selectedStrategy } = useAppSelector(state => state.dashboardReducer.newCompanyBuild);
    const { setPlatform, setStrategy } = useActions(allActions.dashboard);

    const { data: companyForecast, isFetching } = useGetCompanyForecastsQuery(
        main ? {main, targetPeople, creatives: creatives.selected} : skipToken,
        { pollingInterval: 180000 }
    );

    if (isFetching || !companyForecast)
        return (
            <div className={styles["content"]}>
                <div className={styles["spinner-container"]}>
                    <Spinner className={styles["spinner"]} />
                </div>
            </div>    
        )

    const platformInfo = useMemo(() => {
        return companyForecast.platforms.find(p => p.key === selectedPlatform);
    }, [companyForecast, selectedPlatform]);

    const PlatformIcon = selectedPlatform ? AdCompanyIcons[selectedPlatform] : null;

    const isValid = useMemo(() => {
        return Boolean(
            selectedStrategy
        );
    }, [selectedStrategy]);

    useEffect(() => {
        setValid(isValid);
    }, [isValid]);

    return (
        <div className={styles["content"]}>
            <div className={styles["platforms"]}>
                {companyForecast.platforms.map(platform => {
                    const Icon = AdCompanyIcons[platform.key];
                    const recommendedMetrics = platform.strategies.find(s => s.recommended)?.metrics;

                    return (
                        <div 
                            key={platform.key}
                            className={`
                                ${styles["platform"]}
                                ${selectedPlatform === platform.key ? styles["selected"] : ""}
                            `}
                            onClick={() => setPlatform(platform.key)}
                        >
                            <div className={styles["platform-content"]}>
                                <div className={`${styles["icon-wrapper"]} ${styles[platform.key]}`}>
                                    <Icon className={styles["icon"]} />
                                </div>
                                <div className={styles["platform-header"]}>
                                    <div className={styles["title"]}>
                                        <span>{AdCompanyNames[platform.key]}</span>
                                        {platform.recommended &&
                                            <div className={styles["status"]}>
                                                <span>Рекомендуется</span>
                                            </div>
                                        }
                                    </div>
                                    <span className={styles["description"]}>{AdCompanyDesc[platform.key]}</span>
                                </div>
                            </div>
                            <div className={styles["statistics"]}>
                                {recommendedMetrics && Object.entries(recommendedMetrics).map(([key, value]) => (
                                    <div key={key} className={`${styles["statistic"]} ${styles[key]}`}>
                                        <span className={styles["key"]}>{AdCompanyMetricsNames[key]}</span>
                                        <span className={styles["value"]}>~{formatThousands(value)}{key === "ctr" ? "%" : ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
            {selectedPlatform ?
                <div className={styles["forecast"]}>
                    <div className={styles["forecast-header"]}>
                        <div className={`${styles["icon-wrapper"]} ${styles[selectedPlatform]}`}>
                            {PlatformIcon && <PlatformIcon className={styles["icon"]} />}
                        </div>
                        <span>{AdCompanyNames[selectedPlatform]}</span>
                    </div>
                    <div className={styles["forecast-content"]}>
                        <div className={styles["company-info"]}>
                            <span className={styles["title"]}>{companyForecast.name}</span>
                            <span className={styles["description"]}>{companyForecast.description}</span>
                        </div>
                        <span className={styles["forecast-title"]}>Прогноз результатов по стратегиям</span>
                        <div className={styles["strategies"]}>
                            {platformInfo?.strategies.map(strategy => (
                                <div 
                                    key={strategy.key}
                                    className={`
                                        ${styles["strategy"]} 
                                        ${styles[strategy.key]}
                                        ${selectedStrategy === strategy.key ? styles["selected"] : ""}
                                    `}
                                    onClick={() => setStrategy(strategy.key)}
                                >
                                    <div className={styles["strategy-header"]}>
                                        <div className={styles["info"]}>
                                            <div className={styles["title"]}>
                                                <span>{strategy.key}</span>
                                                {strategy.recommended &&
                                                    <Tooltip
                                                        content={<>
                                                            <Like className={styles["content-icon"]} />
                                                            <span className={styles["tooltip-text"]}>Рекомендуется</span>
                                                        </>}
                                                        className={styles["tooltip"]}
                                                        contentClassName={styles["tooltip-content"]}
                                                    >
                                                        <Like className={styles["tooltip-icon"]} />
                                                    </Tooltip>
                                                }
                                            </div>
                                            <span className={styles["description"]}>Оплата {AdCompanyExpensesNames[strategy.key]}</span>
                                        </div>
                                        <div className={styles["statuses"]}>
                                            <div className={styles["selected"]}>
                                                <FilledCheck className={styles["icon"]} />
                                                <span>Выбрано</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={styles["line"]} />
                                    <div className={styles["values"]}>
                                        <div className={styles["title"]}>
                                            <Signal className={styles["icon"]} />
                                            <span>Ожидаемые показатели</span>
                                        </div>
                                        <div className={styles["cards"]}>
                                            {Object.entries(strategy.metrics).map(([key, value]) => {
                                                if (key === "recommended" || typeof value === "boolean") return;

                                                return (
                                                    <MetricsCard 
                                                        key={key} 
                                                        metricType={key}
                                                        Icon={AdCompanyMetricsIcons[key]}
                                                        content={AdCompanyMetricsNames[key]}
                                                        value={`~${formatThousands(value)}${key === "ctr" ? "%" : ""}`} 
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className={styles["values"]}>
                                        <div className={styles["title"]}>
                                            <Expenses className={styles["icon"]} />
                                            <span>Ожидаемые расходы</span>
                                        </div>
                                        <div className={styles["cards"]}>
                                            {Object.entries(strategy.expense).map(([key, value]) => (
                                                <MetricsCard 
                                                    key={key} 
                                                    metricType={key}
                                                    Icon={AdCompanyMetricsIcons[key]}
                                                    content={AdCompanyExpensesNames[key]}
                                                    value={`~${formatThousands(value)} ₽`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                :
                <div className={styles["no-platfrom"]}>
                    <Platform className={styles["icon"]} />
                    <span>Выберите платформу для размещения</span>
                </div>
            }
        </div>
    );
};