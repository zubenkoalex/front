import React, { HTMLProps, useEffect, useState } from 'react';
import styles from './RollingNumber.module.scss'
import { Digit } from '..';

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    digitClassName?: HTMLProps<HTMLElement>["className"];
    digitNumberClassName?: HTMLProps<HTMLElement>["className"];
    value: number;
}

export const RollingNumber: React.FC<ComponentProps> = ({ 
    className,
    digitClassName,
    digitNumberClassName,
    value,
}) => {
    const digits = value.toLocaleString().split('');

    return (
        <div className={`${styles["rolling-number"]} ${className ?? ""}`}>
            {digits.map((char, index) => (
                <Digit 
                    key={index} 
                    digit={char} 
                    className={digitClassName}
                    digitNumberClassName={digitNumberClassName}
                />
            ))}
        </div>
    );
};

export default RollingNumber;