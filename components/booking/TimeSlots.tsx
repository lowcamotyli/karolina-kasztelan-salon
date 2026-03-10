import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAvailability } from '../../lib/api';

interface Props {
    date: string;
    serviceId: string;
    employeeId: string;
    onSelectTime: (time: string) => void;
}

const TimeSlots: React.FC<Props> = ({ date, serviceId, employeeId, onSelectTime }) => {
    const [slots, setSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        setSelectedSlot(null);
        setSlots([]);
        setError(null);

        const loadSlots = async () => {
            if (!date || !serviceId || !employeeId) return;

            try {
                setIsLoading(true);
                const availableSlots = await fetchAvailability(date, serviceId, employeeId);
                setSlots(availableSlots);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania terminów');
            } finally {
                setIsLoading(false);
            }
        };

        loadSlots();
    }, [date, serviceId, employeeId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">Sprawdzanie dostępności...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="text-sm font-medium text-red-700 hover:text-red-900 underline"
                >
                    Spróbuj ponownie
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-black mb-2">Wybierz godzinę</h3>
                <p className="text-text-light text-sm font-light">
                    Dostępne terminy na dzień <span className="text-black font-medium">{date}</span>
                </p>
            </div>

            {slots.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 p-12 text-center">
                    <span className="material-symbols-outlined text-gray-300 text-4xl mb-4">event_busy</span>
                    <p className="text-gray-500 font-light">Przepraszamy, brak wolnych terminów w tym dniu.</p>
                    <p className="text-xs text-gray-400 mt-2">Prosimy wybrać inną datę.</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                            <motion.button
                                key={slot}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSelectedSlot(slot);
                                    onSelectTime(slot);
                                }}
                                className={`
                  py-3 text-sm font-medium transition-all border
                  ${isSelected
                                        ? 'bg-primary border-primary text-white shadow-md'
                                        : 'bg-white border-gray-100 text-black hover:border-primary hover:text-primary'
                                    }
                `}
                            >
                                {slot}
                            </motion.button>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default TimeSlots;
