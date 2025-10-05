import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();

    const tabs = [
        { path: '/orders', label: 'Заказы' },
        { path: '/products', label: 'Товары' },
        { path: '/customers', label: 'Клиенты' },
        { path: '/analytics', label: 'Аналитика' }
    ];

    return (
        <nav className="navigation">
            {tabs.map(tab => (
                <Link
                    key={tab.path}
                    to={tab.path}
                    className={`navigation__tab ${location.pathname === tab.path ? 'navigation__tab--active' : ''}`}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;