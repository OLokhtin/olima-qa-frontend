import React from 'react';
import './Modal.css';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   size = 'medium',
                   className = ''
               }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal modal--${size} ${className}`}>
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <button className="modal__close" onClick={onClose}>×</button>
                </div>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;