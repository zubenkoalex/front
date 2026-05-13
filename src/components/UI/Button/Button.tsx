import React, {FC, HTMLProps, MouseEventHandler} from 'react'
import styles from './Button.module.scss'
import { Spinner } from '..';
import { playSound2D } from '../../../utils/sounds';

type Variant = 'primary' | "secondary";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    spinnerClassName?: HTMLProps<HTMLElement>["className"];
    contentClassName?: HTMLProps<HTMLElement>["className"];
    children: React.ReactNode;
    variant?: Variant;
    isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({
    spinnerClassName,
    contentClassName,
    className,
    onClick, 
    disabled,
    variant = 'primary', 
    children,
    isLoading,
    ...rest
}) => {

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        onClick?.(event);
        playSound2D("ui-click", 0.15);
    }

    return (
        <button
            className={`${styles["button"]} ${styles[variant]} ${isLoading ? styles["loading"] : ""} ${className ? className : ""}`}
            onClick={handleClick}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? 
                <Spinner className={`${styles["spinner"]} ${spinnerClassName || ""}`}/>
                :
                variant === "primary" ? 
                    <div className={`${styles["content"]} ${contentClassName ? contentClassName : ""}`}>
                        {children}
                    </div> 
                    :
                    children 
            }
        </button>
    )
};