import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAvailableDates, fetchAvailability } from '../../lib/api';

interface Props {
    serviceId: string;
    employeeId?: string;
    onSelectDate: (date: string) => void;
}

const BookingCalendar: React.FC<Props> = ({ serviceId, employeeId, onSelectDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [isLoadingDates, setIsLoadingDates] = useState(false);

    useEffect(() => {
        const loadDates = async () => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();
            const firstDate = new Date(year, month, 1);
            const lastDate = new Date(year, month + 1, 0);

            const format = (d: Date) => {
                const m = (d.getMonth() + 1).toString().padStart(2, '0');
                const dd = d.getDate().toString().padStart(2, '0');
                return `${d.getFullYear()}-${m}-${dd}`;
            };

            try {
                setIsLoadingDates(true);
                const dates = await fetchAvailableDates(format(firstDate), format(lastDate), serviceId, employeeId);

                // Verify each date actually has slots — the bulk endpoint sometimes ignores
                // employee working days and exceptions, returning false positives
                if (dates.length > 0) {
                    const verified = await Promise.all(
                        dates.map(async (date) => {
                            try {
                                const slots = await fetchAvailability(date, serviceId, employeeId);
                                return slots.length > 0 ? date : null;
                            } catch {
                                return date; // keep on error to avoid blocking the user
                            }
                        })
                    );
                    setAvailableDates(verified.filter((d): d is string => d !== null));
                } else {
                    setAvailableDates([]);
                }
            } catch (err) {
                console.error("Failed to fetch available dates", err);
                setAvailableDates([]);
            } finally {
                setIsLoadingDates(false);
            }
        };

        if (serviceId) {
            loadDates();
        }
    }, [currentMonth, serviceId, employeeId]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        if (prevMonth >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) {
            setCurrentMonth(prevMonth);
        }
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const formatDate = (year: number, month: number, day: number) => {
        const d = new Date(year, month, day);
        const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
        const dayStr = d.getDate().toString().padStart(2, '0');
        return `${d.getFullYear()}-${monthStr}-${dayStr}`;
    };

    const isPast = (year: number, month: number, day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(year, month, day);
        return date < today;
    };

    const isTooFar = (year: number, month: number, day: number) => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);
        const date = new Date(year, month, day);
        return date > maxDate;
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = daysInMonth(year, month);
    // Adjust for Monday start (0: Sun -> 1: Mon, ..., 6: Sat, 0: Sun shift)
    let firstDay = firstDayOfMonth(year, month) - 1;
    if (firstDay === -1) firstDay = 6; // Sunday becomes 6

    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    const dayLabels = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So', 'Nd'];

    const handleDateClick = (day: number) => {
        const dateStr = formatDate(year, month, day);
        if (isPast(year, month, day) || isTooFar(year, month, day) || !availableDates.includes(dateStr)) return;
        setSelectedDate(dateStr);
        onSelectDate(dateStr);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-black mb-2">Wybierz datę</h3>
                <p className="text-text-light text-sm font-light">Zaplanuj wizytę w dogodnym terminie</p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors disabled:opacity-20"
                        disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h4 className="font-medium text-black uppercase tracking-widest text-sm">
                        {monthNames[month]} {year}
                    </h4>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 mb-4">
                    {dayLabels.map((label) => (
                        <div key={label} className="text-center text-[10px] uppercase tracking-tighter text-gray-400 font-bold">
                            {label}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 relative">
                    {isLoadingDates && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 md:h-12" />
                    ))}
                    {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = formatDate(year, month, day);
                        const past = isPast(year, month, day);
                        const far = isTooFar(year, month, day);
                        const isAvailable = availableDates.includes(dateStr);
                        const disabled = past || far || !isAvailable;
                        const isSelected = selectedDate === dateStr;

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                disabled={disabled}
                                className={`
                  h-10 md:h-12 flex items-center justify-center text-sm transition-all
                  ${disabled
                                        ? 'text-gray-200 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-primary text-white font-bold'
                                            : 'text-black hover:bg-gray-50 hover:text-primary'
                                    }
                `}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary"></div>
                    <span>Wybrana</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-100"></div>
                    <span>Dostępna</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-50 opacity-20"></div>
                    <span>Niedostępna</span>
                </div>
            </div>
        </motion.div>
    );
};

export default BookingCalendar;
