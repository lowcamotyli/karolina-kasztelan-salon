import React from 'react';
import { motion } from 'framer-motion';
import { SimpliEmployee } from '../../lib/types';

interface Props {
    service: { name: string; duration: number; price: number };
    employee: SimpliEmployee;
    date: string;
    time: string;
    client: { name: string; phone: string; email?: string };
    onConfirm: () => void;
    onBack: () => void;
}

const BookingConfirmation: React.FC<Props> = ({
    service,
    employee,
    date,
    time,
    client,
    onConfirm,
    onBack,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
        >
            <div className="text-center mb-10">
                <h3 className="font-display text-2xl text-black mb-2">Podsumowanie</h3>
                <p className="text-text-light text-sm font-light">Sprawdź czy wszystko się zgadza</p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                {/* Service Info */}
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs uppercase tracking-widest text-primary font-bold">Usługa</h4>
                        <span className="font-display text-lg text-black">{service.price} zł</span>
                    </div>
                    <p className="text-black font-medium">{service.name}</p>
                    <p className="text-xs text-text-light font-light">{service.duration} min</p>
                </div>

                {/* Date & Time */}
                <div className="p-6 border-b border-gray-50">
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">Termin</h4>
                    <div className="flex flex-col">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-400 font-light">Usługa</span>
                            <span className="text-black font-medium">{service.name}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-400 font-light">Fryzjerka</span>
                            <span className="text-black font-medium">{employee.first_name} {employee.last_name}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-400 font-light">Data</span>
                            <span className="text-black font-medium">{date}</span>
                        </div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="p-6">
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">Dane Klienta</h4>
                    <div className="space-y-2">
                        <p className="text-sm text-black font-medium">{client.name}</p>
                        <p className="text-sm text-text-light font-light flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">phone</span>
                            {client.phone}
                        </p>
                        {client.email && (
                            <p className="text-sm text-text-light font-light flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                {client.email}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 space-y-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="w-full bg-primary text-white py-4 font-medium uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg"
                >
                    Potwierdzam rezerwację
                </motion.button>

                <button
                    onClick={onBack}
                    className="w-full text-center py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors font-medium underline underline-offset-4"
                >
                    Wróć i popraw dane
                </button>
            </div>

            <p className="mt-8 text-[10px] text-gray-400 text-center leading-relaxed">
                Klikając "Potwierdzam rezerwację" akceptujesz regulamin salonu oraz wyrażasz zgodę na przetwarzanie danych osobowych w celu realizacji usługi.
            </p>
        </motion.div>
    );
};

export default BookingConfirmation;
