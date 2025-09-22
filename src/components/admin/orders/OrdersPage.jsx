import React, {useState, useCallback, useEffect} from 'react';
import '../AdminPage.css';
import OrdersTable from './OrdersTable';
import AdminPanel from "../AdminPanel";
import GreenBtn from "../../button/GreenBtn";
import OrdersModal from "./OrdersModal";
import PaginationBar from "../PaginationBar";

const OrdersPage = ({setIsAuthenticated}) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

            // Обновляем список заказов после успешного удаления
            fetchOrders();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <div className="admin-page">
            <h1>Заказы</h1>
            <div className="header-container">
                <AdminPanel />
                <GreenBtn onClick={handleOpenModal}>Создать заказ</GreenBtn>
            </div>
            <PaginationBar
                services={orders}
                pagination={pagination}
                setPagination={setPagination}
            />
            <OrdersTable orders={orders} onDeleteOrder={handleDeleteOrder}/>
            <OrdersModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveOrder}
            />
        </div>
    );
};

export default OrdersPage;