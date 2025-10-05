import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useSortAndPagination } from '../hooks/useSortAndPagination';
import OrdersTable from '../OrdersTable/OrdersTable';
import OrderModal from '../OrderModal/OrderModal';
import Pagination from '../../common/Pagination/Pagination';
import Header from '../../layout/Header/Header';
import Button from '../../common/Button/Button';
import Loading from '../../common/Loading/Loading';
import './OrdersPage.css';

const OrdersPage = ({ setIsAuthenticated }) => {
    const {
        orders,
        loading,
        error,
        createOrder,
        updateOrder,
        deleteOrder
    } = useOrders();

    const {
        sortedData: displayedOrders,
        sortConfig,
        onSort,
        pagination,
        onPageChange,
        onItemsPerPageChange,
        totalItems
    } = useSortAndPagination(orders);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    const handleEdit = (order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleSave = async (orderData) => {
        if (editingOrder) {
            await updateOrder(editingOrder.order_id, orderData);
        } else {
            await createOrder(orderData);
        }
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    if (loading) return <Loading />;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <div className="orders-page">
            <Header onLogout={() => setIsAuthenticated(false)} />

            <div className="orders-page__content">
                <div className="orders-page__header">
                    <h1>Заказы</h1>
                    <Button variant="success" onClick={handleCreate}>
                        Создать заказ
                    </Button>
                </div>

                <Pagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(totalItems / pagination.itemsPerPage)}
                    onPageChange={onPageChange}
                    itemsPerPage={pagination.itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    totalItems={totalItems}
                    showingItems={displayedOrders.length}
                />

                <OrdersTable
                    orders={displayedOrders}
                    sortConfig={sortConfig}
                    onSort={onSort}
                    onEdit={handleEdit}
                    onDelete={deleteOrder}
                />

                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingOrder(null);
                    }}
                    onSave={handleSave}
                    order={editingOrder}
                    isEditing={!!editingOrder}
                />
            </div>
        </div>
    );
};

export default OrdersPage;