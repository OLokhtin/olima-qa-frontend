export const validateOrderForm = (formData, isEditing) => {
    const errors = {};

    if (!formData.customer_full_name?.trim()) {
        errors.customer_full_name = 'ФИО клиента обязательно';
    }

    if (!formData.customer_phone?.trim()) {
        errors.customer_phone = 'Телефон обязателен';
    }

    if (!formData.customer_email?.trim()) {
        errors.customer_email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
        errors.customer_email = 'Некорректный формат email';
    }

    if (!formData.delivery_address?.trim()) {
        errors.delivery_address = 'Адрес доставки обязателен';
    }

    if (!formData.delivery_date) {
        errors.delivery_date = 'Дата доставки обязательна';
    }

    if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
        errors.total_amount = 'Сумма заказа должна быть больше 0';
    }

    return errors;
};