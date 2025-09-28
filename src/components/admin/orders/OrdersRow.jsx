import React from 'react';

const OrdersRow = ({ order, onDeleteOrder, onEditOrder }) => {
    const getStatusText = (status) => {
        const statusMap = {
            '1': 'Новый',
            '2': 'Оформлен',
            '3': 'Собран',
            '4': 'В пути',
            '5': 'Доставлен',
            '6': 'Отменен'
        };
        return statusMap[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('ru-RU');
    };

    return (
        <tr>
            <td>#{order.order_id}</td>
            <td>{getStatusText(order.status)}</td>
            <td>{formatDateTime(order.created_at)}</td>
            <td>{order.customer_full_name || '-'}</td>
            <td>{order.customer_phone || '-'}</td>
            <td>{order.customer_email || '-'}</td>
            <td>{order.delivery_address || '-'}</td>
            <td>{formatDate(order.delivery_date)}</td>
            <td>{order.total_amount ? `${order.total_amount} ₽` : '-'}</td>
            <td>
                <div className="action-buttons">
                    <button
                        className="edit-btn"
                        onClick={() => onEditOrder(order)}
                    >
                        Редактировать
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => onDeleteOrder(order.order_id)}
                    >
                        Удалить
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default OrdersRow;