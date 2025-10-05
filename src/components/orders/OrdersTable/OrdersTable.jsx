import React from 'react';
import Table from '../../common/Table/Table';
import OrdersRow from '../OrdersRow/OrdersRow';
import './OrdersTable.css';

const OrdersTable = ({ orders, sortConfig, onSort, onEdit, onDelete }) => {
    const getSortIcon = (field) => {
        if (sortConfig.field !== field) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const columns = [
        {
            key: 'order_id',
            title: 'ID заказа',
            width: '100px'
        },
        {
            key: 'status',
            title: 'Статус заказа',
            width: '120px'
        },
        {
            key: 'created_at',
            title: 'Дата заказа', // Убрали стрелку из title
            sortable: true,
            sortIcon: getSortIcon('created_at'), // Стрелка только здесь
            onSort: () => onSort('created_at'),
            width: '150px'
        },
        {
            key: 'customer_full_name',
            title: 'ФИО клиента',
            width: '150px'
        },
        {
            key: 'customer_phone',
            title: 'Телефон клиента',
            width: '140px'
        },
        {
            key: 'customer_email',
            title: 'Email клиента',
            width: '180px'
        },
        {
            key: 'delivery_address',
            title: 'Адрес доставки',
            width: '200px'
        },
        {
            key: 'delivery_date',
            title: 'Дата доставки',
            width: '120px'
        },
        {
            key: 'total_amount',
            title: 'Сумма заказа', // Убрали стрелку из title
            sortable: true,
            sortIcon: getSortIcon('total_amount'), // Стрелка только здесь
            onSort: () => onSort('total_amount'),
            width: '120px'
        },
        {
            key: 'actions',
            title: '',
            width: '140px'
        }
    ];

    const renderRow = (order) => (
        <OrdersRow
            key={order.order_id}
            order={order}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );

    return (
        <Table
            columns={columns}
            data={orders}
            renderRow={renderRow}
            emptyMessage="Нет заказов для отображения"
        />
    );
};

export default OrdersTable;