import React from 'react';
import './PaginationBar.css'

const PaginationBar = ({services, pagination, setPagination}) => {

    const handleNextPage = () => {
        setPagination(prev => ({
            ...prev,
            offset: prev.offset + prev.limit
        }));
    };

    const handlePrevPage = () => {
        setPagination(prev => ({
            ...prev,
            offset: Math.max(0, prev.offset - prev.limit)
        }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({
            ...prev,
            limit: newLimit,
            offset: 0 // Сбрасываем offset при изменении лимита
        }));
    };

    return (
        <div className="pagination-controls">
            <div className="pagination-info">
                Показано: {services.length} записей
                {pagination.total > 0 && ` из ${pagination.total}`}
            </div>
            <div className="pagination-buttons">
                <button
                    onClick={handlePrevPage}
                    disabled={pagination.offset === 0}
                    className="pagination-btn"
                >
                    Назад
                </button>

                <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="limit-select"
                >
                    <option value={10}>10 записей</option>
                    <option value={20}>20 записей</option>
                    <option value={50}>50 записей</option>
                </select>

                <button
                    onClick={handleNextPage}
                    disabled={services.length < pagination.limit}
                    className="pagination-btn"
                >
                    Вперед
                </button>
            </div>
        </div>
    );
};

export default PaginationBar;