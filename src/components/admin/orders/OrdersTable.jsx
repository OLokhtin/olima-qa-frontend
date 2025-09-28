import React from 'react';
import OrdersRow from './OrdersRow';
import '../AdminTable.css';

const OrdersTable = ({orders, onDeleteOrder, onEditOrder}) => {
    if (!orders || orders.length === 0) {
        return null;
    }

    return (
        <div className="admin-table">
            <table>
                <thead>
                <tr>
                    <th>ID заказа</th>
                    <th>Статус заказа</th>
                    <th>Дата создания</th>
                    <th>ФИО клиента</th>
                    <th>Телефон клиента</th>
                    <th>Email клиента</th>
                    <th>Адрес доставки</th>
                    <th>Дата доставки</th>
                    <th>Сумма заказа</th>
                    <th>Действия</th>
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