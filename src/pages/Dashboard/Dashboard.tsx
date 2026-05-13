import { FC } from "react";
import styles from "./Dashboard.module.scss";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Page, Spinner } from "../../components/UI";
import { SideBar } from "../../components/Dashboard";
import { ImageModal, ReportModal, SettingsModal } from "../../components/Dashboard/Modals";
import { useGetMeQuery } from "../../services/accountService";

export const Dashboard: FC = () => {
    const location = useLocation();

    // const { isLoading, error, data: user } = useGetMeQuery(undefined, {
    //     pollingInterval: 180000,
    // });

    // if (error && 'status' in error && (error.status === 401 || error.status === 403)) {
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }

    // if (isLoading || error || !user) {
    //     return (
    //         <Page>
    //             <div className={styles["spinner-container"]}>
    //                 <Spinner className={styles["spinner"]} />
    //             </div>
    //         </Page>
    //     );
    // }

    return (
        <Page>
            <div className={styles["dashboard"]}>
                <SideBar />
                <Outlet />
                <SettingsModal />
                <ImageModal />
                <ReportModal />
            </div>
        </Page>
    );
};