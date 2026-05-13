import { useEffect, FC, useMemo } from "react";
import styles from "./TargetPeople.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { Dropdown } from "../../../../components/UI";
import { ages, countries, genders } from "../../../../types/CompanyThems";
import { interests, interestsIcons } from "../../../../types/Dashboard";
import { useWizardValidation } from "../WizardValidationContext";


export const TargetPeople: FC = () => {
    const { setValid } = useWizardValidation();
    const { targetPeople } = useAppSelector(state => state.dashboardReducer.newCompanyBuild);
    const { setNewCompanyTargetPeople, updateTargetPeopleInterests } = useActions(allActions.dashboard);

    const isValid = useMemo(() => {
        return Boolean(
            targetPeople.interests.length > 0
        );
    }, [targetPeople.interests]);

    useEffect(() => {
        setValid(isValid);
    }, [isValid]);

    const genderValue = useMemo(() => genders.find(g => g.key === targetPeople.gender), [targetPeople.gender])
    const ageValue = useMemo(() => ages.find(g => g.key === targetPeople.age), [targetPeople.age])
    const countryValue = useMemo(() => {
        return Array.isArray(targetPeople.country)
            ? targetPeople.country.map(
                key => countries.find(c => c.key === key)!
            )
            : countries.find(c => c.key === targetPeople.country);
    }, [targetPeople.country]);


    return (
        <div className={styles["content"]}>
            <div className={styles["group-inputs"]}>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Пол</span>
                    <Dropdown
                        items={genders}
                        value={genderValue}
                        onChange={(item) =>
                            setNewCompanyTargetPeople({ gender: item.key })
                        }
                        className={styles["dropdown"]}
                    />
                </div>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Возраст</span>
                    <Dropdown 
                        items={ages}
                        value={ageValue}
                        onChange={(item) => 
                            setNewCompanyTargetPeople({ age: item.key })
                        }
                        className={styles["dropdown"]}
                    />
                </div>
                <div className={styles["input-container"]}>
                    <span className={styles["label"]}>Страна</span>
                    <Dropdown 
                        items={countries}
                        mode="multiple"
                        value={countryValue}
                        onMultipleChange={(items) => 
                            setNewCompanyTargetPeople({
                                country: items.map(item => item.key)
                            })
                        }
                        className={styles["dropdown"]}
                    />
                </div>
            </div>
            <div className={styles["interests-cards"]}>
                <div className={styles["header"]}>
                    <span className={styles["title"]}>Интересы </span>
                    <span className={styles["value"]}> 
                        {targetPeople.interests.length}
                        <span className={styles["description"]}>/10</span>
                    </span>
                </div>
                <div className={styles["cards"]}>
                    {Object.entries(interests).map(([key, name]) => {
                        const Icon = interestsIcons[key];

                        return (
                            <div 
                                key={key} 
                                className={`
                                    ${styles["card-container"]} 
                                    ${styles[key]}
                                    ${targetPeople.interests.includes(key) ? styles["selected"] : ""}
                                `}
                                onClick={() => updateTargetPeopleInterests(key)}
                            >
                                <div className={styles["card"]}>
                                    <Icon className={styles["icon"]} />
                                </div>
                                <span className={styles["name"]}>{name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};