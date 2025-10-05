import React from 'react';
import Filter from '../../common/Filter/Filter';
import Button from '../../common/Button/Button';
import './OrdersFilters.css';

const OrdersFilters = ({ statusOptions, filters, onFilterChange, onClearFilters }) => {
    const handleStatusChange = (value) => {
        onFilterChange('status', value);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value != null);

    // Создаем финальный список опций: "Все статусы" + опции из справочника
    const filterOptions = [
        { value: '', label: 'Все статусы' },
        ...statusOptions
    ];

    return (
        <div className="orders-filters">
            <div className="orders-filters__content">
                <Filter
                    label="Статус заказа"
                    options={filterOptions}
                    value={filters.status || ''}
                    onChange={handleStatusChange}
                    placeholder="Все статусы"
                />

                {hasActiveFilters && (
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onClearFilters}
                        className="orders-filters__clear"
                    >
                        Сбросить фильтры
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OrdersFilters;