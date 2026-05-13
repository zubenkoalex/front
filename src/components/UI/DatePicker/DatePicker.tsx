import React, { HTMLProps, useEffect, useRef, useState } from 'react';
import styles from './DatePicker.module.scss';
import { ArrowStroke, Calendar } from '../../SVG';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownItem } from '../../../types/UI';
import { AnimatePresence, motion } from 'motion/react';
import { playSound2D } from '../../../utils/sounds';

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    onDateSelect?: (date: Date) => void;
    onRangeSelect?: (startDate: Date, endDate: Date) => void;
    mode?: 'single' | 'range';
    initialDate?: Date;
    selectDate?: Date | null;
    selectStartDate?: Date | null;
    selectEndDate?: Date | null;
    timeSelcet?: boolean;
}

const MONTHS: DropdownItem[] = [
    { key: "0", name: "Январь" },
    { key: "1", name: "Февраль" },
    { key: "2", name: "Март" },
    { key: "3", name: "Апрель" },
    { key: "4", name: "Май" },
    { key: "5", name: "Июнь" },
    { key: "6", name: "Июль" },
    { key: "7", name: "Август" },
    { key: "8", name: "Сентябрь" },
    { key: "9", name: "Октябрь" },
    { key: "10", name: "Ноябрь" },
    { key: "11", name: "Декабрь" }
]

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const formatDatePicker = (dateStart: Date, dateEnd?: Date | null, timeSelcet?: boolean): string => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };

    const formatDate = (date: Date) => {
        const d = date.toLocaleDateString('ru-RU', dateOptions);
        if (timeSelcet) {
            const t = date.toLocaleTimeString('ru-RU', timeOptions);
            return `${d} ${t}`;
        }
        return d;
    };

    const formatedDateStart = formatDate(dateStart);
    const formatedDateEnd = dateEnd ? formatDate(dateEnd) : null;

    return `${formatedDateStart}${formatedDateEnd ? ` - ${formatedDateEnd}` : ""}`;
};


export const DatePicker: React.FC<ComponentProps> = ({
    className,
    onDateSelect,
    onRangeSelect,
    mode = 'single',
    initialDate = new Date(),
    selectDate = null,
    selectStartDate = null,
    selectEndDate = null,
    timeSelcet = false
}) => {
    const [currentDate, setCurrentDate] = useState(new Date(initialDate));
    const [selectedDate, setSelectedDate] = useState<Date | null>(selectDate);
    const [rangeStart, setRangeStart] = useState<Date | null>(selectStartDate);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(selectEndDate);

    const [startTime, setStartTime] = useState({ hour: "00", minute: "00" });
    const [endTime, setEndTime] = useState({ hour: "00", minute: "00" });

    const [showCalendar, setShowCalendar] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays: (number | null)[] = [];

    const firstDayMonday = (firstDay + 6) % 7;

    for (let i = firstDayMonday - 1; i >= 0; i--) {
        calendarDays.push(-(daysInPrevMonth - i));
    }

    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push(-(i + 1000));
    }

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1));

    const updateDateTime = (date: Date, time: { hour: string, minute: string }) => {
        const newDate = new Date(date);
        newDate.setHours(parseInt(time.hour), parseInt(time.minute), 0, 0);
        return newDate;
    };

    const handleDayClick = (day: number) => {
        if (day <= 0) return;

        const clickedDate = new Date(year, month, day);

        if (mode === 'single') {
            const dateWithTime = updateDateTime(clickedDate, startTime);
            setSelectedDate(dateWithTime);
            onDateSelect?.(dateWithTime);
            playSound2D("ui-click", 0.15);
        } else {
            if (!rangeStart || (rangeStart && rangeEnd)) {
                const dateWithTime = updateDateTime(clickedDate, startTime);
                setRangeStart(dateWithTime);
                setRangeEnd(null);
            } else {
                if (clickedDate < rangeStart) {
                    const newStart = updateDateTime(clickedDate, startTime);
                    const newEnd = updateDateTime(rangeStart, endTime);
                    setRangeStart(newStart);
                    setRangeEnd(newEnd);
                    onRangeSelect?.(newStart, newEnd);
                    playSound2D("ui-click", 0.15);
                } else {
                    const newEnd = updateDateTime(clickedDate, endTime);
                    setRangeEnd(newEnd);
                    onRangeSelect?.(rangeStart, newEnd);
                    playSound2D("ui-click", 0.15);
                }
            }
        }
    };

    const handleStartTimeChange = (type: 'hour' | 'minute', value: string) => {
        const newTime = { ...startTime, [type]: value };
        setStartTime(newTime);
        
        if (mode === 'single' && selectedDate) {
            const newDate = updateDateTime(selectedDate, newTime);
            setSelectedDate(newDate);
            onDateSelect?.(newDate);
        } else if (mode === 'range' && rangeStart) {
            const newDate = updateDateTime(rangeStart, newTime);
            setRangeStart(newDate);
            if (rangeEnd) onRangeSelect?.(newDate, rangeEnd);
        }
    };

    const handleEndTimeChange = (type: 'hour' | 'minute', value: string) => {
        const newTime = { ...endTime, [type]: value };
        setEndTime(newTime);
        
        if (mode === 'range' && rangeEnd) {
            const newDate = updateDateTime(rangeEnd, newTime);
            setRangeEnd(newDate);
            if (rangeStart) onRangeSelect?.(rangeStart, newDate);
        }
    };


    const isDateInRange = (day: number): boolean => {
        if (!rangeStart || !rangeEnd || day <= 0) return false;
        const date = new Date(year, month, day);

        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const s = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime();
        const e = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime();

        return d >= s && d <= e;
    };

    const isDateRangeStart = (day: number): boolean => {
        if (!rangeStart || day <= 0) return false;

        const date = new Date(year, month, day);
        return date.getFullYear() === rangeStart.getFullYear() && 
               date.getMonth() === rangeStart.getMonth() && 
               date.getDate() === rangeStart.getDate();
    };

    const isDateRangeEnd = (day: number): boolean => {
        if (!rangeEnd || day <= 0) return false;

        const date = new Date(year, month, day);
        return date.getFullYear() === rangeEnd.getFullYear() && 
               date.getMonth() === rangeEnd.getMonth() && 
               date.getDate() === rangeEnd.getDate();
    };

    const isDateSelected = (day: number): boolean => {
        if (!selectedDate || day <= 0) return false;

        const date = new Date(year, month, day);
        return date.getFullYear() === selectedDate.getFullYear() && 
               date.getMonth() === selectedDate.getMonth() && 
               date.getDate() === selectedDate.getDate();
    };

    const hours = Array.from({ length: 24 }, (_, i) => ({ key: String(i).padStart(2, '0'), name: String(i).padStart(2, '0') }));
    const minutes = Array.from({ length: 60 }, (_, i) => ({ key: String(i).padStart(2, '0'), name: String(i).padStart(2, '0') }));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) 
                setShowCalendar(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={styles["date-picker-container"]}>
            <div className={`${styles["date-picker"]}`} onClick={() => setShowCalendar(!showCalendar)}>
                <input
                    type="text"
                    className={`${styles["input"]} ${styles[mode]} ${timeSelcet ? styles["with-time"] : ""} ${className ?? ""}`}
                    placeholder={mode === "single" ? "Выберите дату" : "Выберите диапазон"}
                    value={selectedDate ? formatDatePicker(selectedDate, null, timeSelcet) : rangeStart ? formatDatePicker(rangeStart, rangeEnd, timeSelcet) : ""}
                    readOnly
                />
                <Calendar className={styles["icon"]} />
            </div>
            <AnimatePresence>
                {showCalendar &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                        className={styles["calendar"]}
                    >
                        <div className={styles["navigation"]}>
                            <button
                                className={styles["nav-button"]}
                                onClick={handlePrevMonth}
                            >
                                <ArrowStroke className={`${styles["icon"]} ${styles["left"]}`}  />
                            </button>

                            <div className={styles["month-year-selector"]}>
                                <Dropdown 
                                    className={styles["month-select"]}
                                    headerClassName={styles["header-select"]}
                                    items={MONTHS} 
                                    value={{key: String(month), name: MONTHS[month].name}} 
                                    onChange={(item) => setCurrentDate(new Date(year, parseInt(item.key)))}
                                />
                                <Dropdown
                                    className={styles["year-select"]}
                                    headerClassName={styles["header-select"]}
                                    items={Array.from({ length: 20 }, (_, i) => year - 5 + i).map((y) => { return {key: String(y), name: String(y)}})} 
                                    value={{key: String(year), name: String(year)}} 
                                    onChange={(item) => setCurrentDate(new Date(parseInt(item.key), month))}
                                />
                            </div>

                            <button
                                className={styles["nav-button"]}
                                onClick={handleNextMonth}
                            >
                                <ArrowStroke className={`${styles["icon"]} ${styles["right"]}`}  />
                            </button>
                        </div>

                        <div className={styles["weekdays-row"]}>
                            {WEEKDAYS.map((day) => (
                                <div key={day} className={styles["weekday-header"]}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={styles["days-grid"]}>
                            {calendarDays.map((day, index) => {
                                const isCurrentMonth = day !== null && day > 0;
                                const dayNum = day ?? 0;
                                const isSelected = isCurrentMonth && isDateSelected(dayNum);
                                const isRangeStart = isCurrentMonth && isDateRangeStart(dayNum);
                                const isRangeEnd = isCurrentMonth && isDateRangeEnd(dayNum);
                                const inRange = isCurrentMonth && isDateInRange(dayNum);

                                return (
                                    <button
                                        key={index}
                                        className={`
                                            ${styles["day-button"]} 
                                            ${!isCurrentMonth ? styles["other-month"] : ''} 
                                            ${isSelected ? styles["selected"] : ''} 
                                            ${isRangeStart || isRangeEnd ? styles["range-end"] : ''} 
                                            ${inRange ? styles["in-range"] : ''}
                                        `}
                                        onClick={() => handleDayClick(dayNum)}
                                        disabled={!isCurrentMonth}
                                    >
                                        {Math.abs(dayNum) % 1000}
                                    </button>
                                );
                            })}
                        </div>
                        {timeSelcet &&
                            <div className={styles["time-grid"]}>
                                <div className={styles["time"]}>
                                    <span className={styles["label"]}>{mode === "range" ? "Первая дата" : "Время"}:</span>
                                    <div className={styles["time-selector"]}>
                                        <Dropdown
                                            items={hours}
                                            value={{key: startTime.hour, name: startTime.hour}}
                                            onChange={(item) => handleStartTimeChange('hour', item.key)}
                                            className={styles["time-select"]} 
                                        />
                                        <span>:</span>
                                        <Dropdown
                                            items={minutes}
                                            value={{key: startTime.minute, name: startTime.minute}}
                                            onChange={(item) => handleStartTimeChange('minute', item.key)}
                                            className={styles["time-select"]}
                                        />
                                    </div>
                                </div>
                                {mode === "range" &&
                                    <div className={styles["time"]}>
                                        <span className={styles["label"]}>Вторая дата:</span>
                                        <div className={styles["time-selector"]}>
                                            <Dropdown
                                                items={hours}
                                                value={{key: endTime.hour, name: endTime.hour}}
                                                onChange={(item) => handleEndTimeChange('hour', item.key)}
                                                className={styles["time-select"]} 
                                            />
                                            <span>:</span>
                                            <Dropdown
                                                items={minutes}
                                                value={{key: endTime.minute, name: endTime.minute}}
                                                onChange={(item) => handleEndTimeChange('minute', item.key)}
                                                className={styles["time-select"]}
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
};
