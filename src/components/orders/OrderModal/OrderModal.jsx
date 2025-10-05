import React, { useState, useEffect } from 'react';
import Modal from '../../common/Modal/Modal';
import Input from '../../common/Form/Input/Input';
import Select from '../../common/Form/Select/Select';
import Button from '../../common/Button/Button';
import { validateOrderForm } from '../utils/validators';
import './OrderModal.css';

const OrderModal = ({ isOpen, onClose, onSave, order, isEditing, statusOptions }) => {
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (order && isEditing) {
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
                setFormData({
                    customer_full_name: '',
                    customer_phone: '',
                    customer_email: '',
                    delivery_address: '',
                    delivery_date: '',
                    total_amount: '',
                    status: '1'
                });
            }
            setErrors({});
        }
    }, [isOpen, order, isEditing]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateOrderForm(formData, isEditing);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Редактировать заказ' : 'Создать заказ'}
            size="medium"
        >
            {errors.submit && (
                <div className="form-error">{errors.submit}</div>
            )}

            <form onSubmit={handleSubmit} className="order-form">
                <Input
                    label="ФИО клиента *"
                    name="customer_full_name"
                    value={formData.customer_full_name}
                    onChange={(value) => handleInputChange('customer_full_name', value)}
                    error={errors.customer_full_name}
                    placeholder="Введите ФИО клиента"
                    disabled={loading}
                />

                <Input
                    label="Телефон клиента *"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={(value) => handleInputChange('customer_phone', value)}
                    error={errors.customer_phone}
                    placeholder="+7 (999) 999-99-99"
                    disabled={loading}
                />

                <Input
                    label="Email клиента *"
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={(value) => handleInputChange('customer_email', value)}
                    error={errors.customer_email}
                    placeholder="example@mail.ru"
                    disabled={loading}
                />

                <Input
                    label="Адрес доставки *"
                    type="textarea"
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={(value) => handleInputChange('delivery_address', value)}
                    error={errors.delivery_address}
                    placeholder="Введите адрес доставки"
                    disabled={loading}
                    rows={3}
                />

                <Input
                    label="Дата доставки *"
                    type="date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={(value) => handleInputChange('delivery_date', value)}
                    error={errors.delivery_date}
                    disabled={loading}
                />

                <Input
                    label="Сумма заказа *"
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={(value) => handleInputChange('total_amount', value)}
                    error={errors.total_amount}
                    placeholder="0.00"
                    disabled={loading}
                    min="0"
                    step="0.01"
                />

                {isEditing && (
                    <Select
                        label="Статус заказа"
                        name="status"
                        value={formData.status}
                        onChange={(value) => handleInputChange('status', value)}
                        options={statusOptions || []}
                        disabled={loading}
                    />
                )}

                <div className="order-form__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        variant="success"
                        loading={loading}
                    >
                        {isEditing ? 'Сохранить изменения' : 'Создать заказ'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default OrderModal;