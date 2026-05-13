import { FC, HTMLProps } from "react";
import styles from "./PremiumPlan.module.scss";
import { Plan } from "../../../types/Dashboard";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    plan: Plan;
    current?: boolean;
}


export const PremiumPlan: FC<ComponentProps> = ({
    className,
    plan,
    current
}) => {
    const { type, price, discount, description, advantages } = plan;

    const formattedType = type ? type[0].toUpperCase() + type.slice(1).toLowerCase() : "";
    const finalPrice = discount ? Math.round(price - (price * (discount / 100))) : price;

    const handleGoPlan = () => {
        // Логика переключения плана
    };

    return (
        <div className={`
            ${styles["plan"]}
            ${styles[type]}
            ${current ? styles["current"] : ""} 
            ${className || ""}
        `}>
            <span className={styles["title"]}>{type === "default" ? "Бесплатно" : `Adzen ${formattedType}`}</span>
            <div className={styles["price-container"]}>
                {Boolean(discount) && <span className={styles["old-price"]}>{price}</span>}
                <div className={styles["price"]}>
                    <span className={styles["number"]}>{finalPrice}</span>
                    <div className={styles["unit"]}>
                        <span>₽ /</span>
                        <span>месяц</span>
                    </div>
                </div>
            </div>
            <span className={styles["description"]}>{description}</span>
            <div className={styles["action-button"]} onClick={handleGoPlan}>
                <span>
                    {current
                    ? "Ваш текущий план" 
                    : type === "default"
                        ? "Вернуться на бесплатный"
                        : `Перейти на ${formattedType}`}
            </span>
            </div>
            <div className={styles["advantages"]}>
                {advantages.map((advantage, index) => {
                    const Icon = advantage.Icon; 

                    return (
                        <div key={index} className={styles["advantage"]}>
                            <Icon className={styles["icon"]}/>
                            <span>{advantage.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};