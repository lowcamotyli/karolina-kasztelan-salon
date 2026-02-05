import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchServices } from '../../lib/api';
import { SimpliService } from '../../lib/types';

interface Props {
    onSelect: (service: { id: string; name: string; duration: number; price: number }) => void;
}

interface GroupedServices {
    [category: string]: {
        [subcategory: string]: SimpliService[];
    };
}

const ServiceSelector: React.FC<Props> = ({ onSelect }) => {
    const [services, setServices] = useState<SimpliService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setIsLoading(true);
                const data = await fetchServices();
                setServices(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania usług');
            } finally {
                setIsLoading(false);
            }
        };

        loadServices();
    }, []);

    const groupedServices = services.reduce((acc: GroupedServices, service) => {
        const category = service.category || 'Inne';
        const subcategory = service.subcategory || 'Podstawowe';

        if (!acc[category]) acc[category] = {};
        if (!acc[category][subcategory]) acc[category][subcategory] = [];

        acc[category][subcategory].push(service);
        return acc;
    }, {});

    const getServiceCountText = (count: number) => {
        if (count === 1) return '1 usługa';
        if (count >= 2 && count <= 4) return `${count} usługi`;
        return `${count} usług`;
    };

    const formatPrice = (price: number | string) => {
        const priceStr = String(price);
        // Remove existing $ if present to avoid double currency symbols
        const cleanPrice = priceStr.replace('$', '').trim();
        return cleanPrice;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">Ładowanie listy usług...</p>
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
            className="space-y-8"
        >
            <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-black mb-2">Wybierz usługę</h3>
                <p className="text-text-light text-sm font-light">Znajdź idealny zabieg dla siebie</p>
            </div>

            <div className="space-y-12">
                {Object.entries(groupedServices).map(([category, subcategories]) => (
                    <div key={category} className="space-y-8">
                        <div className="border-l-4 border-primary pl-4">
                            <h4 className="font-display text-3xl text-black">
                                {category}
                            </h4>
                        </div>

                        {Object.entries(subcategories).map(([subcategory, items]) => (
                            <div key={subcategory} className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h5 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                                        {subcategory}
                                    </h5>
                                    <span className="bg-[#eef2ff] text-[#6366f1] text-[10px] font-bold px-2 py-1 rounded-full">
                                        {getServiceCountText(items.length)}
                                    </span>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {items.map((service) => (
                                        <motion.button
                                            key={service.id}
                                            whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onSelect({
                                                id: service.id,
                                                name: service.name,
                                                duration: service.duration,
                                                price: service.price
                                            })}
                                            className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm hover:border-primary/20 transition-all text-left group"
                                        >
                                            <div className="space-y-4">
                                                <p className="font-display text-lg text-black group-hover:text-primary transition-colors line-clamp-1">
                                                    {service.name}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-primary font-bold text-xl">$ {formatPrice(service.price)} zł</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-400">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        <span className="text-xs font-light">{service.duration} min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ServiceSelector;
