import React, { FC } from "react";
import { Toast } from "..";

interface PageProps {
    children: React.ReactNode;
}

export const Page: FC<PageProps> = ({ children }) => {

    return (
        <>
            {children}
            <Toast position="bottom-center" />
        </>
    );
};