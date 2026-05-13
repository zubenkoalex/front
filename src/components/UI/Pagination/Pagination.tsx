import { FC, HTMLProps, useMemo } from "react";
import styles from "./Pagination.module.scss";
import { ArrowDown, ArrowRight, ArrowRightLong, ArrowRightUp, ArrowStroke, ArrowUp } from "../../SVG";
import { ArrowRightThin } from "../../SVG/Arrows/ArrowRightThin";

export interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: FC<ComponentProps> = ({
    className,
    currentPage,
    totalPages,
    onPageChange,
}) => {

    const pages = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }, [currentPage, totalPages]);

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`${styles["pagination"]} ${className ?? ""}`}>
            <div
                className={`${styles["item"]} ${currentPage === 1 ? styles["disabled"] : ""}`}
                onClick={handlePrev}
            >
                <ArrowStroke className={`${styles["icon"]} ${styles["left"]}`} />
            </div>

            {/* Номера страниц */}
            {pages.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            className={`${styles["item"]} ${styles["ellipsis"]}`}
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <div
                        key={page}
                        className={`${styles["item"]} ${page === currentPage ? styles["active"] : ""}`}
                        onClick={() => onPageChange(page as number)}
                    >
                        {page}
                    </div>
                );
            })}

            <div
                className={`${styles["item"]} ${currentPage === totalPages ? styles["disabled"] : ""}`}
                onClick={handleNext}
            >
                <ArrowStroke className={`${styles["icon"]} ${styles["right"]}`} />
            </div>
        </div>
    );
};