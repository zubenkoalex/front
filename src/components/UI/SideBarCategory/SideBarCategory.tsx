import { FC, HTMLProps, useEffect, useMemo, useState } from "react";
import styles from "./SideBarCategory.module.scss";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";
import { SideBarCategory } from "../../../types/Dashboard";
import { useLocation, useNavigate } from "react-router-dom";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    iconClassName?: HTMLProps<HTMLElement>["className"];
    nameClassName?: HTMLProps<HTMLElement>["className"];
    category: SideBarCategory;
    active: boolean;
    closed?: boolean;
    activeStyle?: "filled" | "stroke";
    onClick?: (category: SideBarCategory) => void;
}

export const SideBarCategoryComponent: FC<ComponentProps> = ({
    className,
    iconClassName,
    nameClassName,
    category,
    active,
    closed = false,
    activeStyle = "filled",
    onClick
}) => {

    return (
        <div 
            className={`
                ${styles["category"]}
                ${styles[category.key]}
                ${active ? activeStyle === "filled" ? styles["active-filled"] : styles["active-stroke"] : ""}
                ${closed ? styles["closed"] : ""}
                ${className ? className : ""}
            `}
            onClick={() => onClick?.(category)}
        >
            <category.Icon className={`${styles["icon"]} ${iconClassName || ""}`} />
            <span className={`${styles["name"]} ${nameClassName || ""}`}>{category.title}</span>
        </div>
    );
};