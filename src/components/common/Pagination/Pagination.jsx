import React from 'react';
import Button from '../Button/Button';
import './Pagination.css';

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPageChange,
                        itemsPerPage,
                        onItemsPerPageChange,
                        totalItems,
                        showingItems,
                        itemsPerPageOptions = [10, 20, 50]
                    }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <div className="pagination__info">
                Показано {showingItems} из {totalItems} записей
            </div>

            <div className="pagination__controls">
                <Button
                    variant="secondary"
                    size="small"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    ← Назад
                </Button>

                <div className="pagination__page-info">
                    Страница {currentPage} из {totalPages}
                </div>

                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="pagination__select"
                >
                    {itemsPerPageOptions.map(option => (
                        <option key={option} value={option}>
                            {option} на странице
                        </option>
                    ))}
                </select>

                <Button
                    variant="secondary"
                    size="small"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    Вперед →
                </Button>
            </div>
        </div>
    );
};

export default Pagination;