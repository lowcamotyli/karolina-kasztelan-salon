import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    totalPrice: number;
    onPayNow: () => void;
    onPayLater: () => void;
    isLoading: boolean;
}

const PaymentChoice: React.FC<Props> = ({ totalPrice, onPayNow, onPayLater, isLoading }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-black mb-2">Metoda płatności</h3>
                <p className="text-text-light text-sm font-light">
                    Rezerwacja potwierdzona — wybierz sposób płatności
                </p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={onPayNow}
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-4 font-medium uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    )}
                    <span>Zapłać teraz — {totalPrice} zł</span>
                </button>

                <button
                    onClick={onPayLater}
                    disabled={isLoading}
                    className="w-full border border-gray-200 py-3 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    Zapłać przy wizycie
                </button>
            </div>
        </motion.div>
    );
};

export default PaymentChoice;
