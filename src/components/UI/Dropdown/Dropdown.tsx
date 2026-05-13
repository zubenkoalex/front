import { FC, HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";
import { ArrowStroke, Cross } from "../../SVG";
import { DropdownItem } from "../../../types/UI";
import { playSound2D } from "../../../utils/sounds";
import { Checkbox } from "..";
import { vwToPx } from "../../../utils/pxConvertor";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    headerClassName?: HTMLProps<HTMLElement>["className"];
    mode?: "single" | "multiple";
    placeholder?: string;
    items: DropdownItem[];
    value?: DropdownItem | DropdownItem[];
    onChange?: (item: DropdownItem) => void;
    onMultipleChange?: (items: DropdownItem[]) => void;
}

export const Dropdown: FC<ComponentProps> = ({
    className,
    headerClassName,
    mode = "single",
    items,
    value,
    placeholder,
    onChange,
    onMultipleChange
}) => {
    const [isActive, setActive] = useState<boolean>(false);
    const [visibleItems, setVisibleItems] = useState<DropdownItem[]>([]);
    const [hiddenCount, setHiddenCount] = useState<number>(0);

    const [selected, setSelected] = useState<DropdownItem | DropdownItem[] |  undefined>(() => {
        if (mode === "multiple") {
            return Array.isArray(value) ? value : (value ? [value] : []);
        } else {
            return !Array.isArray(value) ? value : undefined;
        }
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const selectedItemsRef = useRef<HTMLDivElement>(null);
    const itemsWidthsRef = useRef<Map<string, number>>(new Map());
    
    const measureItemWidth = useCallback((item: DropdownItem): number => {
        if (!selectedItemsRef.current) return 0;
        
        const tempDiv = document.createElement('div');
        tempDiv.className = styles['selected-item'];
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.whiteSpace = 'nowrap';
        tempDiv.style.pointerEvents = 'none';
        
        tempDiv.innerHTML = `
            ${item.Icon ? '<div class="' + styles['icon-container'] + '"></div>' : ''}
            <span>${item.name}</span>
            <div class="${styles['delete-container']}"></div>
        `;
        
        selectedItemsRef.current.appendChild(tempDiv);
        const width = tempDiv.offsetWidth;
        selectedItemsRef.current.removeChild(tempDiv);
        
        return width;
    }, []);

    const updateVisibleItems = useCallback(() => {
        if (mode !== "multiple" || !headerRef.current || !Array.isArray(selected)) {
            setVisibleItems([]);
            setHiddenCount(0);
            return;
        }

        const header = headerRef.current;
        const headerWidth = header.offsetWidth;
        const headerStyles = getComputedStyle(header);

        const paddingLeft = parseFloat(headerStyles.paddingLeft);
        const paddingRight = parseFloat(headerStyles.paddingRight);
        
        const arrowSpace = vwToPx(0.7812);
        const moreIndicatorSpace = vwToPx(5.2083);

        const availableWidth = headerWidth - paddingLeft - paddingRight - arrowSpace - moreIndicatorSpace;

        let currentWidth = 0;
        const visible: DropdownItem[] = [];
        let hidden = 0;

        for (const item of selected as DropdownItem[]) {
            let itemWidth = itemsWidthsRef.current.get(item.key);
            if (!itemWidth) {
                itemWidth = measureItemWidth(item);
                itemsWidthsRef.current.set(item.key, itemWidth);
            }

            if (currentWidth + itemWidth <= availableWidth) {
                visible.push(item);
                currentWidth += itemWidth;
            } else {
                hidden++;
            }
        }

        setVisibleItems(visible);
        setHiddenCount(hidden);
    }, [mode, selected, measureItemWidth]);

    useEffect(() => {
        updateVisibleItems();

        const resizeObserver = new ResizeObserver(() => {
            itemsWidthsRef.current.clear();
            updateVisibleItems();
        });

        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [updateVisibleItems]);

    useEffect(() => {
        if (mode === "multiple") {
            setSelected(Array.isArray(value) ? value : (value ? [value] : []));
        } else {
            setSelected(!Array.isArray(value) ? value : undefined);
        }
    }, [value, mode]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) 
                setActive(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedKeys = useMemo(() => {
        if (!Array.isArray(selected)) return new Set(selected ? [selected.key] : []);
        return new Set(selected.map(s => s.key));
    }, [selected]);

    const handleItemClick = (item: DropdownItem) => {
        const isMultiple = mode === "multiple";

        if (!isMultiple) {
            setSelected(item);
            onChange?.(item);
            setActive(false);
            playSound2D("ui-click", 0.15);
            return;
        }

        const currentSelected: DropdownItem[] = Array.isArray(selected) ? selected 
        : selected ? [selected] : [];

        const isAlreadySelected = currentSelected.some(s => s.key === item.key);

        let newSelected = isAlreadySelected ? currentSelected.filter(s => s.key !== item.key) : [...currentSelected, item];
        const hasAll = newSelected.some(s => s.key === "all");

        if (item.key === "all") 
            newSelected = hasAll ? [item] : [];
        else if (hasAll)
            newSelected = newSelected.filter(s => s.key !== "all");
        

        if (currentSelected.length === 1 && newSelected.length === 0) return;

        setSelected(newSelected);
        onMultipleChange?.(newSelected);

        itemsWidthsRef.current.clear();

        playSound2D("ui-click", 0.15);
    };

    return (
        <div 
            ref={containerRef}
            className={`${styles["dropdown"]} ${isActive ? styles["active"] : ""} ${styles[mode]} ${className ? className : ""}`}
            onClick={() => setActive(!isActive)}
        >
            <div ref={headerRef} className={`${styles["header"]} ${styles[mode]} ${headerClassName ?? ""}`}>
                {mode === "single" ?
                    <div className={`${styles["single-selected"]} ${selected ? styles["selected-item"] : ""}`}>
                        <span>{selected && !Array.isArray(selected)  ? selected.name : placeholder}</span>
                    </div>
                    :
                    Array.isArray(selected) && selected.some(s => s.key === "all") ?
                        <span className={`${styles["single-selected"]} ${selected.find(s => s.key === "all") ? styles["selected-item"] : ""}`}>
                            {selected && Array.isArray(selected)  ? selected.find(s => s.key === "all")?.name : placeholder}
                        </span>
                        :
                        <div className={styles["selected-items-container"]}>
                            <div ref={selectedItemsRef} className={styles["selected-items"]}>
                                {Array.isArray(selected) && visibleItems.map((item: DropdownItem) => (
                                    <div key={item.key} className={styles["selected-item"]}>
                                        {item.Icon &&
                                            <div className={styles["icon-container"]}>
                                                <item.Icon className={styles["icon"]} />
                                            </div>
                                        }
                                        <span>{item.name}</span>
                                        <div
                                            className={styles["delete-container"]} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleItemClick(item);
                                            }}
                                        >
                                            <Cross className={styles["icon"]} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {hiddenCount > 0 && (
                                <div>...</div>
                            )}
                        </div>
                }
                <ArrowStroke className={styles["arrow"]}/>
            </div>
            <div className={styles["items-container"]}>
                <div className={styles["items"]}>
                    {items.map((item) => (
                        (mode === "multiple" || !selectedKeys.has(item.key)) &&
                            <div
                                key={item.key}
                                className={`${styles["item"]} ${selectedKeys.has(item.key) ? styles["selected"] : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemClick(item);
                                }}
                            >
                                <div className={styles["content"]}>
                                    {item.Icon &&
                                        <div className={styles["icon-container"]}>
                                            <item.Icon className={styles["icon"]} />
                                        </div>
                                    }
                                    <div className={styles["info"]}>
                                        <span className={styles["name"]}>{item.name}</span>
                                        {item.description && <span className={styles["description"]}>{item.description}</span>}
                                    </div>
                                </div>
                                {mode === "multiple" && selectedKeys.has(item.key) && 
                                    <Checkbox 
                                        boxClassName={styles["checkbox"]} 
                                        markClassName={styles["checkbox-mark"]} 
                                        checked 
                                    />
                                }
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
};