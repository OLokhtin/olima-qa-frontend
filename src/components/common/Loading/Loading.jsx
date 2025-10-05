import React from 'react';
import './Loading.css';

const Loading = ({ message = 'Загрузка...' }) => {
    return (
        <div className="loading">
            <div className="loading__spinner"></div>
            <div className="loading__message">{message}</div>
        </div>
    );
};

export default Loading;