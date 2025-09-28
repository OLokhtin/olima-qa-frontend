import React, {useEffect, useState} from "react";
import './styles/App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import OrdersPage from "./components/admin/orders/OrdersPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Проверяем авторизацию через любой защищенный эндпоинт
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            // Используем эндпоинт заказов для проверки авторизации
            const response = await fetch('http://localhost:8000/api/orders?limit=1', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else if (response.status === 401) {
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(false);
            }
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
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <Router>
            <div className="App">
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
}

export default App;