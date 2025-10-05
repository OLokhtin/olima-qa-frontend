import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useSortAndPagination } from '../hooks/useSortAndPagination';
import { useFilter } from '../hooks/useFilter';
import { useDicts } from '../hooks/useDicts';
import OrdersTable from '../OrdersTable/OrdersTable';
import OrdersFilters from '../OrdersFilters/OrdersFilters';
import OrderModal from '../OrderModal/OrderModal';
import Pagination from '../../common/Pagination/Pagination';
import Header from '../../layout/Header/Header';
import Button from '../../common/Button/Button';
import Loading from '../../common/Loading/Loading';
import './OrdersPage.css';

const OrdersPage = ({ setIsAuthenticated }) => {
    const {
        orders,
        loading: ordersLoading,
        error: ordersError,
        createOrder,
        updateOrder,
        deleteOrder
    } = useOrders();

    const {
        loading: dictsLoading,
        error: dictsError,
        fetchDict,
        getDictValue,
        getDictOptions
    } = useDicts(); // Убрали неиспользуемую переменную dicts

    // Загружаем справочник статусов при монтировании
    useEffect(() => {
        fetchDict('dict_order_statuses');
    }, [fetchDict]);

    // Конфигурация фильтров
    const filterConfig = [
        {
            field: 'status',
            filterFn: (itemValue, filterValue) => {
                if (!filterValue) return true;
                // Преобразуем значения в строки для сравнения
                return String(itemValue) === String(filterValue);
            }
        }
    ];

    const {
        filteredData,
        filters,
        setFilter,
        clearAllFilters
    } = useFilter(orders, filterConfig);

    const {
        sortedData: displayedOrders,
        sortConfig,
        onSort,
        pagination,
        onPageChange,
        onItemsPerPageChange,
        totalItems
    } = useSortAndPagination(filteredData);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    const handleEdit = (order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleSave = async (orderData) => {
        try {
            if (editingOrder) {
                await updateOrder(editingOrder.order_id, orderData);
            } else {
                await createOrder(orderData);
            }
            setIsModalOpen(false);
            setEditingOrder(null);
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilter(field, value);
        // Сбрасываем пагинацию при изменении фильтра
        onPageChange(1);
    };

    const handleClearFilters = () => {
        clearAllFilters();
        onPageChange(1);
    };

    const loading = ordersLoading || dictsLoading;
    const error = ordersError || dictsError;

    // Добавим отладочную информацию
    console.log('Orders:', orders);
    console.log('Filters:', filters);
    console.log('Filtered data:', filteredData);
    console.log('Displayed orders:', displayedOrders);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    const statusOptions = getDictOptions('dict_order_statuses');

    return (
        <div className="orders-page">
            <Header onLogout={() => setIsAuthenticated(false)} />

            <div className="orders-page__content">
                <div className="orders-page__header">
                    <div className="orders-page__title">
                        <h1>Заказы</h1>
                        <div className="orders-page__stats">
                            {filters.status && (
                                <span className="filter-badge">
                                    Фильтр: {getDictValue('dict_order_statuses', filters.status)}
                                </span>
                            )}
                            <span>Всего: {orders.length}</span>
                            {filters.status && (
                                <span>Отфильтровано: {filteredData.length}</span>
                            )}
                        </div>
                    </div>
                    <Button variant="success" onClick={handleCreate}>
                        Создать заказ
                    </Button>
                </div>

                <OrdersFilters
                    statusOptions={statusOptions}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                <Pagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(totalItems / pagination.itemsPerPage)}
                    onPageChange={onPageChange}
                    itemsPerPage={pagination.itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    totalItems={totalItems}
                    showingItems={displayedOrders.length}
                />

                <OrdersTable
                    orders={displayedOrders}
                    sortConfig={sortConfig}
                    onSort={onSort}
                    onEdit={handleEdit}
                    onDelete={deleteOrder}
                    getStatusText={(status) => getDictValue('dict_order_statuses', status)}
                />

                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingOrder(null);
                    }}
                    onSave={handleSave}
                    order={editingOrder}
                    isEditing={!!editingOrder}
                    statusOptions={statusOptions}
                />
            </div>
        </div>
    );
};

export default OrdersPage;