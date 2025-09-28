import React, { useState, useEffect } from 'react';
import '../AdminModal.css';

const OrdersModal = ({ isOpen, onClose, onSave, order, isEditing }) => {
    const [formData, setFormData] = useState({
        customer_full_name: '',
        customer_phone: '',
        customer_email: '',
        delivery_address: '',
        delivery_date: '',
        total_amount: '',
        status: '1'
    });
    const [errors, setErrors] = useState({});

    // Сбрасываем форму при открытии/закрытии модального окна
    useEffect(() => {
        if (isOpen) {
            if (order && isEditing) {
                // Заполняем форму данными редактируемого заказа
                setFormData({
                    customer_full_name: order.customer_full_name || '',
                    customer_phone: order.customer_phone || '',
                    customer_email: order.customer_email || '',
                    delivery_address: order.delivery_address || '',
                    delivery_date: order.delivery_date || '',
                    total_amount: order.total_amount || '',
                    status: order.status || '1'
                });
            } else {
                // Сбрасываем форму для создания нового заказа
                setFormData({
                    customer_full_name: '',
                    customer_phone: '',
                    customer_email: '',
                    delivery_address: '',
                    delivery_date: '',
                    total_amount: '',
                    status: '1' // автоматически 1 при создании
                });
            }
            setErrors({});
        }
    }, [isOpen, order, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer_full_name.trim()) {
            newErrors.customer_full_name = 'ФИО клиента обязательно';
        }

        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Номер телефона обязателен';
        }

        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
            newErrors.customer_email = 'Некорректный формат email';
        }

        if (!formData.delivery_address.trim()) {
            newErrors.delivery_address = 'Адрес доставки обязателен';
        }

        if (!formData.delivery_date) {
            newErrors.delivery_date = 'Дата доставки обязательна';
        }

        if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
            newErrors.total_amount = 'Сумма заказа должна быть больше 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // При создании заказа отправляем только необходимые поля
            const dataToSave = isEditing
                ? formData // при редактировании отправляем все поля включая status
                : {
                    customer_full_name: formData.customer_full_name,
                    customer_phone: formData.customer_phone,
                    customer_email: formData.customer_email,
                    delivery_address: formData.delivery_address,
                    delivery_date: formData.delivery_date,
                    total_amount: formData.total_amount,
                    status: '1'
                };

            onSave(dataToSave);
            onClose();
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isEditing ? 'Редактировать заказ' : 'Создать заказ'}</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="customer_full_name">ФИО клиента *</label>
                        <input
                            type="text"
                            id="customer_full_name"
                            name="customer_full_name"
                            value={formData.customer_full_name}
                            onChange={handleInputChange}
                            className={errors.customer_full_name ? 'error' : ''}
                            placeholder="Введите ФИО клиента"
                        />
                        {errors.customer_full_name && (
                            <span className="error-message">{errors.customer_full_name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="customer_phone">Номер телефона *</label>
                        <input
                            type="tel"
                            id="customer_phone"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleInputChange}
                            className={errors.customer_phone ? 'error' : ''}
                            placeholder="Введите номер телефона"
                        />
                        {errors.customer_phone && (
                            <span className="error-message">{errors.customer_phone}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="customer_email">Email *</label>
                        <input
                            type="email"
                            id="customer_email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleInputChange}
                            className={errors.customer_email ? 'error' : ''}
                            placeholder="Введите email"
                        />
                        {errors.customer_email && (
                            <span className="error-message">{errors.customer_email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="delivery_address">Адрес доставки *</label>
                        <textarea
                            id="delivery_address"
                            name="delivery_address"
                            value={formData.delivery_address}
                            onChange={handleInputChange}
                            rows="3"
                            className={errors.delivery_address ? 'error' : ''}
                            placeholder="Введите адрес доставки"
                        />
                        {errors.delivery_address && (
                            <span className="error-message">{errors.delivery_address}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="delivery_date">Дата доставки *</label>
                        <input
                            type="date"
                            id="delivery_date"
                            name="delivery_date"
                            value={formData.delivery_date}
                            onChange={handleInputChange}
                            className={errors.delivery_date ? 'error' : ''}
                        />
                        {errors.delivery_date && (
                            <span className="error-message">{errors.delivery_date}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="total_amount">Сумма заказа *</label>
                        <input
                            type="number"
                            id="total_amount"
                            name="total_amount"
                            value={formData.total_amount}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className={errors.total_amount ? 'error' : ''}
                            placeholder="0.00"
                        />
                        {errors.total_amount && (
                            <span className="error-message">{errors.total_amount}</span>
                        )}
                    </div>

                    {isEditing && (
                        <div className="form-group">
                            <label htmlFor="status">Статус заказа</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="1">Новый</option>
                                <option value="2">В обработке</option>
                                <option value="3">Выполнен</option>
                                <option value="4">Отменен</option>
                            </select>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={handleClose}>
                            Отмена
                        </button>
                        <button type="submit" className="save-button">
                            {isEditing ? 'Сохранить изменения' : 'Создать заказ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrdersModal;