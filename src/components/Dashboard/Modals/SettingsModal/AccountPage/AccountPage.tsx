import { FC, useEffect, useMemo, useState } from "react";
import styles from "./AccountPage.module.scss";
import { Button, Input } from "../../../../UI";
import { Camera, Edit } from "../../../../SVG";
import useInput from "../../../../../hooks/useInput";
import { AnimatePresence, motion } from "motion/react";
import AnimateHeight from "react-animate-height";
import { Setting, themes } from "../../../../../types/Dashboard";
import { useActions, useAppSelector } from "../../../../../hooks/redux";
import { allActions } from "../../../../../store/reducers/actions";
import { useUpdateProfileNameMutation } from "../../../../../services/accountService";
import { playSound2D } from "../../../../../utils/sounds";
import { getErrorMessage } from "../../../../../utils";
import { AdCompanyIcons, AdCompanyNames } from "../../../../../types/UI";
import { DeleteAccountModal, ThemeModal } from "../..";


export const AccountPage: FC = () => {
    const {user} = useAppSelector(state => state.accountReducer);
    const {themeMode, activeModal: globalModal} = useAppSelector(state => state.dashboardReducer);
    const {setModalPage} = useActions(allActions.dashboard);
    const {addToast} = useActions(allActions.page)

    const [updateName, { isLoading }] = useUpdateProfileNameMutation();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const currentFullName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim();
    const profileNameInput = useInput(currentFullName);

    useEffect(() => {
        profileNameInput.setValue(currentFullName);
    }, [currentFullName]);

    useEffect(() => {
        setActiveModal(null);
    }, [globalModal])

    const activeServices = useMemo(() => {
        const list: string[] = [];
        if (user?.vkStatus) list.push("vk");
        if (user?.yandexDirectStatus) list.push("yandex-direct");
        return list;
    }, [user?.vkStatus, user?.yandexDirectStatus]);

    const settings: Setting[] = useMemo(() => [
        {
            key: "services",
            name: "Сервисы",
            values: activeServices.length > 0 
                ? activeServices.map(key => ({
                    Icon: AdCompanyIcons[key as keyof typeof AdCompanyIcons],
                    name: AdCompanyNames[key as keyof typeof AdCompanyNames]
                }))
                : [{ name: "Нет подключенных сервисов" }],
            button: {
                name: "Управление",
                action: () => setModalPage("services")
            }
        },
        {
            key: "theme",
            name: "Тема",
            values: [{
                Icon: themes[themeMode].Icon,
                name: themes[themeMode].name
            }],
            button: {
                name: "Сменить",
                action: () => setActiveModal("themes")
            }
    
        },
        {
            key: "delete",
            name: "Удалить учетную запись",
            values: [],
            button: {
                name: "Удалить",
                action: () => setActiveModal("delete-account")
            }
        },
    ], [user?.yandexDirectStatus, user?.vkStatus, themeMode]); 

    const handleSave = async () => {
        if (isLoading) return;

        const nameParts = profileNameInput.value.trim().split(" ");
        const newFirstname = nameParts[0] || "";
        const newLastname = nameParts.slice(1).join(" ") || "";

        try {
            await updateName({
                firstname: newFirstname,
                lastname: newLastname
            }).unwrap();

            setIsEdit(false);
            addToast({ msg: "Имя успешно обновлено!", type: "success" });

        } catch (error) {
            addToast({ msg: getErrorMessage(error), type: "error" });
            playSound2D("error", 1);

            console.error("Ошибка обновления имени:", error);
        }
    };

    const handleCancel = () => {
        profileNameInput.setValue(currentFullName);
        setIsEdit(false);
    };

    return (
        <div className={styles["account-page"]}>
            <div className={styles["profile-container"]}>
                <div className={styles["profile"]}>
                    <div className={`${styles["avatar"]} ${isEdit ? styles["edit-avatar"] : ""}`}>
                        <img className={styles["image"]} src={user?.avatarPath} />
                        {isEdit &&                        
                            <div className={styles["icon-container"]}>
                                <Camera className={styles["icon"]} />
                            </div>
                        }
                    </div>

                    <AnimatePresence>
                        {isEdit ?
                            <motion.div
                                key="edit"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={styles["edit"]}
                            >
                                <span className={styles["label"]}>Редактирование имени</span>
                                <Input
                                    value={profileNameInput.value}
                                    onChange={profileNameInput.onChange}
                                />
                            </motion.div>
                            :
                            <motion.div
                                key="view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={styles["view"]}
                            >
                                <span className={styles["name"]}>{user?.firstname} {user?.lastname}</span>
                                <div className={styles["edit-icon-container"]} onClick={() => setIsEdit(true)}>
                                    <Edit className={styles["icon"]} />
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
                <AnimateHeight
                    duration={200}
                    height={isEdit ? 'auto' : 0}
                    easing="linear"
                    contentClassName={styles["action-buttons"]}
                >
                    <Button
                        variant="secondary"
                        className={styles["button"]}
                        onClick={handleCancel}
                    >
                        <span>Отменить</span>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleSave}
                        isLoading={isLoading}
                        className={`${styles["button"]} ${styles["primary"]}`}
                        spinnerClassName={styles["spinner"]}
                    >
                        <span>Сохранить</span>
                    </Button>
                </AnimateHeight>
            </div>
            <div className={styles["settings"]}>
                {settings.map(setting => (
                    <div key={setting.key} className={`${styles["setting"]} ${styles[setting.key]}`}>
                        <div className={styles["info"]}>
                            <div className={styles["key"]}>{setting.name}</div>
                            {setting.values.map(value => (
                                <div key={value.name} className={styles["value"]}>
                                    {value.Icon && <value.Icon className={styles["icon"]} />}
                                    <span>{value.name}</span>
                                </div>
                            ))}
                        </div>
                        <div 
                            className={styles["action-button"]} 
                            onClick={setting.button.action}
                        >
                            {setting.button.Icon && <setting.button.Icon className={styles["icon"]} />}
                            <span>{setting.button.name}</span>
                        </div>
                    </div>
                ))}
            </div>
            <ThemeModal 
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            />
            <DeleteAccountModal
                activeModal={activeModal}
                setActiveModal={setActiveModal}
            />
        </div>
    );
};