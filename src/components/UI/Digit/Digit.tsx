import React, { HTMLProps, useEffect, useState } from 'react';
import styles from './Digit.module.scss'
import { pixelToVH } from '../../../utils/pxConvertor';

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    digitNumberClassName?: HTMLProps<HTMLElement>["className"];
    digit: string;
}

export const Digit: React.FC<ComponentProps> = ({
    className,
    digitNumberClassName,
    digit
}) => {
    const [position, setPosition] = useState(0);
    const isNumber = !isNaN(parseInt(digit));

    useEffect(() => {
        if (isNumber) setPosition(parseInt(digit));
    }, [digit, isNumber]);

    if (!isNumber) return <span className={styles["separator"]}>{digit}</span>;

    return (
        <span className={`${styles["digit"]} ${className ?? ""}`}>
            <div className={`${styles["digit-container"]}  ${styles[`digit-${position}`]}`}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span 
                        key={n} 
                        className={`${styles["digit-number"]} ${digitNumberClassName ?? ""}`}
                    >
                        {n}
                    </span>
                ))}
            </div>
        </span>
    );
};