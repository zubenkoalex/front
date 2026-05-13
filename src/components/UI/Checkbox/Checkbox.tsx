import { FC, HTMLProps } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
    className?: HTMLProps<HTMLElement>["className"];
    boxClassName?: HTMLProps<HTMLElement>["className"];
    markClassName?: HTMLProps<HTMLElement>["className"];
    checked: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({
    className,
    boxClassName,
    markClassName,
    checked, 
    onChange, 
    label, 
    disabled = false 
}) => {
    const handleClick = () => {
        if (!disabled)
            onChange?.(!checked);
    };

    return (
        <div
            className={`${styles.checkbox} ${disabled ? styles.disabled : ""} ${className ? className : ""}`}
            onClick={handleClick}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                disabled={disabled}
                className={styles["input"]}
            />
            <div className={`${styles["box"]} ${boxClassName ? boxClassName : ""}`}>
                {checked && <div className={`${styles["checkmark"]} ${markClassName ? markClassName : ""}`}/>}
            </div>
            {label && <span className={`${styles.label} ${checked ? styles.checked : ""}`}>{label}</span>}
        </div>
    );
};