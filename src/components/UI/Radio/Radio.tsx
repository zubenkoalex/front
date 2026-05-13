import { FC, HTMLProps } from "react";
import styles from "./Radio.module.scss";

interface RadioProps {
  className?: HTMLProps<HTMLElement>["className"];
  circleClassName?: HTMLProps<HTMLElement>["className"];
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export const Radio: FC<RadioProps> = ({ 
    className,
    circleClassName,
    value, 
    checked, 
    onChange, 
    label, 
    disabled = false 
}) => {
    const handleClick = () => {
        if (!disabled) onChange(value);
    };

    return (
        <div
            className={`${styles.radio}  ${disabled ? styles.disabled : ""} ${className ? className : ""}`}
            onClick={handleClick}
        >
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={() => onChange(value)}
                disabled={disabled}
                className={styles["input"]}
            />
            <label className={`${styles["custom-radio"]} ${circleClassName || ""}`} />
            {label && <span className={styles["label"]}>{label}</span>}
        </div>
    );
};
