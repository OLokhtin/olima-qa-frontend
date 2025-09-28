import React from 'react';
import OrdersRow from './OrdersRow';
import '../AdminTable.css';

const OrdersTable = ({orders, onDeleteOrder, onEditOrder, sortConfig, onSort}) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="admin-table">
                <div className="text-center mt-4">
                    Нет данных для отображения
                </div>
            </div>
        );
    }

    const getSortIcon = (field) => {
        if (sortConfig.field !== field) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="admin-table">
            <table>
                <thead>
                <tr>
                    <th>ID заказа</th>
                    <th>Статус заказа</th>
                    <th
                        className="sortable"
                        onClick={() => onSort('created_at')}
                    >
                        Дата заказа {getSortIcon('created_at')}
                    </th>
                    <th>ФИО клиента</th>
                    <th>Телефон клиента</th>
                    <th>Email клиента</th>
                    <th>Адрес доставки</th>
                    <th>Дата доставки</th>
                    <th
                        className="sortable"
                        onClick={() => onSort('total_amount')}
                    >
                        Сумма заказа {getSortIcon('total_amount')}
                    </th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <OrdersRow
                        key={order.order_id}
                        order={order}
                        onDeleteOrder={onDeleteOrder}
                        onEditOrder={onEditOrder}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;