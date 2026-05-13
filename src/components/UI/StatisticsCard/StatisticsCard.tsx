import { FC, HTMLProps, useEffect, useMemo, useState } from "react";
import styles from "./StatisticsCard.module.scss";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";
import { SideBarCategory } from "../../../types/Dashboard";
import { Ruble, ArrowUp, ArrowDown } from "../../SVG/";
import { StatisticsCardProps } from "../../../types/UI";
import Skeleton from "react-loading-skeleton";
import RollingNumber from "../RollingNumber/RollingNumber";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    card: StatisticsCardProps;
}

export const StatisticsCard: FC<ComponentProps> = ({
    className,
    card,
}) => {

    return (
        <div className={`${styles["statistics-card"]} ${false ? styles["loading"] : ""} ${className ? className : ""}`}>
            <div className={styles["info"]}>
                <div className={`${styles["icon-wrapper"]} ${card.color && styles[card.color]}`}>
                    <card.Icon className={styles["icon"]} />
                </div>
                <div className={styles["text"]}>
                    <span className={styles["title"]}> 
                        <RollingNumber 
                            className={styles["title"]}
                            digitClassName={styles["digit-container"]}
                            digitNumberClassName={styles["digit-number"]}
                            value={card.value}
                        />
                        <span> {card.unit}</span>
                    </span>
                    <div className={styles["description"]}>
                        {card.description.map((desc, index) => (
                            <span key={index}>{desc}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`${styles["profit"]} ${card.profit >= 0 ? styles["up"] : styles["down"]}`}>
                {card.profit >= 0 ? 
                    <ArrowUp className={styles["icon"]} />
                    :
                    <ArrowDown className={styles["icon"]} />
                }
                <span className={styles["value"]}>
                    <span>{card.profit >= 0 ? "+" : ""}</span>
                    <RollingNumber 
                        className={styles["value"]} 
                        digitClassName={styles["digit-container"]}
                        digitNumberClassName={styles["digit-number"]}
                        value={card.profit} 
                    />
                    <span>%</span>
                </span>
            </div>
        </div>
    );
};