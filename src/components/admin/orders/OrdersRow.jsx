import React from 'react';

const OrdersRow = ({order}) => {
    return (
        <tr>
            <td>{order.order_id}</td>
            <td>{order.status}</td>
            <td>{order.created_at}</td>
            <td>{order.customer_full_name}</td>
            <td>{order.customer_phone}</td>
            <td>{order.customer_email}</td>
            <td>{order.delivery_address}</td>
            <td>{order.delivery_date}</td>
            <td>{order.total_amount}</td>
        </tr>
    );
};

export default OrdersRow;