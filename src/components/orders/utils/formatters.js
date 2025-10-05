export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ru-RU');
};

export const getStatusText = (status) => {
    const statusMap = {
        '1': 'Новый',
        '2': 'Оформлен',
        '3': 'Собран',
        '4': 'В пути',
        '5': 'Доставлен',
        '6': 'Отменен'
    };
    return statusMap[status] || status;
};