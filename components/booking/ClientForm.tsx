import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const phoneRegex = /^(\+?48\s?\d{3}\s?\d{3}\s?\d{3}|\d{9})$/;

const schema = z.object({
    name: z.string().min(2, 'Imię i nazwisko musi mieć co najmniej 2 znaki'),
    phone: z.string().regex(phoneRegex, 'Podaj poprawny numer telefonu (9 cyfr lub z +48)'),
    email: z.string().email('Podaj poprawny adres e-mail').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Props {
    onSubmit: (data: { name: string; phone: string; email?: string }) => void;
}

const ClientForm: React.FC<Props> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleFormSubmit = (data: FormData) => {
        // Clean email if it's an empty string
        const result = {
            ...data,
            email: data.email === '' ? undefined : data.email,
        };
        onSubmit(result);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
        >
            <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-black mb-2">Dane kontaktowe</h3>
                <p className="text-text-light text-sm font-light">
                    Potrzebujemy Twoich danych, aby potwierdzić rezerwację
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                        Imię i Nazwisko *
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        placeholder="np. Anna Nowak"
                        className={`w-full p-4 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-100'
                            } focus:border-primary outline-none transition-colors text-black font-light`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                        Numer Telefonu *
                    </label>
                    <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        placeholder="np. 123456789"
                        className={`w-full p-4 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-100'
                            } focus:border-primary outline-none transition-colors text-black font-light`}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">
                        E-mail (opcjonalnie)
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        placeholder="np. anna.nowak@przyklad.pl"
                        className={`w-full p-4 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-100'
                            } focus:border-primary outline-none transition-colors text-black font-light`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-[10px] mt-1 uppercase tracking-tight">{errors.email.message}</p>
                    )}
                </div>

                <div className="pt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-primary text-white py-4 font-medium uppercase tracking-widest text-xs hover:bg-black transition-colors shadow-lg"
                    >
                        Potwierdź dane
                    </motion.button>
                </div>

                <p className="text-[10px] text-gray-400 text-center italic">
                    * Pole wymagane
                </p>
            </form>
        </motion.div>
    );
};

export default ClientForm;
