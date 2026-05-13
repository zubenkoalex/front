import React, { ComponentType, forwardRef, HTMLProps, InputHTMLAttributes, Ref, SVGProps, TextareaHTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Input.module.scss';
import { Variant } from '../../../types/UI';
import { Check, ExclamationMark, HiddenEye, ShowEye } from '../../SVG';
import { motion } from 'motion/react';
import { playSound2D } from '../../../utils/sounds';


type BaseInputProps = {
    className?: string;
    innerClassName?: string;
    iconClassName?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onChangeValue?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    OnFocusChange?: (focus: boolean) => void;
    placeholder?: string;
    disabled?: boolean;
    variant?: Variant;
    resize?: boolean;
    errorMessage?: string;
    Icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export type InputProps = 
    | ({ 
        mode?: 'input'; 
        type?: 'text' | 'password' | 'email' | 'number' | 'date'; 
      } & BaseInputProps & InputHTMLAttributes<HTMLInputElement>)
    
    | ({ 
        mode: 'textarea'; 
        rows?: number; 
        cols?: number;
        type?: never; // У textarea нет атрибута type
      } & BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>);

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): React.RefCallback<T> {
    return (value) => {
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref && typeof ref === 'object') {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>( 
    ({
        className,
        innerClassName,
        iconClassName,
        value,
        onChange,
        onChangeValue,
        OnFocusChange,
        placeholder,
        disabled = false,
        variant = 'default',
        type = 'text',
        mode = 'input',
        errorMessage = "",
        resize = false,
        Icon,
        ...rest
    }, ref) => {
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const internalTextareaRef = useRef<HTMLTextAreaElement>(null);

        const autoResize = () => {
            const element = internalTextareaRef.current;
            if (element && mode === 'textarea') {
                element.style.height = 'auto';
                element.style.height = `${element.scrollHeight}px`;
            }
        };

        useLayoutEffect(() => {
            if (mode === 'textarea' && resize) {
                autoResize();
            }
        }, [value, mode, resize]);

        const formatToDate = (input: string): string => {
            if (!input) return "";
            const numbers = input.replace(/\D/g, "");

            if (numbers.length > 8) return input;

            if (numbers.length <= 2) return numbers;
            if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
            return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
        };

        const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
            if (event.isTrusted) {
                playSound2D("ui-keyboard-click", 0.15);
            }

            if (type === "date" && event.target instanceof HTMLInputElement)
            {
                const formattedValue = formatToDate(event.target.value);
                event.target.value = formattedValue;
            }

            onChange(event);
            onChangeValue?.(event);
        }

        const handleDateInput = (e: React.FormEvent<HTMLInputElement>) => {
            if (type === 'date') {
                const target = e.target as HTMLInputElement;
                const formatted = formatToDate(target.value);
                
                if (target.value !== formatted) {
                    target.value = formatted;
 
                    const event = new Event('input', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>;

                    Object.defineProperty(event, 'target', { writable: true, value: target });
                    handleOnChange(event); 
                }
            }
        };

        const handleFocus = () => OnFocusChange?.(true);
        const handleBlur = () => OnFocusChange?.(false);

        const baseProps = {
            className: `${styles["input"]} ${Icon ? styles["left"] : ""} ${className || ""}`,
            value,
            onChange: handleOnChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
            placeholder,
            disabled
        };

        return (
            <div className={`${styles["wrapper"]} ${styles[variant]}`}>
                <div className={`${styles["input-inner"]} ${innerClassName || ""}`}>
                    {Icon && <Icon className={`${styles["left-icon"]} ${iconClassName || ""}`} />}

                    {type === "date" ? (
                        <input
                            ref={ref as Ref<HTMLInputElement>}
                            {...baseProps}
                            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="ДД/ММ/ГГГГ"
                            onInput={handleDateInput}
                        />
                    ) : mode === "input" ? (
                        <input
                            ref={ref as Ref<HTMLInputElement>}
                            {...baseProps}
                            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
                            type={type === "password" ? (showPassword ? "text" : "password") : type}
                        />
                    ) : (
                        <textarea
                            ref={mergeRefs(internalTextareaRef, ref as Ref<HTMLTextAreaElement>)}
                            {...baseProps}
                            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    )}
                    <div className={styles["right-icons"]}>
                        {type === "password" &&
                            <div className={styles["password-icon-container"]} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ?
                                    <ShowEye className={styles["right-icon"]} />
                                    :
                                    <HiddenEye className={styles["right-icon"]} />
                                }
                            </div>
                        }
                        {variant === 'success' && <Check className={styles["right-icon"]} />}
                        {variant === 'error' && <ExclamationMark className={styles["right-icon"]} />}
                    </div>
                </div>
                {errorMessage && 
                    <motion.div
                        key="error"
                        initial={{ 
                            opacity: 0, 
                            height: 0, 
                        }}
                        animate={{ 
                            opacity: 1, 
                            height: 'auto',
                        }}
                        transition={{ duration: 0.05 }}
                        className={styles.errorContainer}
                    >

                        <span className={styles["error-message"]}>• {errorMessage}</span> 
                    </motion.div>
                }
            </div>
        )
    }
);