import { FC } from "react";
import styles from "./PlansPage.module.scss";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";
import { Sparkles } from "../../../components/SVG";
import { PremiumPlan } from "../../../components/UI";
import { Plan } from "../../../types/Dashboard";


export const PlansPage: FC = () => {
    const {} = useAppSelector(state => state.dashboardReducer);
    const {} = useActions(allActions.dashboard)

    const defaultPlan: Plan  = {
        type: "default",
        price: 0,
        description: "Посмотрите, на что способен Adzen",
        advantages: [
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            },
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            },
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            }
        ]
    }

    const plusPlan: Plan = {
        type: "plus",
        price: 1000,
        discount: 20,
        description: "Доступ с расширенными инструментами",
        advantages: [
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            },
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            },
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            }
        ]
    }

    const ultraPlan: Plan = {
        type: "ultra",
        price: 1000,
        discount: 25,
        description: "Доступ с расширенными инструментами",
        advantages: [
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            },
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            },
            {
                Icon: Sparkles,
                name: "Получите простые рекомендации"
            }
        ]
    }

    return (
        <div className={styles["plans-page"]}>
            <span className={styles["title"]}>Откройте для себя новые возможности Adzen</span>
            <div className={styles["plans"]}>
                <PremiumPlan plan={defaultPlan} />
                <PremiumPlan plan={plusPlan} current/>
                <PremiumPlan plan={ultraPlan} />
            </div>
        </div>
    );
};