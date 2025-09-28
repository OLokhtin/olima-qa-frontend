import React from 'react';
import './PaginationBar.css';

const PaginationBar = ({services, pagination, setPagination}) => {
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
    const totalPages = Math.ceil(pagination.total / pagination.limit);

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
            offset: 0
        }));
    };

    return (
        <div className="pagination-bar">
            <div className="pagination-info">
                Показано {services.length} из {pagination.total} записей
            </div>

            <div className="pagination-controls">
                <button
                    onClick={handlePrevPage}
                    disabled={pagination.offset === 0}
                    className="pagination-btn"
                >
                    ← Назад
                </button>

                <div className="pagination-page-info">
                    Страница {currentPage} из {totalPages}
                </div>

                <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="pagination-select"
                >
                    <option value={10}>10 на странице</option>
                    <option value={20}>20 на странице</option>
                    <option value={50}>50 на странице</option>
                </select>

                <button
                    onClick={handleNextPage}
                    disabled={services.length < pagination.limit}
                    className="pagination-btn"
                >
                    Вперед →
                </button>
            </div>
        </div>
    );
};

export default PaginationBar;