import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

const getSectionKey = (category: string, subcategory: string) => `${category}::${subcategory}`;

const ServiceSelector: React.FC<Props> = ({ onSelect }) => {
    const [services, setServices] = useState<SimpliService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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
        const cleanPrice = priceStr.replace('$', '').trim();
        return cleanPrice;
    };

    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    const visibleGroupedServices = Object.entries(groupedServices).reduce((acc: GroupedServices, [category, subcategories]) => {
            const filteredSubcategories = Object.entries(subcategories).reduce((subcategoryAcc, [subcategory, items]) => {
                const filteredItems = normalizedSearchQuery
                    ? items.filter((service) => service.name.toLowerCase().includes(normalizedSearchQuery))
                    : items;

                if (filteredItems.length > 0) {
                    subcategoryAcc[subcategory] = filteredItems;
                }

                return subcategoryAcc;
            }, {} as GroupedServices[string]);

            if (Object.keys(filteredSubcategories).length > 0) {
                acc[category] = filteredSubcategories;
            }

            return acc;
        }, {});

    useEffect(() => {
        const allSectionKeys = Object.entries(groupedServices).flatMap(([category, subcategories]) =>
            Object.keys(subcategories).map((subcategory) => getSectionKey(category, subcategory))
        );

        setExpandedSections((prev) => {
            const next = new Set(prev);
            let changed = false;

            allSectionKeys.forEach((sectionKey) => {
                if (!next.has(sectionKey)) {
                    next.add(sectionKey);
                    changed = true;
                }
            });

            return changed ? next : prev;
        });
    }, [groupedServices]);

    useEffect(() => {
        if (!normalizedSearchQuery) return;

        setExpandedSections(new Set(
            Object.entries(visibleGroupedServices).flatMap(([category, subcategories]) =>
                Object.keys(subcategories).map((subcategory) => getSectionKey(category, subcategory))
            )
        ));
    }, [normalizedSearchQuery, visibleGroupedServices]);

    const toggleSection = (sectionKey: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);

            if (next.has(sectionKey)) {
                next.delete(sectionKey);
            } else {
                next.add(sectionKey);
            }

            return next;
        });
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

            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                    search
                </span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Szukaj usługi..."
                    className="w-full border rounded-lg px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="space-y-12">
                {Object.entries(visibleGroupedServices).map(([category, subcategories]) => (
                    <div key={category} className="space-y-8">
                        <div className="border-l-4 border-primary pl-4">
                            <h4 className="font-display text-3xl text-black">
                                {category}
                            </h4>
                        </div>

                        {Object.entries(subcategories).map(([subcategory, items]) => {
                            const sectionKey = getSectionKey(category, subcategory);
                            const isExpanded = expandedSections.has(sectionKey);

                            return (
                                <div key={subcategory} className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(sectionKey)}
                                        className="flex w-full items-center justify-between px-1 text-left"
                                    >
                                        <h5 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                                            {subcategory}
                                        </h5>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#eef2ff] text-[#6366f1] text-[10px] font-bold px-2 py-1 rounded-full">
                                                {getServiceCountText(items.length)}
                                            </span>
                                            <span className="material-symbols-outlined text-lg text-gray-400">
                                                {isExpanded ? 'expand_less' : 'expand_more'}
                                            </span>
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ServiceSelector;
