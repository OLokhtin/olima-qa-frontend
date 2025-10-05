import React from 'react';
import Navigation from '../Navigation/Navigation';
import Button from '../../common/Button/Button';
import './Header.css';

const Header = ({ onLogout }) => {
    return (
        <header className="header">
            <div className="header__content">
                <Navigation />
                <Button
                    variant="danger"
                    size="small"
                    onClick={onLogout}
                >
                    Выйти
                </Button>
            </div>
        </header>
    );
};

export default Header;