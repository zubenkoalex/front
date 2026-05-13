import React, { FC, HTMLProps, useEffect, useRef, useState } from 'react';
import styles from './TwoFactorCodeInput.module.scss';
import { CodeInput } from '../CodeInput/CodeInput';
import { Variant } from '../../../types/UI';

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    inputClassName?: HTMLProps<HTMLElement>["className"];
    onCodesChange?: (codes: string[]) => void;
    disabled?: boolean;
    variant?: Variant;
}

type CodeInputRef = HTMLInputElement | null;

export const TwoFactorCodeInput: FC<ComponentProps> = ({
    className,
    inputClassName,
    onCodesChange,
    disabled = false,
    variant = 'default',
}) => {
    const [codes, setCodes] = useState<string[]>(new Array(6).fill(""));
    const refs = useRef<CodeInputRef[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
        if (e.key === "Backspace" && index - 1 >= 0) {
            e.preventDefault();

            const newCodes = [...codes];
            if (index == codes.length-1 && newCodes[index] != "")
                newCodes[index] = "";
            else
                newCodes[index-1] = "";

            setCodes(newCodes);
            onCodesChange?.(newCodes);

            if (index == codes.length-1 && newCodes[index-1] != "")
                refs.current[index]?.focus();
            else if (index > 0)
                refs.current[index-1]?.focus();
        }

        if (e.key === "Delete" && index - 1 <= 5) {
            e.preventDefault();

            const newCodes = [...codes];
            if (newCodes[index] !== "") 
                newCodes[index] = "";
            else if (index + 1 < codes.length)
                newCodes[index + 1] = "";

            setCodes(newCodes);
            onCodesChange?.(newCodes);

            if (newCodes[index] !== "") 
                refs.current[index]?.focus();
            else if (index + 1 < codes.length)
                refs.current[index+1]?.focus();
        }

        if (e.key === "ArrowLeft" && index - 1 >= 0)
            refs.current[index - 1]?.focus();

        if (e.key === "ArrowRight" && index + 1 < codes.length)
            refs.current[index + 1]?.focus();
    };

    const handleCodeChange = (newCode: string, index: number) => {
        const newCodes = [...codes.slice(0, index), newCode, ...codes.slice(index + 1)];
        setCodes(newCodes);
        onCodesChange?.(newCodes);

        if (newCode.length > 0 && index + 1 < codes.length)
        refs.current[index + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (!pastedData) return;

        const digits = pastedData.replace(/\D/g, "").split("").slice(0, codes.length);
        if (digits.length === 0) return;

        const newCodes = [...codes];

        digits.forEach((digit, i) => {
            const pos = index + i;
            if (pos < codes.length) {
                newCodes[pos] = digit;
            }
        });

        setCodes(newCodes);
        onCodesChange?.(newCodes);

        const nextEmptyIndex = newCodes.findIndex(c => c === "");
        if (nextEmptyIndex !== -1) {
            refs.current[nextEmptyIndex]?.focus();
        } else {
            refs.current[codes.length - 1]?.focus();
        }
    };

    useEffect(() => refs.current[0]?.focus(), [ ])

    useEffect(() => {
        if (variant === "error") {
            setCodes(new Array(6).fill(""))
            refs.current[0]?.focus()
        }
    }, [variant])

    return (
        <div className={`${styles.wrapper} ${className ? className : ""}`}>
            {codes.map((_code, index) => (
                <CodeInput
                    value={codes[index]}
                    ref={(component: CodeInputRef) => {
                        refs.current[index] = component;
                    }}
                    key={index}
                    index={index}
                    onKeyDown={handleKeyDown}
                    onChange={handleCodeChange}
                    onPaste={(e) => handlePaste(e, index)}
                    disabled={disabled}
                    variant={variant}
                    className={inputClassName}
                />
            ))}
        </div>
    );
};