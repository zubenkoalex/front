import { FC, HTMLProps, RefAttributes, useEffect, useRef, useState } from "react";
import styles from "./ContextMenu.module.scss";
import { SideBarCategory } from "../../../types/Dashboard";
import { ArrowRightThin } from "../../SVG/Arrows/ArrowRightThin";
import { ArrowRightUp } from "../../SVG";
import { ContextMenuItem } from "../../../types/UI";
import { useNavigate } from "react-router-dom";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    elements: ContextMenuItem[][];
    setActive?: (isActive: boolean) => void;
}

export const ContextMenu: FC<ComponentProps> = ({
    className,
    elements,
    setActive
}) => {
    const navigate = useNavigate();
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const submenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = (key: string) => {
        if (submenuTimeoutRef.current) {
            clearTimeout(submenuTimeoutRef.current);
            submenuTimeoutRef.current = null;
        }
        setHoveredKey(key);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const related = e.relatedTarget as HTMLElement;
        
        if (e.currentTarget.contains(related) || 
            (related && related.closest(`.${styles["subcontext"]}`))) {
            return;
        }

        if (submenuTimeoutRef.current) {
            clearTimeout(submenuTimeoutRef.current);
        }
        
        submenuTimeoutRef.current = setTimeout(() => {
            setHoveredKey(null);
            submenuTimeoutRef.current = null;
        }, 100);
    };

    const handleSubmenuMouseEnter = () => {

        if (submenuTimeoutRef.current) {
            clearTimeout(submenuTimeoutRef.current);
            submenuTimeoutRef.current = null;
        }
    };

    const handleSubmenuMouseLeave = () => {
        setHoveredKey(null);
    };

    const handleSelectOption = (option: ContextMenuItem) => {
        if (Boolean(option.subCategories)) return;

        if (option.link) {
            navigate(option.link)
            console.log("navigate")
        } else {
            option.onClick?.();
            setActive?.(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) 
                setActive?.(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`${styles["context-menu"]} ${className ?? ""}`}>
            {elements.map((options, index) => (
                <div key={index} className={styles["menu-buttons"]}>
                    {options.map((option) => (
                        <div
                            key={option.key}
                            className={styles["menu-button-container"]}
                            ref={(el) => (menuRefs.current[option.key] = el)}
                            onMouseEnter={() => option.subCategories && handleMouseEnter(option.key)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={styles["menu-button"]} onClick={() => handleSelectOption(option)}>
                                <div className={styles["content"]}>
                                    <option.Icon className={styles["icon"]} />
                                    <div className={styles["info"]}>
                                        <span>{option.title}</span>
                                        <span className={styles["description"]}>{option.description}</span>
                                    </div>
                                </div>
                                {option.subCategories && <ArrowRightThin className={styles["icon"]} style={{transform: "rotate(180deg)"}} />}
                            </div>
                            {option.subCategories && hoveredKey === option.key &&
                                <div 
                                    className={`${styles["context-menu"]} ${styles["subcontext"]}`}
                                    onMouseEnter={handleSubmenuMouseEnter}
                                    onMouseLeave={handleSubmenuMouseLeave}    
                                >
                                    {option.subCategories.map((subOption) => (
                                        <div key={subOption.key} className={styles["menu-button"]} onClick={() => handleSelectOption(subOption)}>
                                            <div className={styles["content"]}>
                                                <subOption.Icon className={styles["icon"]} />
                                                <div className={styles["info"]}>
                                                    <span>{subOption.title}</span>
                                                    <span className={styles["description"]}>{subOption.description}</span>
                                                </div>
                                            </div>
                                            {subOption.link && <ArrowRightUp className={`${styles["icon"]} ${styles["linked"]}`} />}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    ))}
                    {index+1 < elements.length &&
                        <span className={styles["line"]} />
                    }
                </div>
            ))}
        </div>
    );
};