import { useState, useMemo } from 'react';

export const useSortAndPagination = (data, defaultSort = { field: 'created_at', direction: 'asc' }) => {
    const [sortConfig, setSortConfig] = useState(defaultSort);
    const [pagination, setPagination] = useState({
        page: 1,
        itemsPerPage: 10
    });

    const sortedData = useMemo(() => {
        if (!data) return [];

        const sorted = [...data].sort((a, b) => {
            let aValue = a[sortConfig.field];
            let bValue = b[sortConfig.field];

            if (sortConfig.field === 'total_amount') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            } else if (sortConfig.field === 'created_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [data, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (pagination.page - 1) * pagination.itemsPerPage;
        return sortedData.slice(startIndex, startIndex + pagination.itemsPerPage);
    }, [sortedData, pagination]);

    const handleSort = (field) => {
        setSortConfig(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleItemsPerPageChange = (itemsPerPage) => {
        setPagination({ page: 1, itemsPerPage });
    };

    return {
        sortedData: paginatedData,
        sortConfig,
        onSort: handleSort,
        pagination,
        onPageChange: handlePageChange,
        onItemsPerPageChange: handleItemsPerPageChange,
        totalItems: data?.length || 0
    };
};