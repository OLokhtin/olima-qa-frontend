import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Form/Input/Input';
import Button from '../../components/common/Button/Button';
import './LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        user_email: '',
        user_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
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
            <div className="login-page__container">
                <div className="login-page__header">
                    <h1>Авторизация</h1>
                    <p>Введите ваши учетные данные для входа</p>
                </div>

                {error && (
                    <div className="login-page__error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-page__form">
                    <Input
                        label="Email"
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={(value) => handleInputChange('user_email', value)}
                        placeholder="Введите ваш email"
                        disabled={loading}
                        required
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        name="user_password"
                        value={formData.user_password}
                        onChange={(value) => handleInputChange('user_password', value)}
                        placeholder="Введите ваш пароль"
                        disabled={loading}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        loading={loading}
                        className="login-page__submit"
                    >
                        Войти
                    </Button>

                    <div className="login-page__register">
                        <p>Нет аккаунта?</p>
                        <Button
                            type="button"
                            variant="success"
                            onClick={handleRegisterRedirect}
                            disabled={loading}
                        >
                            Зарегистрироваться
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;