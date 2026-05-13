import { FC, useEffect, useState } from "react";
import styles from "./SettingsModal.module.scss";
import { Button, Modal, SideBarCategoryComponent } from "../../../UI";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { SettingPages, settingsCategories, SideBarCategory } from "../../../../types/Dashboard";
import { Logout } from "../../../SVG";
import { useLogoutMutation } from "../../../../services/authorizationService";
import { getErrorMessage } from "../../../../utils";
import { playSound2D } from "../../../../utils/sounds";
import { AccountPage, SecurityPage, ServicesPage, SessionsPage } from ".";


export const SettingsModal: FC = () => {
    const { user } = useAppSelector(state => state.accountReducer);
    const { activeModal, modalPage } = useAppSelector(state => state.dashboardReducer)
    const { setActiveModal, setModalPage } = useActions(allActions.dashboard)
    const { addToast } = useActions(allActions.page)

    const currentFullName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim();

    const [logout, { isLoading }] = useLogoutMutation();
    
    const [isHoveredLogout, setIsHoveredLogout] = useState<boolean>(false);

    const handleLogoutButton = async () => {
        if (isLoading) return;

        try {
            await logout().unwrap();
            
            setActiveModal(null);
        } catch (error) {
            addToast({ msg: getErrorMessage(error), type: "error" });
            playSound2D("error", 1);
            console.error("Ошибка при выходе:", error);
        }
    };

    const selectCategory = (category: SideBarCategory) => {
        setModalPage(category.key as SettingPages);
    };

    useEffect(() => {
        if (activeModal === "settings") {
            setModalPage("account");
        }
    }, [activeModal]);

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={styles["settings-modal"]} 
            visible={activeModal === "settings"} 
            setVisible={() => setActiveModal(null)}
            closeButton={false}
        >
            <div className={styles["side-bar"]}>
                <div className={styles["profile"]}>
                    
                    <div className={styles["avatar"]}>
                        <img 
                            src={user?.avatarPath} 
                            className={styles["image"]} 
                        />
                    </div>
                    <div className={styles["info"]}>
                        <span className={styles["name"]}>{currentFullName}</span>
                        {/* <span className={styles["default"]}>premium plan</span> */}
                    </div>
                </div>
                <div className={styles["categories-container"]}>
                    <div className={styles["categories"]}>
                        {settingsCategories.map(category => (
                            <SideBarCategoryComponent 
                                key={category.key} 
                                category={category} 
                                activeStyle="stroke"
                                active={
                                    modalPage === category.key || 
                                    (modalPage === "services" && category.key === "account") || 
                                    (modalPage === "sessions" && category.key === "security")
                                }
                                className={styles["category"]}
                                iconClassName={styles["icon-category"]}
                                nameClassName={styles["name-category"]}
                                onClick={selectCategory}
                            />
                        ))}
                    </div>
                    <Button
                        variant="secondary"
                        className={styles["button"]}
                        spinnerClassName={styles["spinner"]}
                        onMouseEnter={() => setIsHoveredLogout(true)}
                        onMouseLeave={() => setIsHoveredLogout(false)}
                        onClick={handleLogoutButton}
                        isLoading={isLoading}
                    >
                        <Logout isHovered={isHoveredLogout} className={styles["icon"]} />
                        <span>Выйти из учётной записи</span>
                    </Button>
                </div>
            </div>
            <div className={styles["content"]}>
                {modalPage === "account" && <AccountPage />}
                {modalPage === "security" && <SecurityPage />}
                {modalPage === "services" && <ServicesPage />} 
                {modalPage === "sessions" && <SessionsPage />} 
            </div>
        </Modal>
    );
};