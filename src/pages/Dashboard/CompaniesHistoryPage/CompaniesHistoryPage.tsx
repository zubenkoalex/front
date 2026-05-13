import { FC, HTMLProps, useEffect, useState } from "react";
import styles from "./CompaniesHistoryPage.module.scss";
import { CalendarFilled, ColumnsMode, ListMode, Megaphone, Money, NotFound, Projector, Search } from "../../../components/SVG";
import { Dropdown, Input, Pagination } from "../../../components/UI";
import useInput from "../../../hooks/useInput";
import { AdCompanyNames, DropdownItem, statuses } from "../../../types/UI";
import { formatDate } from "../../../utils";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useGetCompaniesQuery } from "../../../services/dashboardService";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

const statusFilter: DropdownItem[] = [
    { key: "all", name: "Все статусы"},
    { key: "active", name: "Активна"},
    { key: "pause", name: "На паузе"},
    { key: "end", name: "Завершена"}
]

const platformsFilter: DropdownItem[] = [
    { key: "all", name: "Все платформы"},
    { key: "yandex-direct", name: "Yandex Direct"},
    { key: "vk", name: "ВКонтакте"},
]

const ITEMS_PER_PAGE = 9;

export const CompaniesHistoryPage: FC<ComponentProps> = ({
    className,
}) => {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [displayMode, setDisplayMode] = useState<"list" | "columns">("list");
    const [filter, setFilter] = useState<{status: DropdownItem | null, platform: DropdownItem | null}>({status: null, platform: null});

    const searchInput = useInput("");

    useEffect(() => {
        setCurrentPage(1);
    }, [filter.status, filter.platform, searchInput.value]);

    const { data, isFetching, isError } = useGetCompaniesQuery(
        { 
            offset: (currentPage - 1) * ITEMS_PER_PAGE, 
            limit: ITEMS_PER_PAGE, 
            sortBy: "createAt", 
            sortOrder: "desc",
            search: searchInput.value.length > 0 ? searchInput.value : undefined,
            status: filter.status?.key === 'all' ? undefined : filter.status?.key,
            platform: filter.platform?.key === 'all' ? undefined : filter.platform?.key,
        }, 
        { pollingInterval: 180000 }
    );

    const companies = data?.items || [];
    const totalCount = data?.totalCount || 0;

    const hasActiveFilters = Boolean(
        searchInput.value || 
        (filter.status && filter.status.key !== 'all') || 
        (filter.platform && filter.platform.key !== 'all')
    );

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

    return (
        <div className={`${styles["companies-history-page"]} ${className ? className : ""}`}>
            <div className={styles["filters"]}>
                <Input
                    Icon={Search}
                    placeholder="Поиск"
                    value={searchInput.value}
                    onChange={searchInput.onChange}
                    className={styles["input"]}
                    iconClassName={styles["input-icon"]}
                />
                <div className={styles["right"]}>
                    <div className={styles["display-modes"]}>
                        <div
                            onClick={() => setDisplayMode("list")}
                            className={`${styles["mode"]} ${displayMode === "list" ? styles["active"] : ""}`}
                        >
                            <ListMode className={styles["icon"]} />
                        </div>
                        <div
                            onClick={() => setDisplayMode("columns")}
                            className={`${styles["mode"]} ${displayMode === "columns" ? styles["active"] : ""}`}
                        >
                            <ColumnsMode className={styles["icon"]} />
                        </div>
                    </div>
                    <Dropdown 
                        items={statusFilter}
                        value={{key: filter.status?.key ?? statusFilter[0].key, name: filter.status?.name ?? statusFilter[0].name}}
                        onChange={(item) => setFilter(prev => ({...prev, status: item}))}
                        className={styles["dropdown"]}
                        headerClassName={styles["dropdown-header"]}
                    />
                    <Dropdown 
                        items={platformsFilter}
                        value={{key: filter.platform?.key ?? platformsFilter[0].key, name: filter.platform?.name ?? platformsFilter[0].name}}
                        onChange={(item) => setFilter(prev => ({...prev, platform: item}))}
                        className={styles["dropdown"]}
                        headerClassName={styles["dropdown-header"]}
                    />
                </div>
            </div>
            <motion.div
                key={`${displayMode}-${hasActiveFilters}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`${styles["cards"]} ${styles[displayMode]}`}
            >
                {isFetching || isError ?
                    Array.from({length: 6}).map((_, index) => (
                        <div 
                            key={index}
                            className={`${styles["card"]} ${styles["skeleton"]}`}
                        >
                            <div className={styles["header"]}>
                                <div className={styles["title"]}>
                                    <span className={styles["name-skeleton"]}>name</span>
                                    <div className={`${styles["status"]} ${styles["skeleton"]}`}>
                                        <span>status</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles["info-blocks"]}>
                                <div className={styles["block"]}>
                                    <span className={styles["value-skeleton"]}>value</span>
                                </div>
                                <span className={styles["line"]} />
                                <div className={styles["block"]}>
                                    <span className={styles["value-skeleton"]}>value</span>
                                </div>
                                <span className={styles["line"]} />
                                <div className={styles["block"]}>
                                    <span className={styles["value-skeleton"]}>value</span>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    companies.length === 0 ?
                        <div className={styles["not-found"]}>
                            {hasActiveFilters ? 
                                <>
                                    <NotFound className={styles["icon"]} />
                                    <span>Нет результатов</span>
                                </>
                                :
                                <>
                                    <Megaphone className={styles["icon"]} />
                                    <span>У вас ещё нет рекламных кампаний</span>
                                </>
                            }
                        </div>
                        :
                        companies.map(company => {
                            const status = statuses[company.status].name;
                            const StatusIcon = statuses[company.status].Icon;

                            return (
                                <div
                                    key={company.id}
                                    onClick={() => navigate(`/dashboard/companies-history/${company.id}`)}
                                    className={`${styles["card"]} ${styles[company.status]}`}
                                >
                                    <div className={styles["header"]}>
                                        <div className={styles["title"]}>
                                            <span>{company.name}</span>
                                            <div className={styles["status"]}>
                                                <span>{status}</span>
                                                {StatusIcon && <StatusIcon className={styles["icon"]} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles["info-blocks"]}>
                                        <div className={styles["block"]}>
                                            <Projector className={styles["icon"]} />
                                            <span>
                                                <span>Платформа: </span>
                                                <span className={styles["value"]}>{company.platform ? AdCompanyNames[company.platform] : ""}</span>
                                            </span>
                                        </div>
                                        <span className={styles["line"]} />
                                        <div className={styles["block"]}>
                                            <Money className={styles["icon"]} />
                                            <span>
                                                <span>Бюджет: </span>
                                                <span className={styles["value"]}>{company.budget.toLocaleString('ru-RU')} ₽</span>
                                            </span>
                                        </div>
                                        <span className={styles["line"]} />
                                        <div className={styles["block"]}>
                                            <CalendarFilled className={styles["icon"]} />
                                            <span>
                                                <span>Создано: </span>
                                                <span className={styles["value"]}>{formatDate(company.createAt, { format: 'full' })}</span>
                                            </span>
                                            {company.endAt &&
                                                <span className={styles["end"]}>
                                                    <span>Завершено: </span>
                                                    <span className={styles["value"]}>{formatDate(company.endAt, { format: 'full' })}</span>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </motion.div>
            {totalPages > 1 && (
                <div className={styles["pagination-container"]}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};