import { FC, useState } from "react";
import styles from "./ImageModal.module.scss";
import { Modal } from "../../../UI";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { AnimatePresence } from "motion/react";


export const ImageModal: FC = () => {
    const {activeModal, showedImage} = useAppSelector(state => state.dashboardReducer)
    const {setActiveModal, setShowedImage} = useActions(allActions.dashboard)

    return (
        <Modal
            className={styles["image-modal"]}
            visible={activeModal === "image"} 
            setVisible={() => {
                setActiveModal(null);
                setShowedImage(null);
            }}
        >
            <img 
                src={showedImage ?? ""}
                className={styles["image-modal-content"]}
                onClick={(e) => e.stopPropagation()}
            />
        </Modal>
    );
};