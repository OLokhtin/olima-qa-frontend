import React, {useState} from 'react';
import '../AdminModal.css'
import Input from "../../input/Input";
import RedBtn from "../../button/RedBtn";
import GreenBtn from "../../button/GreenBtn";

const OrdersModal = ({isOpen, onClose, onSave}) => {
    const [formData, setFormData] = useState({
        status: 1,
        customer_full_name: '',
        customer_phone: '',
        customer_email: '',
        delivery_address: '',
        delivery_date: '',
        total_amount: ''
    });

    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении заказа:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            customer_full_name: '',
            customer_phone: '',
            customer_email: '',
            delivery_address: '',
            delivery_date: '',
            total_amount: ''}
        );
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Создать заказ</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="customer_full_name">ФИО клиента</label>
                        <Input
                            type="text"
                            id="customer_full_name"
                            name="customer_full_name"
                            value={formData.customer_full_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer_phone">Номер телефона клиента</label>
                        <Input
                            type="number"
                            id="customer_phone"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer_email">Электронная почта клиента</label>
                        <Input
                            type="email"
                            id="customer_email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="delivery_address">Адрес доставки</label>
                        <Input
                            type="text"
                            id="delivery_address"
                            name="delivery_address"
                            value={formData.delivery_address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="delivery_date">Дата доставки</label>
                        <Input
                            type="date"
                            id="delivery_date"
                            name="delivery_date"
                            value={formData.delivery_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="total_amount">Общая сумма заказа</label>
                        <Input
                            type="number"
                            id="total_amount"
                            name="total_amount"
                            value={formData.total_amount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <RedBtn type="button" id="cancelBtn" onClick={handleClose}>Отмена</RedBtn>
                        <GreenBtn type="submit">Сохранить</GreenBtn>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrdersModal;