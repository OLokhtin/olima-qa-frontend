import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    const location = useLocation();

    const tabs = [
        { path: '/orders', label: 'Заказы' },
        { path: '/products', label: 'Товары' },
        { path: '/customers', label: 'Клиенты' },
        { path: '/analytics', label: 'Аналитика' }
    ];

    return (
        <nav className="admin-panel">
            {tabs.map(tab => (
                <Link
                    key={tab.path}
                    to={tab.path}
                    className={`admin-tab ${location.pathname === tab.path ? 'active' : ''}`}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
};

export default AdminPanel;