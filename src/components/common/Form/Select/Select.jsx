import React from 'react';
import './Select.css';

const Select = ({
                    label,
                    name,
                    value,
                    onChange,
                    options,
                    error,
                    disabled = false,
                    required = false,
                    ...props
                }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const selectClass = `select ${error ? 'select--error' : ''} ${disabled ? 'select--disabled' : ''}`;

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="form-group__label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}

            <select
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={selectClass}
                {...props}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <span className="form-group__error">{error}</span>}
        </div>
    );
};

export default Select;