import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchEmployees } from '../../lib/api';
import { SimpliEmployee } from '../../lib/types';

interface Props {
    onSelect: (employee: SimpliEmployee) => void;
}

const EmployeeSelector: React.FC<Props> = ({ onSelect }) => {
    const [employees, setEmployees] = useState<SimpliEmployee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                setIsLoading(true);
                const data = await fetchEmployees();
                setEmployees(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania listy pracowników');
            } finally {
                setIsLoading(false);
            }
        };

        loadEmployees();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">Ładowanie listy pracowników...</p>
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
                <h3 className="font-display text-2xl text-black mb-2">Wybierz fryzjerkę</h3>
                <p className="text-text-light text-sm font-light">Zaufaj naszym profesjonalistom</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {employees.map((employee) => (
                    <motion.button
                        key={employee.id}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(employee)}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-display text-lg">
                            {(employee.first_name?.[0] || '') + (employee.last_name?.[0] || '') || '?'}
                        </div>
                        <div>
                            <p className="font-medium text-black">
                                {employee.first_name} {employee.last_name}
                            </p>
                            <p className="text-xs text-text-light font-light">
                                Profesjonalna Stylistka
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default EmployeeSelector;
