import React from 'react';
import './Table.css';

const Table = ({
                   columns,
                   data,
                   renderRow,
                   emptyMessage = "Нет данных для отображения",
                   className = ''
               }) => {
    if (!data || data.length === 0) {
        return (
            <div className={`table-container ${className}`}>
                <div className="table-empty">{emptyMessage}</div>
            </div>
        );
    }

    return (
        <div className={`table-container ${className}`}>
            <table className="table">
                <thead className="table__header">
                <tr>
                    {columns.map((column, index) => (
                        <th
                            key={column.key || index}
                            className={`table__header-cell ${column.sortable ? 'table__header-cell--sortable' : ''}`}
                            onClick={column.onSort}
                            style={{ width: column.width }}
                        >
                            {column.title}
                            {column.sortable && column.sortIcon && (
                                <span className="table__sort-icon">{column.sortIcon}</span>
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="table__body">
                {data.map((item, index) => renderRow(item, index))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;