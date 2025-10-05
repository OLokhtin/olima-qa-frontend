import React from 'react';
import './Button.css';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'medium',
                    disabled = false,
                    loading = false,
                    onClick,
                    type = 'button',
                    className = '',
                    ...props
                }) => {
    const buttonClass = `btn btn--${variant} btn--${size} ${disabled ? 'btn--disabled' : ''} ${className}`;

    return (
        <button
            type={type}
            className={buttonClass}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? 'Загрузка...' : children}
        </button>
    );
};

export default Button;