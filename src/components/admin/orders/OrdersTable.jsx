import React from 'react';
import OrdersRow from './OrdersRow';
import '../AdminTable.css';

const OrdersTable = ({orders}) => {
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
                    <th>Дата и время создания заказа</th>
                    <th>ФИО клиента</th>
                    <th>Номер телефона клиента</th>
                    <th>Электронная почта клиента</th>
                    <th>Адрес доставки</th>
                    <th>Дата доставки</th>
                    <th>Общая сумма заказа</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <OrdersRow key={order.order_id} order={order} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;