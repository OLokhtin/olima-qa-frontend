import React from 'react';
import './Filter.css';

const Filter = ({
                    label,
                    options,
                    value,
                    onChange,
                    placeholder = "Выберите значение",
                    className = ''
                }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className={`filter ${className}`}>
            {label && <label className="filter__label">{label}</label>}
            <select
                value={value}
                onChange={handleChange}
                className="filter__select"
            >
                <option value="">{placeholder}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Filter;