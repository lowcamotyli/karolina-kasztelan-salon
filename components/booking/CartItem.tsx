import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CartItemProps {
    index: number;
    service: { id: string; name: string; duration: number; price: number } | null;
    employee: { id: string; first_name: string; last_name: string } | null;
    date: string | null;
    time: string | null;
    onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
    index,
    service,
    employee,
    date,
    time,
    onRemove
}) => {
    const employeeName = employee
        ? `${employee.first_name} ${employee.last_name}`
        : 'Nie wybrano specjalisty';
    const appointmentDateTime = date && time ? `${date} ${time}` : 'Nie wybrano terminu';

    return (
        <AnimatePresence>
            <motion.div
                key={service?.id ?? `cart-item-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-4"
            >
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl text-black">
                        Usługa {index + 1}
                    </h3>

                    {index > 0 && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 text-gray-400 transition-colors hover:border-primary/20 hover:text-primary"
                            aria-label={`Usuń usługę ${index + 1}`}
                        >
                            x
                        </button>
                    )}
                </div>

                <div className="space-y-3 text-sm">
                    <p className={service ? 'text-black' : 'text-gray-400'}>
                        {service?.name ?? 'Nie wybrano usługi'}
                    </p>

                    <p className={employee ? 'text-black' : 'text-gray-400'}>
                        {employeeName}
                    </p>

                    <p className={date && time ? 'text-black' : 'text-gray-400'}>
                        {appointmentDateTime}
                    </p>

                    <p className="text-primary font-bold text-lg">
                        {service ? `${service.price} zł` : ''}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CartItem;
