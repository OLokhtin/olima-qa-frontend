import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Form/Input/Input';
import Button from '../../components/common/Button/Button';
import './RegisterPage.css';

const RegisterPage = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        user_email: '',
        user_password: '',
        confirm_password: '',
        user_phone: '',
        user_name: '',
        user_surname: '',
        user_birthday: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const navigate = useNavigate();

    // Валидация email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Валидация пароля
    const validatePassword = (password) => {
        return password.length >= 8 && password.length <= 100;
    };

    // Валидация кириллического имени
    const validateCyrillicName = (name) => {
        const cyrillicRegex = /^[а-яёА-ЯЁ]+$/;
        return cyrillicRegex.test(name) && name.length >= 2 && name.length <= 50;
    };

    // Валидация даты рождения
    const validateBirthday = (date) => {
        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        if (!dateRegex.test(date)) return false;

        const [, day, month, year] = date.match(dateRegex);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

        // Проверка корректности даты
        return birthDate.getDate() === parseInt(day) &&
            birthDate.getMonth() === parseInt(month) - 1 &&
            birthDate.getFullYear() === parseInt(year) &&
            birthDate >= minDate &&
            birthDate <= maxDate;
    };

    // Конвертация даты в формат YYYY-MM-DD для бэка
    const convertDateToBackendFormat = (date) => {
        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        if (!dateRegex.test(date)) return date;

        const [, day, month, year] = date.match(dateRegex);
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Форматирование телефона
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.startsWith('7') || numbers.startsWith('8')) {
            const formatted = numbers.substring(1, 11);
            if (formatted.length === 0) return '+7';
            if (formatted.length <= 3) return `+7 (${formatted}`;
            if (formatted.length <= 6) return `+7 (${formatted.slice(0, 3)}) ${formatted.slice(3)}`;
            if (formatted.length <= 8) return `+7 (${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6)}`;
            return `+7 (${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6, 8)}-${formatted.slice(8, 10)}`;
        }
        return `+7${numbers.substring(0, 10)}`;
    };

    // Форматирование даты
    const formatDate = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 4) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
    };

    const handleInputChange = (name, value) => {
        let formattedValue = value;

        if (name === 'user_phone') {
            formattedValue = formatPhone(value);
        } else if (name === 'user_birthday') {
            formattedValue = formatDate(value);
        } else if (name === 'user_name' || name === 'user_surname') {
            // Автоматическая заглавная первая буква
            if (value.length === 1) {
                formattedValue = value.toUpperCase();
            } else if (value.length > 1) {
                formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Сбрасываем флаг ошибки пароля при изменении любого из паролей
        if (name === 'user_password' || name === 'confirm_password') {
            setShowPasswordError(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let hasErrors = false;

        // Валидация email
        if (!formData.user_email) {
            newErrors.user_email = 'Email обязателен';
            hasErrors = true;
        } else if (!validateEmail(formData.user_email)) {
            newErrors.user_email = 'Введите корректный email';
            hasErrors = true;
        }

        // Валидация пароля
        if (!formData.user_password) {
            newErrors.user_password = 'Пароль обязателен';
            hasErrors = true;
        } else if (!validatePassword(formData.user_password)) {
            newErrors.user_password = 'Пароль должен быть от 8 до 100 символов';
            hasErrors = true;
        }

        // Валидация подтверждения пароля
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Подтвердите пароль';
            hasErrors = true;
        } else if (formData.user_password !== formData.confirm_password) {
            newErrors.confirm_password = 'Пароли не совпадают';
            hasErrors = true;
            setShowPasswordError(true);
        }

        // Валидация телефона
        if (!formData.user_phone) {
            newErrors.user_phone = 'Телефон обязателен';
            hasErrors = true;
        } else if (formData.user_phone.replace(/\D/g, '').length !== 11) {
            newErrors.user_phone = 'Введите корректный номер телефона';
            hasErrors = true;
        }

        // Валидация имени
        if (!formData.user_name) {
            newErrors.user_name = 'Имя обязательно';
            hasErrors = true;
        } else if (!validateCyrillicName(formData.user_name)) {
            newErrors.user_name = 'Имя должно содержать только кириллицу (2-50 символов)';
            hasErrors = true;
        }

        // Валидация фамилии
        if (!formData.user_surname) {
            newErrors.user_surname = 'Фамилия обязательна';
            hasErrors = true;
        } else if (!validateCyrillicName(formData.user_surname)) {
            newErrors.user_surname = 'Фамилия должна содержать только кириллицу (2-50 символов)';
            hasErrors = true;
        }

        // Валидация даты рождения
        if (!formData.user_birthday) {
            newErrors.user_birthday = 'Дата рождения обязательна';
            hasErrors = true;
        } else if (!validateBirthday(formData.user_birthday)) {
            newErrors.user_birthday = 'Введите корректную дату рождения (возраст от 16 до 70 лет)';
            hasErrors = true;
        }

        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Подготовка данных для отправки (без confirm_password)
            const { confirm_password, ...submitData } = formData;

            // Конвертируем дату в формат для бэка
            submitData.user_birthday = convertDateToBackendFormat(formData.user_birthday);

            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка регистрации: ${response.status}`);
            }

            // Успешная регистрация - переход на страницу входа
            navigate('/login');

        } catch (err) {
            setErrors(prev => ({ ...prev, submit: err.message || 'Произошла ошибка при регистрации' }));
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1>Регистрация</h1>
                    <p>Заполните форму для создания аккаунта</p>
                </div>

                {errors.submit && (
                    <div className="error-message">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="Электронная почта *"
                                type="email"
                                name="user_email"
                                value={formData.user_email}
                                onChange={(value) => handleInputChange('user_email', value)}
                                error={errors.user_email}
                                placeholder="example@mail.ru"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="Пароль *"
                                type="password"
                                name="user_password"
                                value={formData.user_password}
                                onChange={(value) => handleInputChange('user_password', value)}
                                error={errors.user_password}
                                placeholder="Не менее 8 символов"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                label="Повторный пароль *"
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={(value) => handleInputChange('confirm_password', value)}
                                error={showPasswordError ? 'Пароли не совпадают' : ''}
                                placeholder="Повторите пароль"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="Номер телефона *"
                                type="tel"
                                name="user_phone"
                                value={formData.user_phone}
                                onChange={(value) => handleInputChange('user_phone', value)}
                                error={errors.user_phone}
                                placeholder="+7 (999) 999-99-99"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="Имя *"
                                type="text"
                                name="user_name"
                                value={formData.user_name}
                                onChange={(value) => handleInputChange('user_name', value)}
                                error={errors.user_name}
                                placeholder="Иван"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <Input
                                label="Фамилия *"
                                type="text"
                                name="user_surname"
                                value={formData.user_surname}
                                onChange={(value) => handleInputChange('user_surname', value)}
                                error={errors.user_surname}
                                placeholder="Иванов"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <Input
                                label="Дата рождения *"
                                type="text"
                                name="user_birthday"
                                value={formData.user_birthday}
                                onChange={(value) => handleInputChange('user_birthday', value)}
                                error={errors.user_birthday}
                                placeholder="ДД.ММ.ГГГГ"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleBackToLogin}
                            disabled={loading}
                        >
                            Вернуться
                        </Button>
                        <Button
                            type="submit"
                            variant="success"
                            loading={loading}
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;