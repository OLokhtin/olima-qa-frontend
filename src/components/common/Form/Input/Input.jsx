import React from 'react';
import './Input.css';

const Input = ({
                   label,
                   type = 'text',
                   name,
                   value,
                   onChange,
                   error,
                   placeholder,
                   disabled = false,
                   required = false,
                   rows = 3,
                   ...props
               }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const inputClass = `input ${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''}`;

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="form-group__label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}

            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClass}
                    rows={rows}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClass}
                    {...props}
                />
            )}

            {error && <span className="form-group__error">{error}</span>}
        </div>
    );
};

export default Input;