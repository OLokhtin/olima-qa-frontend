import React, { useState, useEffect, useCallback } from 'react';
import OrdersModal from "./OrdersModal";
import PaginationBar from "../PaginationBar";
import OrdersTable from "./OrdersTable";
import AdminPanel from "../AdminPanel";
import '../AdminPage.css';

const OrdersPage = ({setIsAuthenticated}) => {
    const [allOrders, setAllOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        field: 'created_at',
        direction: 'asc'
    });
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 0,
        total: 0
    });

    // Загружаем все заказы при монтировании
    const fetchAllOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8000/api/orders', {
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
            const orders = data.orders || data;
            setAllOrders(orders);
            setPagination(prev => ({ ...prev, total: orders.length }));

        } catch (err) {
            setError(err.message);
            setAllOrders([]);
        } finally {
            setLoading(false);
        }
    }, [setIsAuthenticated]);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    // Сортировка заказов
    const sortOrders = useCallback((orders, config) => {
        const sortedOrders = [...orders];

        sortedOrders.sort((a, b) => {
            let aValue = a[config.field];
            let bValue = b[config.field];

            // Приводим к числам для суммы заказа
            if (config.field === 'total_amount') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }
            // Приводим к датам для даты создания
            else if (config.field === 'created_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (aValue < bValue) {
                return config.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return config.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sortedOrders;
    }, []);

    // Применяем сортировку и пагинацию
    useEffect(() => {
        if (allOrders.length > 0) {
            const sorted = sortOrders(allOrders, sortConfig);
            const paginated = sorted.slice(pagination.offset, pagination.offset + pagination.limit);
            setDisplayedOrders(paginated);
        } else {
            setDisplayedOrders([]);
        }
    }, [allOrders, sortConfig, pagination.offset, pagination.limit, sortOrders]);

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        // Сбрасываем пагинацию при изменении сортировки
        setPagination(prev => ({ ...prev, offset: 0 }));
    };

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

            fetchAllOrders(); // Перезагружаем все заказы
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
            fetchAllOrders(); // Перезагружаем все заказы
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

            fetchAllOrders(); // Перезагружаем все заказы
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
                services={displayedOrders}
                pagination={pagination}
                setPagination={setPagination}
                totalItems={allOrders.length}
            />
            <OrdersTable
                orders={displayedOrders}
                onDeleteOrder={handleDeleteOrder}
                onEditOrder={handleEditOrder}
                sortConfig={sortConfig}
                onSort={handleSort}
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