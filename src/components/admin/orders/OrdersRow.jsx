import React from 'react';
import RedBtn from "../../button/RedBtn";

const OrdersRow = ({order, onDeleteOrder}) => {
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
            <td>
                <RedBtn onClick={() => onDeleteOrder(order.order_id)}>
                    Удалить
                </RedBtn>
            </td>
        </tr>
    );
};

export default OrdersRow;