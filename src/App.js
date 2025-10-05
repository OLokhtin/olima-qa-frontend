import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import OrdersPage from './components/orders/OrdersPage/OrdersPage';
import Loading from './components/common/Loading/Loading';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Пробуем получить заказы для проверки авторизации
            const response = await fetch('http://localhost:8000/api/orders?limit=1', {
                method: 'GET',
                credentials: 'include',
            });

            setIsAuthenticated(response.ok);
        } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    if (isLoading) {
        return <Loading message="Проверка авторизации..." />;
    }

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ?
                                <Navigate to="/orders" replace /> :
                                <LoginPage onLoginSuccess={handleLoginSuccess} />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuthenticated ?
                                <Navigate to="/orders" replace /> :
                                <RegisterPage onLoginSuccess={handleLoginSuccess} />
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            isAuthenticated ?
                                <OrdersPage setIsAuthenticated={setIsAuthenticated} /> :
                                <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ?
                                <Navigate to="/orders" replace /> :
                                <Navigate to="/login" replace />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;