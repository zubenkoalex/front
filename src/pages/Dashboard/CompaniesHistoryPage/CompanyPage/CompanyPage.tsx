import { FC, useState } from "react";
import styles from "./CompanyPage.module.scss";
import { useParams } from "react-router-dom";
import { Barchart, Click, Ruble, Users } from "../../../../components/SVG";
import { Graph, StatisticsCard } from "../../../../components/UI";
import { useActions } from "../../../../hooks/redux";
import { useGetCompanyByIdQuery, useGetStatisticsQuery } from "../../../../services/dashboardService";
import { allActions } from "../../../../store/reducers/actions";
import { ages, companyThems, countries, genders } from "../../../../types/CompanyThems";
import { AdCompanyExpensesNames, interests, interestsIcons } from "../../../../types/Dashboard";
import { AdCompanyIcons, AdCompanyNames, DropdownItem, FilterState, FilterType, graphFilterItems, StatisticsCardProps, statuses } from "../../../../types/UI";
import { pluralize } from "../../../../utils";


export const CompanyPage: FC = () => {
    const { companyId: id } = useParams<{ companyId: string }>();

    const {setActiveModal, setShowedImage} = useActions(allActions.dashboard);

    const [performanceFilterState, setPerformanceFilterState] = useState<FilterState>({
        type: "current-month",
        item: graphFilterItems[0],
    });

    const [spendingFilterState, setSpendingFilterState] = useState<FilterState>({
        type: "current-month",
        item: graphFilterItems[0],
    });

    const getStatisticsQueryParams = (state: FilterState, type: "spending" | "performance") => ({
        type,
        companyId: id,
        filter: state.type,
        days: state.type === "days" ? state.item.key : undefined,
        dateFrom: state.type === "other" ? state.rangeStart : undefined,
        dateTo: state.type === "other" ? state.rangeEnd : undefined,
    });

    const { data: fetchedCompany, isFetching: isFetchingCompany, isError: isErrorCompany } = useGetCompanyByIdQuery(id as string, {
        skip: !id,
        pollingInterval: 180000
    });

    const shouldSkipPerformance = 
        !id || 
        !fetchedCompany ||
        (performanceFilterState.type === "other" && (!performanceFilterState.rangeStart || !performanceFilterState.rangeEnd));

    const shouldSkipSpending = 
        !id || 
        !fetchedCompany ||
        (spendingFilterState.type === "other" && (!spendingFilterState.rangeStart || !spendingFilterState.rangeEnd));

    const {data: performanceData, isFetching: isFetchingPerformance, isError: isErrorPerformance} = useGetStatisticsQuery(
        getStatisticsQueryParams(performanceFilterState, "performance"), 
        { pollingInterval: 180000, skip: shouldSkipPerformance }
    )

    const {data: spendingData, isFetching: isFetchingSpending, isError: isErrorSpending} = useGetStatisticsQuery(
        getStatisticsQueryParams(spendingFilterState, "spending"), 
        { pollingInterval: 180000, skip: shouldSkipSpending }
    )

    const onFilterChange = (stateKey: "spending" | "performance", item: DropdownItem) => {
        const setState = stateKey === "spending" ? setSpendingFilterState : setPerformanceFilterState;

        if (item.key === "current-month") {
            setState(prev => ({ ...prev, type: item.key as FilterType }));
        } else if (item.key === "other" ) {
            setState(prev => ({ ...prev, type: item.key as FilterType, rangeStart: undefined, rangeEnd: undefined }));
        } else {
            setState(prev => ({ ...prev, type: "days", item }));
        }
    };

    const onRangeSelect = (stateKey: "spending" | "performance", startDate: Date, endDate: Date) => {
        const setState = stateKey === "spending" ? setSpendingFilterState : setPerformanceFilterState;

        const startUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0));
        const endUTC = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0));

        setState(prev => ({
            ...prev,
            rangeStart: startUTC.toISOString(),
            rangeEnd: endUTC.toISOString(),
        }));
    };

    const statisticsCards: StatisticsCardProps[] = [
        {
            Icon: Ruble,
            value: fetchedCompany?.statistics?.spent?.value ?? 0,
            unit: "₽",
            description: ["Всего потрачено", "За последние 30 дней"],
            profit: fetchedCompany?.statistics?.spent?.profit ?? 0
        },
        {
            Icon: Users,
            value: fetchedCompany?.statistics?.audienceReach?.value ?? 0,
            description: ["Охват аудитории", "Уникальные пользователи"],
            profit: fetchedCompany?.statistics?.audienceReach?.profit ?? 0,
            color: "blue"
        },
        {
            Icon: Click,
            value: fetchedCompany?.statistics?.ctr?.value ?? 0,
            unit: "%",
            description: ["CTR", "Средний показатель кликов"],
            profit: fetchedCompany?.statistics?.ctr?.profit ?? 0,
            color: "green"
        },
        {
            Icon: Barchart,
            value: fetchedCompany?.statistics?.conversions?.value ?? 0,
            unit: "%",
            description: ["Конверсия", "Целевые действия"],
            profit: fetchedCompany?.statistics?.conversions?.profit ?? 0,
            color: "yellow"
        },
    ];

    const status = fetchedCompany ? statuses[fetchedCompany.status]?.name : "";
    const StatusIcon = fetchedCompany ? statuses[fetchedCompany.status]?.Icon : null;
    const PlatformIcon = fetchedCompany?.platform ? AdCompanyIcons[fetchedCompany.platform] : null;
    const duration = (fetchedCompany?.start && fetchedCompany?.end) 
        ? Math.floor((new Date(fetchedCompany.end).getTime() - new Date(fetchedCompany.start).getTime()) / (1000 * 60 * 60 * 24)) 
        : 0;

    return (
        <div className={`${styles["company-page"]} ${fetchedCompany ? styles[fetchedCompany.status] : ""}`}>
            <div className={styles["title"]}>
                {(isFetchingCompany || isErrorCompany) ?
                    <>
                        <span className={`${styles["value"]} ${styles["skeleton"]}`}>value</span>
                        <div className={`${styles["status"]} ${styles["skeleton"]}`}>
                            <span>status</span>
                        </div>
                    </>
                    :
                    <>
                        <span>{fetchedCompany?.name}</span>                    
                        <div className={styles["status"]}>
                            <span>{status}</span>
                            {StatusIcon && <StatusIcon className={styles["icon"]} />}
                        </div>
                    </>
                }
            </div>
            <div className={styles["main-info"]}>
                <div className={styles["block"]}>
                    <div className={styles["header-block"]}>
                        <span>Основная информация</span>
                    </div>
                    <div className={styles["info"]}>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Тематика</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{companyThems.find(theme => theme.key === fetchedCompany?.theme)?.name}</span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Цель</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{fetchedCompany?.purpose}</span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Бюджет</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{fetchedCompany?.budget.toLocaleString('ru-RU')} ₽</span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Длительность</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{duration} {pluralize(duration, ["день", "дня", "дней"])}</span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Описание</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{fetchedCompany?.description}</span>
                            }
                        </div>
                    </div>
                </div>
                <div className={styles["block"]}>
                    <div className={styles["header-block"]}>
                        <span>Целевая аудитория</span>
                    </div>
                    <div className={styles["info"]}>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Страны</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>
                                    {Array.isArray(fetchedCompany?.country) ?
                                        fetchedCompany?.country.map((countryKey, index) => (
                                            <span key={countryKey}>
                                                {countries.find(c => c.key === countryKey)?.name}
                                                {fetchedCompany?.country.length - 1 === index ? "" : ", "}
                                            </span>
                                        ))
                                        :
                                        <span>{countries.find(country => country.key === fetchedCompany?.country)?.name}</span>
                                    }
                                </span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Пол</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{genders.find(gender => gender.key === fetchedCompany?.gender)?.name}</span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Возраст</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>{ages.find(age => age.key === fetchedCompany?.age)?.name}</span>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Стратегия</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                fetchedCompany?.strategy && 
                                <>
                                    <span className={styles["value"]}>
                                        <span>{fetchedCompany.strategy.toLocaleUpperCase()}</span>
                                        <span className={styles["description"]}> (Оплата {AdCompanyExpensesNames[fetchedCompany.strategy]})</span>
                                    </span>
                                </>
                            }
                        </div>
                        <div className={styles["parametr"]}>
                            <span className={styles["label"]}>Платформа</span>
                            {(isFetchingCompany || isErrorCompany) ?
                                <span className={`${styles["value"]} ${styles["skeleton"]}`} >value</span>
                                :
                                <span className={styles["value"]}>
                                    {PlatformIcon && fetchedCompany?.platform &&
                                        <div className={styles["platform"]}>
                                            <div className={`${styles["icon-wrapper"]} ${styles[fetchedCompany.platform]}`}>
                                                <PlatformIcon className={styles["icon"]} />
                                            </div>
                                            <span>{AdCompanyNames[fetchedCompany.platform]}</span>
                                        </div> 
                                    }
                                </span>
                            }
                        </div>
                    </div>
                </div>
                <div className={styles["block"]}>
                    <div className={styles["header-block"]}>
                        <span>Креативы</span>
                    </div>
                    <div className={styles["info"]}>
                        <div className={styles["creatives"]}>
                            {(isFetchingCompany || isErrorCompany) ?
                                Array.from({length: 6}).map((_, index) => (
                                    <div 
                                        key={index} 
                                        className={`${styles["creative"]}`}
                                    >
                                        <div className={styles["background-overlay"]} />
                                        <div className={`${styles["image"]} ${styles["skeleton"]}`} />
                                    </div>
                                ))
                                :
                                fetchedCompany?.creatives.map(creative => (
                                        <div 
                                            key={creative.id} 
                                            className={`${styles["creative"]}`}
                                            onClick={() => {
                                                setActiveModal("image");
                                                setShowedImage(creative.serverUrl || creative.previewUrl);
                                            }}
                                        >
                                            <div className={styles["background-overlay"]} />
                                            <img src={creative.serverUrl || creative.previewUrl} className={styles["image"]} />
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["interests"]}>
                <div className={styles["header-block"]}>
                    <span>Интересы</span>
                </div>
                <div className={styles["content"]}>
                    {(isFetchingCompany || isErrorCompany) ?
                        Array.from({length: 6}).map((_, index) => (
                            <div 
                                key={index}
                                className={styles["card-container"]}
                            >
                                <div className={`${styles["card"]} ${styles["skeleton"]}`} />
                                <span className={`${styles["name"]} ${styles["skeleton"]}`}>value</span>
                            </div>
                        ))
                        :
                        fetchedCompany?.interests.map((key, index) => {
                            const interest = interests[key];
                            const Icon = interestsIcons[key];
    
                            return (
                                <div 
                                    key={`${key}-${index}`}
                                    className={`
                                        ${styles["card-container"]} 
                                        ${styles[key]}
                                    `}
                                >
                                    <div className={styles["card"]}>
                                        <Icon className={styles["icon"]} />
                                    </div>
                                    <span className={styles["name"]}>{interest}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles["statistics"]}>
                {statisticsCards.map((card, index) => (
                    <StatisticsCard key={index} card={card} />
                ))}
            </div>
            <div className={styles["graphs"]}>
                <Graph 
                    type="area" 
                    title="Статистика"  
                    data={performanceData?.chartData} 
                    series={performanceData?.series} 
                    filter={performanceFilterState.item}
                    filters={graphFilterItems} 
                    filterType={performanceFilterState.type}
                    onFilterChange={item => onFilterChange("performance", item)}
                    onRangeSelect={(start, end) => onRangeSelect("performance", start, end)}
                    isLoading={(isFetchingCompany || isErrorCompany || isFetchingPerformance || isErrorPerformance)} 
                />
                <Graph 
                    type="area" 
                    title="Расходы"  
                    data={spendingData?.chartData} 
                    series={spendingData?.series} 
                    filter={spendingFilterState.item}
                    filters={graphFilterItems} 
                    filterType={spendingFilterState.type}
                    onFilterChange={item => onFilterChange("spending", item)}
                    onRangeSelect={(start, end) => onRangeSelect("spending", start, end)}
                    isLoading={(isFetchingCompany || isErrorCompany || isFetchingSpending || isErrorSpending)} 
                />
            </div>
        </div>
    );
};