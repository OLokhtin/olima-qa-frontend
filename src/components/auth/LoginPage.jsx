import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        user_email: '',
        user_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка авторизации: ${response.status}`);
            }

            // Авторизация успешна
            onLoginSuccess();
            navigate('/orders');

        } catch (err) {
            setError(err.message || 'Произошла ошибка при авторизации');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Авторизация</h1>
                    <p>Введите ваши учетные данные для входа</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="user_email"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleInputChange}
                            required
                            placeholder="Введите ваш email"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="user_password"
                            name="user_password"
                            value={formData.user_password}
                            onChange={handleInputChange}
                            required
                            placeholder="Введите ваш пароль"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>

                    <div className="register-section">
                        <p>Нет аккаунта?</p>
                        <button
                            type="button"
                            className="register-btn"
                            onClick={handleRegisterRedirect}
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;