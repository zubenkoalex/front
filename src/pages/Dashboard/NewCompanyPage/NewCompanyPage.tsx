import { FC, HTMLProps, useEffect, useMemo, useState } from "react";
import styles from "./NewCompanyPage.module.scss";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";
import { BackgroundBlob, Button } from "../../../components/UI";
import { ArrowRightLong, Sparkles } from "../../../components/SVG";
import { vhToPx } from "../../../utils/pxConvertor";
import { keyToStepMap, CompanyCreative, newCompanyElementsInfo, newCompanySteps, stepToKeyMap } from "../../../types/Dashboard";
import React from "react";
import cone1 from "../../../assets/NewCompany/Cone1.png";
import cone2 from "../../../assets/NewCompany/Cone2.png";
import cone3 from "../../../assets/NewCompany/Cone3.png";
import cone4 from "../../../assets/NewCompany/Cone4.png";
import { useCreateCompanyMutation } from "../../../services/dashboardService";
import { playSound2D } from "../../../utils/sounds";
import { getErrorMessage } from "../../../utils";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { WizardValidationContext } from "./WizardValidationContext";
import { AnimationContext } from "./AnimationContext";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const NewCompanyPage: FC<ComponentProps> = ({
    className,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const {newCompanyBuild} = useAppSelector(state => state.dashboardReducer);
    const {addToast} = useActions(allActions.page)

    const pathParts = location.pathname.split("/").filter(Boolean);
    const newCompanyIndex = pathParts.indexOf("new-company");
    const currentStepKey = pathParts[newCompanyIndex + 1] || "main-info";

    const currentStepIndex = useMemo(() => {
        return keyToStepMap[currentStepKey] ?? 1;
    }, [currentStepKey]);

    const [isFinishCreateAnimation, setIsFinishCreateAnimation] = useState<boolean>(false);
    const [isStepValid, setIsStepValid] = useState<boolean>(false);

    const cones = [cone1, cone2, cone3, cone4];
    const [createCompany, {isLoading, error, isSuccess}] = useCreateCompanyMutation();

    useEffect(() => {
        if (currentStepKey !== "create-animation") {
            setIsFinishCreateAnimation(false);
        }
    }, [currentStepKey]);

    useEffect(() => {
        let maxAllowedStep = 1;

        if (newCompanyBuild.main) {
            maxAllowedStep = 2; 
            
            if (newCompanyBuild.targetPeople) {
                maxAllowedStep = 3; 
                
                if (newCompanyBuild.creatives.selected.length > 0) {
                    maxAllowedStep = 4; 
                    
                    if (newCompanyBuild.forecast) {
                        maxAllowedStep = 5; 
                        
                        if (newCompanyBuild.platform && newCompanyBuild.strategy) {
                            maxAllowedStep = 6; 
                        }
                    }
                }
            }
        }

        if (currentStepIndex > maxAllowedStep) {
            const fallbackKey = stepToKeyMap[maxAllowedStep];
            
            const route = fallbackKey === "main-info" 
                ? `/dashboard/new-company` 
                : `/dashboard/new-company/${fallbackKey}`;
                
            navigate(route, { replace: true });
        }
    }, [currentStepIndex, newCompanyBuild, navigate]);

    const handleBack = () => {
        const prevStep = Math.max(currentStepIndex - 1, 1);
        const prevKey = stepToKeyMap[prevStep];

        console.log(prevKey)
        if (prevKey === "main-info") navigate(`/dashboard/new-company`);
        else if (prevKey) navigate(`/dashboard/new-company/${prevKey}`);
    };

    const handleNext = () => {
        if (!isStepValid && currentStepKey !== "create-animation") return;

        const nextStep = Math.min(currentStepIndex + 1, Object.keys(newCompanySteps).length);
        const nextKey = stepToKeyMap[nextStep];
        if (nextKey) navigate(`/dashboard/new-company/${nextKey}`);
    };

    const handleCreate = async () => {
        const {main, targetPeople, creatives, platform, strategy} = newCompanyBuild;

        const selectedCreatives = creatives.selected
            .map(s => creatives.default.find(crt => crt.id === s))
            .filter((crt): crt is CompanyCreative => crt !== undefined);

        if (!main || selectedCreatives.length === 0 || !platform || !strategy) {
            addToast({ msg: "Ошибка при сохранении одного из этапов", type: "error"});
            playSound2D("error", 1);
            return;
        }

        navigate(`/dashboard/new-company/create-animation`);
        await createCompany({main, targetPeople, selectedCreatives, platform, strategy});
    }

    const animationStatus = isLoading ? "loading" : isSuccess ? "success" : error ? "error" : undefined;

    const validationContextValue = useMemo(() => ({
        setValid: setIsStepValid,
        isCreating: isLoading
    }), [isLoading]);

    return (
        <WizardValidationContext.Provider value={validationContextValue}>
            <div 
                className={`
                        ${styles["new-company-page"]} 
                        ${styles[currentStepKey ?? ""]} 
                        ${isFinishCreateAnimation ? styles["animation-finished"] : ""}
                        ${styles[animationStatus ?? ""]}
                        ${className ? className : ""}
                    `}
                >
                <div className={styles["blobs"]}>
                    <BackgroundBlob className={`${styles["blob"]} ${styles["top-left"]}`} color="orange" animation="opacity" />
                    <BackgroundBlob className={`${styles["blob"]} ${styles["bottom-right"]}`} color="orange" animation="opacity" delay={1000} />
                </div>
                <div className={styles["cones"]}>
                    {cones.map((cone, i) => 
                        <div 
                            key={i}
                            className={styles["cone"]} 
                            style={{
                                "--image": `url(${cone})`,
                                "--mask": `url(${cone})`
                            } as React.CSSProperties}
                        />
                
                    )}
                </div>
                <div className={styles["form-container"]}>
                    <div className={styles["form-blur-layer"]} />
                    <div className={styles["steps"]}>
                        {Object.entries(newCompanySteps).map(([stepIndex, step], index) => {
                            const stepNum = Number(stepIndex);
                            const totalSteps = Object.keys(newCompanySteps).length;

                            const progressPercent = Math.round((index / (totalSteps - 2)) * 100);
                            const isDone = stepNum < currentStepIndex || currentStepKey === "create-animation";
                            const isCurrent = stepNum === currentStepIndex && currentStepKey !== "create-animation";

                            return (
                                <React.Fragment key={index}>
                                    <div className={`
                                            ${styles["step"]} 
                                            ${isDone ? styles["done"] : ""}
                                            ${isCurrent ? styles["current"] : ""}
                                        `}
                                    >
                                        <div className={styles["icon-container"]}>
                                            {index === 0 &&
                                                <svg className={styles["border-svg"]} viewBox={`0 0 ${vhToPx(4.6296)} ${vhToPx(4.6296)}`} preserveAspectRatio="none">
                                                    <rect className={styles["border-rect"]}  />
                                                </svg>
                                            }
                                            <step.Icon className={styles["icon"]} />
                                        </div>
                                        <span className={styles["name"]}>{step.name}</span>
                                    </div>
                                    {index != Object.values(newCompanySteps).length -1 &&
                                        <div className={`${styles["progress"]} ${isDone ? styles["done"] : ""}`}>
                                            <span className={styles["value"]}>{index > 0 ? `${progressPercent}%` : ""}</span>
                                            <span className={styles["line"]} />
                                        </div>
                                    }
                                </React.Fragment>
                            )
                        })}
                    </div>
                    {currentStepKey &&
                        <div className={`${styles["form"]} ${className ? className : ""}`}>
                            {currentStepKey !== "create-animation" &&                            
                                <div className={styles["header"]}>
                                    <div className={styles["icon-container"]}>
                                        <img className={styles["icon"]} src={newCompanyElementsInfo[currentStepKey].Icon} />
                                    </div>
                                    <div className={styles["info"]}>
                                        <span className={styles["title"]}>{newCompanyElementsInfo[currentStepKey].name}</span>
                                        <span className={styles["description"]}>
                                            {newCompanyElementsInfo[currentStepKey]?.description.map((desc, index) => (
                                                <span key={index}>{desc}</span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            }
                            {currentStepKey === "create-animation" ?
                                <AnimationContext.Provider value={{
                                    status: animationStatus ?? "loading",
                                    error: getErrorMessage(error),
                                    setIsAnimationFinished: setIsFinishCreateAnimation,
                                    retry: handleCreate
                                }}>  
                                    <Outlet />
                                </AnimationContext.Provider>
                                :
                                <Outlet />
                            }
                        </div>
                    }
                    {currentStepKey !== "create-animation" &&
                        <>
                            <span className={styles["line"]} />
                            <div className={styles["buttons"]}>
                                {currentStepIndex > 1 &&
                                    <Button 
                                        variant="secondary" 
                                        className={`${styles["button"]} ${styles["back"]}`}
                                        onClick={handleBack}
                                    >
                                        <ArrowRightLong className={styles["icon"]} />
                                        <span>Назад</span>
                                    </Button>
                                }
                                {currentStepIndex < 5 ?
                                    <Button 
                                        variant="secondary" 
                                        className={`${styles["button"]} ${styles["next"]}`} 
                                        onClick={handleNext}
                                        disabled={!isStepValid}
                                    >
                                        <span>Далее</span>
                                        <ArrowRightLong className={styles["icon"]} />
                                    </Button>
                                    :
                                    <Button 
                                        variant="primary" 
                                        className={`${styles["button"]} ${styles["create"]}`} 
                                        onClick={handleCreate}
                                        isLoading={isLoading}
                                    >
                                        <Sparkles className={`${styles["icon"]} ${styles["sparkles"]}`} />
                                        <span>Создать кампанию</span>
                                        <ArrowRightLong className={styles["icon"]} />
                                    </Button>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
        </WizardValidationContext.Provider>
    );
};
