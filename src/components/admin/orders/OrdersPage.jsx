import React, { useState, useEffect, useCallback } from 'react';
import OrdersModal from "./OrdersModal";
import PaginationBar from "../PaginationBar";
import OrdersTable from "./OrdersTable";
import AdminPanel from "../AdminPanel";
import '../AdminPage.css';

const OrdersPage = ({setIsAuthenticated}) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 0,
        total: 0
    });

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                limit: pagination.limit.toString(),
                offset: pagination.offset.toString()
            });

            const response = await fetch(`http://localhost:8000/api/orders?${params}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data.orders || data);

            if (data.total !== undefined) {
                setPagination(prev => ({ ...prev, total: data.total }));
            }
        } catch (err) {
            setError(err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.limit, pagination.offset, setIsAuthenticated]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleSaveOrder = async (orderData) => {
        try {
            const response = await fetch('http://localhost:8000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    return;
                }
                throw new Error('Ошибка при создании заказа');
            }

            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateOrder = async (orderData) => {
        try {
            const response = await fetch(`http://localhost:8000/api/orders/${editingOrder.order_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    return;
                }
                throw new Error('Ошибка при обновлении заказа');
            }

            setEditingOrder(null);
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setIsAuthenticated(false);
                    return;
                }
                throw new Error('Ошибка при удалении заказа');
            }

            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        if (!window.confirm('Вы уверены, что хотите выйти?')) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(false);
            } else {
                throw new Error('Ошибка при выходе из системы');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingOrder(null);
        setIsModalOpen(false);
    };

    const handleModalSave = (orderData) => {
        if (editingOrder) {
            handleUpdateOrder(orderData);
        } else {
            handleSaveOrder(orderData);
        }
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <div className="admin-page">
            <button className="logout-btn" onClick={handleLogout}>
                Выйти
            </button>

            <h1>Заказы</h1>
            <div className="header-container">
                <AdminPanel />
                <div className="header-actions">
                    <button className="green-btn" onClick={handleOpenModal}>
                        Создать заказ
                    </button>
                </div>
            </div>
            <PaginationBar
                services={orders}
                pagination={pagination}
                setPagination={setPagination}
            />
            <OrdersTable
                orders={orders}
                onDeleteOrder={handleDeleteOrder}
                onEditOrder={handleEditOrder}
            />
            <OrdersModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleModalSave}
                order={editingOrder}
                isEditing={!!editingOrder}
            />
        </div>
    );
};

export default OrdersPage;