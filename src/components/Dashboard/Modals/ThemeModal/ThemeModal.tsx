import { FC, useEffect, useState } from "react";
import styles from "./ThemeModal.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { Modal } from "../../../UI";
import { DarkMode, LightMode, Sparkles, SystemMode } from "../../../SVG";
import { themes } from "../../../../types/Dashboard";

interface ComponentProps {
    activeModal: string | null;
    setActiveModal: (state: string | null) => void;
}

export const ThemeModal: FC<ComponentProps> = ({
    activeModal,
    setActiveModal
}) => {
    const {themeMode} = useAppSelector(state => state.dashboardReducer)
    const {setThemeMode} = useActions(allActions.dashboard)

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={styles["themes-modal"]}
            visible={activeModal === "themes"} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
           <div className={styles["header"]}>
                <span className={styles["title"]}>Смена темы</span>
                <span className={styles["description"]}>Смена темы отображения интерфейса</span>
           </div>
           <div className={styles["thems"]}>
                {Object.values(themes).map(theme => (
                    <div
                        key={theme.key}
                        onClick={() => setThemeMode(theme.key)}
                        className={`
                            ${styles["theme"]} 
                            ${themeMode === theme.key ? styles["selected"] : ""}
                        `}
                    >
                        <div className={styles["icon-container"]}>
                            <theme.Icon className={styles["icon"]} />
                        </div>
                        <div className={styles["theme-type"]}>
                            <div className={styles["theme-header"]}>
                                <span>{theme.name}</span>
                                {themeMode === theme.key && <span className={styles["selected"]}>(выбрано)</span>}
                            </div>
                            <span className={styles["description"]}>{theme.description}</span>
                        </div>
                    </div>
                ))}
           </div>
        </Modal>
    );
};