import React from 'react';
import Button from '../../common/Button/Button';
import { formatDate, formatDateTime, getStatusText } from '../utils/formatters';
import './OrdersRow.css';

const OrdersRow = ({ order, onEdit, onDelete }) => {
    return (
        <tr className="orders-row">
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
                <div className="orders-row__actions">
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => onEdit(order)}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="danger"
                        size="small"
                        onClick={() => onDelete(order.order_id)}
                    >
                        Удалить
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default OrdersRow;