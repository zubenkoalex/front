import { FC, useState } from "react";
import styles from "./HomePage.module.scss";
import { AdCompany, Button, Graph, StatisticsCard } from "../../../components/UI";
import {  DropdownItem, FilterState, FilterType, graphFilterItems, StatisticsCardProps } from "../../../types/UI";
import { ArrowRight, Barchart, Click, Ruble, Users } from "../../../components/SVG";
import { useGetCompaniesQuery, useGetGlobalStatisticsQuery, useGetStatisticsQuery } from "../../../services/dashboardService";
import { useNavigate } from "react-router-dom";


export const HomePage: FC= () => {
    const navigate = useNavigate();

    const [performanceFilterState, setPerformanceFilterState] = useState<FilterState>({
        type: "current-month",
        item: graphFilterItems[0],
    });

    const [spendingFilterState, setSpendingFilterState] = useState<FilterState>({
        type: "current-month",
        item: graphFilterItems[0],
    });

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

    const getStatisticsQueryParams = (state: FilterState, type: "spending" | "performance") => ({
        type,
        filter: state.type,
        days: state.type === "days" ? state.item.key : undefined,
        dateFrom: state.type === "other" ? state.rangeStart : undefined,
        dateTo: state.type === "other" ? state.rangeEnd : undefined,
    });

    const shouldSkipPerformance = performanceFilterState.type === "other" 
    && (!performanceFilterState.rangeStart || !performanceFilterState.rangeEnd);

    const shouldSkipSpending = spendingFilterState.type === "other" 
    && (!spendingFilterState.rangeStart || !spendingFilterState.rangeEnd);

    const {data: statistics} = useGetGlobalStatisticsQuery(undefined, {pollingInterval: 60000});

    const statisticsCards: StatisticsCardProps[] = [
        {
            Icon: Ruble,
            value: statistics?.totalSpent.value ?? 0,
            unit: "₽",
            description: ["Всего потрачено", "За последние 30 дней"],
            profit: statistics?.totalSpent.profit ?? 0
        },
        {
            Icon: Users,
            value: statistics?.audienceReach.value ?? 0,
            description: ["Охват аудитории", "Уникальные пользователи"],
            profit: statistics?.audienceReach.profit ?? 0,
            color: "blue"
        },
        {
            Icon: Click,
            value: statistics?.ctr.value ?? 0,
            unit: "%",
            description: ["CTR", "Средний показатель кликов"],
            profit: statistics?.ctr.profit ?? 0,
            color: "green"
        },
        {
            Icon: Barchart,
            value: statistics?.conversion.value ?? 0,
            unit: "%",
            description: ["Конверсия", "Целевые действия"],
            profit: statistics?.conversion.profit ?? 0,
            color: "yellow"
        },
    ]

    const {data: performanceData, isFetching: isFetchingPerformance, isError: isErrorPerformance} = useGetStatisticsQuery(
        getStatisticsQueryParams(performanceFilterState, "performance"), 
        { pollingInterval: 180000, skip: shouldSkipPerformance }
    )

    const {data: spendingData, isFetching: isFetchingSpending, isError: isErrorSpending} = useGetStatisticsQuery(
        getStatisticsQueryParams(spendingFilterState, "spending"), 
        { pollingInterval: 180000, skip: shouldSkipSpending }
    )

    const { isFetching: isFetchingCompanies, data: companiesData, isError: isErrorCompanies } = useGetCompaniesQuery(
        { offset: 0, limit: 4, sortBy: "date", sortOrder: "desc" }, 
        { pollingInterval: 180000 }
    );

    return (
        <div className={styles["home-page"]}>
            <div className={styles["statistics-cards"]}>
                {statisticsCards.map((card, index) => (
                    <StatisticsCard key={index} card={card} />
                ))}
            </div>
            <div className={styles["graphs"]}>
                <Graph 
                    type="area" 
                    title="Расходы по платформам"  
                    data={performanceData?.chartData} 
                    series={performanceData?.series} 
                    filter={performanceFilterState.item}
                    filters={graphFilterItems} 
                    filterType={performanceFilterState.type}
                    onFilterChange={item => onFilterChange("performance", item)}
                    onRangeSelect={(start, end) => onRangeSelect("performance", start, end)}
                    isLoading={(isFetchingPerformance || isErrorPerformance)} 
                />
                <Graph 
                    type="bar" 
                    title="Расходы по платформам" 
                    data={spendingData?.chartData} 
                    series={spendingData?.series} 
                    filter={spendingFilterState.item}
                    filters={graphFilterItems} 
                    filterType={spendingFilterState.type}
                    onFilterChange={item => onFilterChange("spending", item)}
                    onRangeSelect={(start, end) => onRangeSelect("spending", start, end)}
                    isLoading={(isFetchingSpending || isErrorSpending)} 
                />
            </div>
            <div className={styles["last-companies"]}>
                <div className={styles["header"]}>
                    <span className={styles["title"]}>Последние кампании</span>
                    <Button 
                        variant="secondary" 
                        className={styles["button"]}
                        onClick={() => navigate('/dashboard/companies-history')}
                    >
                        <span>Все компании</span>
                        <ArrowRight className={styles["icon"]} />
                    </Button>
                </div>
                <div className={styles["companies"]}>
                    {isFetchingCompanies || isErrorCompanies ?
                        Array.from({length: 4}).map((_, index) => (
                            <AdCompany key={index} isLoading/>
                        ))
                        :
                        companiesData?.items?.map((company, index) => (
                            <AdCompany key={index} company={company}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};