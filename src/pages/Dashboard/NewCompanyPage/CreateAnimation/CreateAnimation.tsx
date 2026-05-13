import { HTMLProps, useEffect, FC, useState } from "react";
import styles from "./CreateAnimation.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { Button } from "../../../../components/UI";
import { ArrowRight, Check, CreatedProgress, Cross } from "../../../../components/SVG";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAnimationContext } from "../AnimationContext";

const animationSteps: Record<number, string> = {
    1: "Формируем информацию",
    2: "Анализируем аудиторию",
    3: "Применяем креативы",
    4: "Собираем метрики",
    5: "Кампания создана!"
}

const TOTAL_STEPS = 5;
const STEP_DURATION = 1000; 

export const CreateAnimation: FC = () => {
    const navigate = useNavigate();
    const { status, error, retry, setIsAnimationFinished } = useAnimationContext();

    const [step, setStep] = useState<number>(1);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let currentStep = 1;

        const interval = setInterval(() => {
            currentStep += 1;

            if (currentStep > TOTAL_STEPS) {
                clearInterval(interval);
                setIsFinished(true);
                setIsAnimationFinished?.(true);
                return;
            }

            setStep(currentStep);
        }, STEP_DURATION);

        return () => clearInterval(interval);
    }, [isFinished]);

    const getStepText = () => {
        if (!isFinished) return animationSteps[step];
        
        if (status === "error") return error;

        if (status === "success") return "Кампания создана!";

        return animationSteps[TOTAL_STEPS];
    };

    const getStepDescText = () => {
        if (!isFinished) return `Шаг ${step}`;
        
        if (status === "error") return "Ошибка";

        if (status === "success") return "Создание...";

        return animationSteps[TOTAL_STEPS];
    };

    return (
        <div className={styles["content-container"]}>
            <div className={`${styles["content"]} ${isFinished ? styles[status] : ""} `}>
                <div className={styles["progress-window"]}>
                    <div className={styles["progress-container"]}>
                        <CreatedProgress className={`${styles["progress"]} ${styles[`step-${step}`]}`} />
                        <AnimatePresence>
                            {isFinished && status === "success" &&
                                <motion.div
                                    initial={{scale: 0.7, x: "-50%", y: "-50%"}}
                                    animate={{scale: 1, x: "-50%", y: "-50%"}}
                                    transition={{ duration: 0.1 }}
                                    className={styles["icon-container"]}
                                >
                                    <Check className={styles["icon"]} />
                                </motion.div>
                            }
                            {isFinished && status === "error" &&
                                <motion.div
                                    initial={{scale: 0.7, x: "-50%", y: "-50%"}}
                                    animate={{scale: 1, x: "-50%", y: "-50%"}}
                                    transition={{ duration: 0.1 }}
                                    className={styles["icon-container"]}
                                >
                                    <Cross className={styles["icon"]} />
                                </motion.div>
                            }
                        </AnimatePresence>
                    </div>
                    <div className={styles["step"]}>
                        <span className={styles["description"]}>{getStepDescText()}</span>
                        <span>{getStepText()}</span>
                    </div>
                </div>
                <div className={`${styles["buttons"]} ${isFinished ? styles["visible"] : ""}`}>
                    {status === "loading" &&
                        <Button 
                            variant="secondary" 
                            className={styles["button"]}
                            children="loading"
                            style={{visibility: "hidden"}}
                        />
                    }
                    {status === "error" &&
                        <>
                            <Button 
                                variant="secondary" 
                                className={styles["button"]}
                                onClick={() => navigate("/dashboard/new-company/registration")}
                            >
                                <span>Вернуться назад</span>
                            </Button>
                            <Button variant="secondary" className={styles["button"]} onClick={() => {
                                    retry?.();
                                    setStep(1);
                                    setIsFinished(false);
                                    setIsAnimationFinished?.(false);
                                }}>
                                <span>Повторить попытку</span>
                                <ArrowRight className={styles["icon"]} />
                            </Button>
                        </>
                    }
                    {status === "success" &&                        
                        <Button 
                            variant="secondary" 
                            className={styles["button"]}
                            onClick={() => {
                                navigate("/dashboard/new-company/companies-history")
                            }}
                        >
                            <span>На страницу кампании</span>
                            <ArrowRight className={styles["icon"]} />
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
};
