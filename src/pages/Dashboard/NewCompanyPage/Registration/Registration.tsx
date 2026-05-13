import { HTMLProps, useEffect, useMemo, useRef, FC } from "react";
import styles from "./Registration.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { MetricsCard, Tooltip } from "../../../../components/UI";
import { AdCompanyMetricsIcons, AdCompanyMetricsNames, AdCompanyExpensesNames, interestsIcons, interests } from "../../../../types/Dashboard";
import { FilledCheck, Info, SparklesCircleFilled, SparklesFilled } from "../../../../components/SVG";
import { formatThousands, pluralize } from "../../../../utils";
import { AdCompanyIcons, AdCompanyNames } from "../../../../types/UI";
import { ages, companyThems, countries, genders } from "../../../../types/CompanyThems";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    onDataValidate?: (isValid: boolean) => void;
}

const HOLD_DELAY = 500;

export const Registration: FC<ComponentProps> = ({
    className
}) => {
    const {main, targetPeople, creatives, forecast, platform, strategy} = useAppSelector(state => state.dashboardReducer.newCompanyBuild);
    const {setActiveModal, setShowedImage} = useActions(allActions.dashboard)

    const holdTimeout = useRef<number | null>(null);
    const isHolding = useRef(false);

    const duration = main ?
        Math.floor((new Date(main.end).getTime() - new Date(main.start).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    
    const selectedStrategy = useMemo(() => {
        return forecast?.platforms.find(p => p.key === platform)?.strategies.find(s => s.key === strategy);
    }, [forecast, platform, strategy]);

    const metrics = selectedStrategy?.metrics;
    const metricEntries = metrics ? (Object.entries(metrics) as [keyof typeof metrics, number][]) : [];

    const PlatformIcon = platform ? AdCompanyIcons[platform] : null;

    const handleMouseDown = (image: string) => {
        isHolding.current = true;

        holdTimeout.current = setTimeout(() => {
            if (isHolding.current) {
                setActiveModal("image");
                setShowedImage(image);
            }
        }, HOLD_DELAY);
    };

    const handleMouseUp = () => {
        isHolding.current = false;

        if (holdTimeout.current) {
            clearTimeout(holdTimeout.current);
            holdTimeout.current = null;
        }
    };

    const handleMouseLeave = () => {
        handleMouseUp();
    };

    useEffect(() => {
        return () => {
            if (holdTimeout.current) clearTimeout(holdTimeout.current);
        };
    }, []);

    return (
        <div className={`${styles["content"]} ${className ?? ""}`}>
            <div className={styles["title"]}>
                <Info className={styles["icon"]} />
                <span>Сводка рекламной кампании</span>
            </div>
            <div className={styles["blocks"]}>
                <div className={styles["block"]}>
                    <div className={styles["title"]}>
                        <span className={styles["line"]} />
                        <span>Основная информация</span>
                        <span className={styles["line"]} />
                    </div>
                    <div className={styles["info-container"]}>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Название</span>
                            <div className={styles["input"]}>
                                <span>{main?.name}</span>
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Цель</span>
                            <div className={styles["input"]}>
                                <span>{main?.purpose}</span>
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Тематика</span>
                            <div className={styles["input"]}>
                                <span>{companyThems.find(theme => theme.key === main?.theme)?.name}</span>
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Бюджет</span>
                            <div className={styles["input"]}>
                                <span>{main?.budget}</span>
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Длительность</span>
                            <div className={styles["input"]}>
                                <span>{duration} {pluralize(duration, ["день", "дня", "дней"])}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <span className={styles["line"]} />
                <div className={styles["block"]}>
                    <div className={styles["title"]}>
                        <span className={styles["line"]} />
                        <span>Целевая аудитория</span>
                        <span className={styles["line"]} />
                    </div>
                    <div className={styles["info-container"]}>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Пол</span>
                            <div className={styles["input"]}>
                                <span>{genders.find(gender => gender.key === targetPeople.gender)?.name}</span>
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Возраст</span>
                            <div className={styles["input"]}>
                                <span>{ages.find(age => age.key === targetPeople.age)?.name}</span>
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Страны</span>
                            <div className={styles["input"]}>
                                {Array.isArray(targetPeople.country) ?
                                    targetPeople.country.map((countryKey, index) => (
                                        <span key={countryKey}>
                                            {countries.find(c => c.key === countryKey)?.name}
                                            {targetPeople.country.length - 1 === index ? "" : ", "}
                                        </span>
                                    ))
                                    :
                                    <span>{countries.find(country => country.key === targetPeople.country)?.name}</span>
                                }
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Интересы</span>
                            <div className={styles["input"]}>
                                <div className={styles["interests"]}>
                                    {targetPeople.interests.map(interest => {
                                        const Icon = interestsIcons[interest];

                                        if (!Icon) return null;

                                        return (
                                            <div key={interest} className={`${styles["interest"]} ${styles[interest]}`}>
                                                <Icon className={styles["icon"]} />
                                                <span>{interests[interest]}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={styles["creatives"]}>
                            {creatives.selected.map(creative => {
                                const crt = creatives.default.find(ct => ct.id === creative);

                                if (!crt) return null;

                                return (
                                    <div 
                                        key={creative} 
                                        className={`${styles["creative"]}`}
                                        onMouseDown={() => handleMouseDown(crt.serverUrl || crt.previewUrl)}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => {
                                            if (isHolding.current) return;
                                        }}
                                    >
                                        <div className={styles["background-overlay"]} />
                                        <img src={crt.serverUrl || crt.previewUrl} className={styles["image"]} />
                                        {crt.generated &&
                                            <Tooltip
                                                content={<>
                                                    <SparklesFilled className={styles["content-icon"]}/>
                                                    <span className={styles["tooltip-text"]}>Сгенерировано AI</span>
                                                </>}
                                                className={styles["tooltip"]}
                                                contentClassName={styles["tooltip-content"]}
                                            >
                                                <SparklesCircleFilled className={styles["tooltip-icon"]} />
                                            </Tooltip>
                                        }
                                        <FilledCheck className={`${styles["status"]} ${styles["selected"]}`} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <span className={styles["line"]} />
                <div className={styles["block"]}>
                    <div className={styles["title"]}>
                        <span className={styles["line"]} />
                        <span>Стратегия кампании</span>
                        <span className={styles["line"]} />
                    </div>
                    <div className={styles["info-container"]}>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Платформа</span>
                            <div className={styles["input"]}>
                                {platform && PlatformIcon &&
                                    <div className={styles["platform"]}>
                                        <div className={`${styles["icon-wrapper"]} ${styles[platform]}`}>
                                            <PlatformIcon className={styles["icon"]} />
                                        </div>
                                        <span>{AdCompanyNames[platform]}</span>
                                    </div> 
                                }
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Стратегия</span>
                            <div className={styles["input"]}>
                                {strategy && 
                                    <>
                                        <span>{strategy.toLocaleUpperCase()}</span>
                                        <span className={styles["description"]}> (Оплата {AdCompanyExpensesNames[strategy]})</span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles["info"]}>
                            <span className={styles["label"]}>Ожидаемые результаты</span>
                            <div className={styles["metrics"]}>
                                {metricEntries.map(([metric, value]) => (
                                    <MetricsCard 
                                        key={metric} 
                                        metricType={metric}
                                        Icon={AdCompanyMetricsIcons[metric]}
                                        content={AdCompanyMetricsNames[metric]}
                                        value={`~${formatThousands(value)}`}
                                        className={styles["card"]}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};