import { FC } from "react";
import styles from "./ConfirmationModal.module.scss";
import { Button, Modal } from "../../../UI";

interface ComponentProps {
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    description?: string[];
    buttonNo?: string;
    buttonYes?: string;
    activeModal: boolean;
    setActiveModal: (state: string | null) => void;
    onResult?: (result: boolean) => void;
}

export const ConfirmationModal: FC<ComponentProps> = ({
    Icon,
    title,
    description,
    buttonNo,
    buttonYes,
    activeModal,
    setActiveModal,
    onResult
}) => {

    return (
        <Modal 
            classNameContainer={styles["modal-container"]} 
            className={styles["confirmation-modal"]}
            visible={activeModal} 
            setVisible={() => setActiveModal(null)}
            closeButton={true}
            closeButtonStyle="inside"
        >
            {Icon &&
                <div className={styles["icon-container"]}>
                    <Icon className={styles["icon"]} />
                </div>
            }
            <div className={styles["header"]}>
                <span className={styles["title"]}>{title}</span>
                {description &&
                    <div className={styles["description"]}>
                        {description.map((desc, index) => 
                            <span key={index}>{desc}</span>
                        )}
                    </div>
                }
            </div>
            <div className={styles["action-buttons"]}>
                {buttonNo &&
                    <Button 
                        variant="secondary"
                        onClick={() => onResult?.(false)}
                        className={styles["action-button"]} 
                    >
                        <span>{buttonNo}</span>
                    </Button>
                }
                {buttonYes &&
                    <Button 
                        variant="secondary"
                        onClick={() => onResult?.(true)}
                        className={`${styles["action-button"]} ${styles["attention"]}`} 
                    >
                        <span>{buttonYes}</span>
                    </Button>
                }
            </div>
        </Modal>
    );
};
