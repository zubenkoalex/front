import { FC, useEffect, useMemo } from "react";
import styles from "./MainInfo.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { DatePicker, Dropdown, Input } from "../../../../components/UI";
import { companyThems } from "../../../../types/CompanyThems";
import { useWizardValidation } from "../WizardValidationContext";

export const MainInfo: FC = () => {
    const { setValid } = useWizardValidation();
    const { main } = useAppSelector(state => state.dashboardReducer.newCompanyBuild);
    const { setNewCompanyMainInfo } = useActions(allActions.dashboard)

    const isValid = useMemo(() => {
        return Boolean(
            main?.theme &&
            main?.name &&
            main?.budget &&
            main?.description &&
            main?.start &&
            main?.end &&
            main?.url
        );
    }, [main]);

    useEffect(() => {
        setValid(isValid);
    }, [isValid]);

    const themeValue = useMemo(() => companyThems.find(g => g.key === main?.theme), [main?.theme])

    return (
        <div className={styles["content"]}>
            <div className={styles["group-inputs"]}>                
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Название кампании</span>
                    <Input
                        value={main?.name ?? ""}
                        onChange={(e) =>
                            setNewCompanyMainInfo({ name: e.target.value })
                        }
                        placeholder="Например: Зимняя распродажа 2026" 
                        className={styles["input"]} 
                    />
                </div>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Ссылка на продукт</span>
                    <Input
                        value={main?.url ?? ""}
                        onChange={(e) =>
                            setNewCompanyMainInfo({ url: e.target.value })
                        }
                        placeholder="https://adzen-ai.ru/" 
                        className={styles["input"]}
                    />
                </div>
            </div>
            <div className={styles["group-inputs"]}>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Тематика</span>
                    <Dropdown 
                        items={companyThems}
                        value={themeValue}
                        placeholder="Например: Юридические услуги" 
                        onChange={(item) =>
                            setNewCompanyMainInfo({ theme: item.key })
                        }
                        className={styles["dropdown"]}
                    />
                </div>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Цель компании</span>
                    <Input 
                        value={main?.purpose ?? ""}
                        onChange={(e) =>
                            setNewCompanyMainInfo({ purpose: e.target.value })
                        }
                        placeholder="Опишите цель" 
                        className={styles["input"]} 
                    />
                </div>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Бюджет (₽)</span>
                    <Input 
                        type="number" 
                        value={main?.budget ?? ""}
                        onChange={(e) =>
                            setNewCompanyMainInfo({ budget: e.target.value })
                        }
                        placeholder="Например: 150 000 ₽" 
                        className={styles["input"]} 
                    />
                </div>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Длительность</span>
                    <DatePicker 
                        mode="range" 
                        onRangeSelect={(start, end) =>
                            setNewCompanyMainInfo({
                                start: start.toISOString(),
                                end: end.toISOString()
                            })
                        }
                        selectStartDate={main?.start ? new Date(main.start) : null}
                        selectEndDate={main?.end ? new Date(main.end) : null}
                        className={styles["input"]} 
                    />
                </div>
            </div>
            <div className={`${styles["input-container"]} ${styles["full"]}`}>
                <span className={styles["label"]}>Описание</span>
                <Input 
                    mode="textarea"
                    value={main?.description ?? ""}
                    onChange={(e) =>
                        setNewCompanyMainInfo({ description: e.target.value })
                    }
                    placeholder="Опишите суть вашей рекламной компании..." 
                    className={styles["input"]} 
                    innerClassName={styles["input-inner"]} 
                />
            </div>
        </div>
    );
};