import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    const location = useLocation();

    return (
        <nav className="admin-panel">
            <div className="panel-container">
                <Link
                    to="/orders"
                    className={`panel-tab ${location.pathname === '/orders' ? 'panel-tab--active' : ''}`}
                >
                    Заказы
                </Link>
                <Link
                    to="/services"
                    className={`panel-tab ${location.pathname === '/orders' ? 'panel-tab--active' : ''}`}
                >
                    Тоже заказы
                </Link>
            </div>
        </nav>
    );
};

export default AdminPanel;