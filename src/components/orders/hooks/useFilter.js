import { useState, useMemo } from 'react';

export const useFilter = (data, filterConfig) => {
    const [filters, setFilters] = useState({});

    const filteredData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return data.filter(item => {
            return Object.entries(filters).every(([field, value]) => {
                if (!value) return true; // Если фильтр не установлен, пропускаем

                const filterConfigItem = filterConfig.find(config => config.field === field);
                if (!filterConfigItem) return true;

                // Применяем функцию фильтрации если она есть
                if (filterConfigItem.filterFn) {
                    return filterConfigItem.filterFn(item[field], value);
                }

                // Стандартная фильтрация по равенству
                return item[field] === value;
            });
        });
    }, [data, filters, filterConfig]);

    const setFilter = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearFilter = (field) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[field];
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilters({});
    };

    return {
        filteredData,
        filters,
        setFilter,
        clearFilter,
        clearAllFilters
    };
};