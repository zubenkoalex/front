import { FC, HTMLProps, useMemo, useState } from "react";
import styles from "./Graph.module.scss";
import { Button, DatePicker, Dropdown, Spinner } from "..";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { pixelToVH } from "../../../utils/pxConvertor";
import { ChartData, ChartSeries, DropdownItem } from "../../../types/UI";
import { LineLegend, Square } from "../../SVG";
import { formatDate, pluralize } from "../../../utils";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    title: string;
    type: "area" | "bar";
    data?: ChartData[];
    series?: ChartSeries[];
    filter?: DropdownItem;
    filters?: DropdownItem[];
    filterType?: "days" | "current-month" | "other";
    isLoading?: boolean;
    onFilterChange?: (item: DropdownItem) => void;
    onRangeSelect?: (startDate: Date, endDate: Date) => void;
}

export const Graph: FC<ComponentProps> = ({
    className,
    title,
    type,
    data,
    series,
    filter,
    filters,
    filterType,
    isLoading,
    onFilterChange,
    onRangeSelect
}) => {
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return data;

        const now = new Date();

        if (filterType === "current-month") {
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            
            return data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getFullYear() === currentYear && 
                    itemDate.getMonth() === currentMonth;
            });
        } else if (filterType === "other") {
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            
            return data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getFullYear() === currentYear && 
                    itemDate.getMonth() === currentMonth;
            });
        } else {
            const cutoffDate = new Date(now);
            cutoffDate.setDate(cutoffDate.getDate() - Number(filter?.key));
            
            return data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= cutoffDate;
            });
        }
    }, [data, filter]);

    const formatXAxis = (tickItem: string | Date) => {
        return formatDate(tickItem, { format: 'short' });
    };

    const formatTooltipLabel = (label: string | Date) => {
        return formatDate(label, { format: 'long' });
    }; 

    const common = (
        <>
            <CartesianGrid strokeDasharray="5 5" stroke="#252525" />
            <XAxis dataKey="date" stroke="#838383" style={{ fontSize: pixelToVH(10) }} tickFormatter={formatXAxis} />
            <YAxis stroke="#838383" style={{ fontSize: pixelToVH(10) }} />
            <Tooltip 
                cursor={{fill: "rgba(255, 255, 255, 0.05)"}}
                content={({ payload, label }) => (
                    <div className={styles["tooltip-wrapper"]}>
                        <span className={styles["label"]}>{formatTooltipLabel(label as string)}</span>
                        {payload?.map((entry, index) => (
                            <div key={`item-${index}`} className={styles["item"]} >
                                <span>{entry.name || entry.dataKey}:</span>
                                <span style={{ color: entry.color }}>{entry.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            />
            <Legend 
                content={({ payload }) => (
                    <div className={styles["legend-wrapper"]}>
                        {payload?.map((entry, index) => (
                            <div key={`item-${index}`} className={styles["item"]} >
                                {type === "area" ?
                                    <LineLegend className={styles["icon"]} style={{ fill: entry.color }} />
                                    :
                                    <Square className={`${styles["icon"]} ${styles["bar"]}`} style={{ fill: entry.color }} />
                                }
                                <span style={{ color: entry.color }}>{entry.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            />
        </>
    )

    return (
        <div className={`${styles["graph"]} ${className ?? ""}`}>
            <div className={styles["header"]}>
                <span className={styles["title"]}>{title}</span>
                {filters && filterType &&
                    <div className={styles["fillters"]} style={{visibility: isLoading ? "collapse" : "visible"}}>
                        {filterType === "other" && <DatePicker mode="range" onRangeSelect={onRangeSelect}/>}
                        <Dropdown 
                            items={filters} 
                            value={filter} 
                            onChange={onFilterChange}
                            className={styles["dropdown"]}
                            headerClassName={styles["dropdown-header"]}
                        />
                    </div>
                }
            </div>
            {isLoading ? 
                <div className={styles["spinner-container"]}>
                    <Spinner className={styles["spinner"]} />
                </div>
                :
                <>
                    <ResponsiveContainer className={styles["chart"]}>
                        {type === "area" &&
                            <AreaChart data={filteredData}>
                                <defs>
                                    {series?.map((s) => (
                                        <linearGradient key={s.key} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={s.color} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                                        </linearGradient>
                                    ))}
                                </defs>
                                {common}
                                {series?.map((s) => (
                                    <Area
                                        key={s.key}
                                        type="monotone"
                                        dataKey={s.key}
                                        stroke={s.color}
                                        strokeWidth={2}
                                        fill={`url(#gradient-${s.key})`}
                                        name={s.name}
                                    />
                                ))}
                            </AreaChart>
                        }
                        {type === "bar" &&
                            <BarChart data={filteredData}>
                                {common}
                                {series?.map((s) => (
                                    <Bar
                                        key={s.key}
                                        dataKey={s.key}
                                        fill={s.color}
                                        name={s.name}
                                        radius={[50, 50, 0, 0]}
                                    />
                                ))}
                            </BarChart>
                        }
                    </ResponsiveContainer>
                </>
            }
        </div>
    );
};