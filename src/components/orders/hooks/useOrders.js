import { useState, useCallback, useEffect } from 'react';

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:8000/api/orders', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data.orders || data);
        } catch (err) {
            setError(err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Автоматически загружаем заказы при монтировании
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const createOrder = useCallback(async (orderData) => {
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
                throw new Error('Ошибка при создании заказа');
            }

            await fetchOrders();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchOrders]);

    const updateOrder = useCallback(async (orderId, orderData) => {
        try {
            const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении заказа');
            }

            await fetchOrders();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchOrders]);

    const deleteOrder = useCallback(async (orderId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Ошибка при удалении заказа');
            }

            await fetchOrders();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        fetchOrders,
        createOrder,
        updateOrder,
        deleteOrder,
        refreshOrders: fetchOrders
    };
};