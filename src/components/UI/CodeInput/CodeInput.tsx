import React, { forwardRef, HTMLProps } from 'react';
import styles from './CodeInput.module.scss';
import { Variant } from '../../../types/UI';


interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    value: string;
    onChange: (value: string, index: number) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>, index: number) => void;
    index: number;
    disabled?: boolean;
    variant?: Variant;
}

export const CodeInput = forwardRef<HTMLInputElement, ComponentProps>(({
    className,
    value,
    index,
    onChange,
    onKeyDown,
    onPaste,
    disabled = false,
    variant = 'default',
}, ref) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pattern = /^\d$/;
        const newValue = e.target.value;
        if (newValue.length !== 0 && !pattern.test(newValue)) {
            return;
        }

        onChange(newValue, index);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown(e, index);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(e, index);
    };

    return (
        <div className={`${styles["wrapper"]} ${styles[variant]}`}>
            <input
                className={`${styles["input"]} ${className || ""}`}
                style={{"transitionDelay": `${variant === "success" ?  index * 75 : 0}ms`}}
                ref={ref}
                value={value}
                type="text"
                inputMode="numeric"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                maxLength={1}
                disabled={disabled}
            />
        </div>
    );
});