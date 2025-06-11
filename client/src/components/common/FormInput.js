import React from 'react';
import PropTypes from 'prop-types';

function FormInput({ 
    label, 
    type, 
    name, 
    value, 
    onChange, 
    error,
    disabled,
    onClick,
    onEnter,
    width,
    limit,
    ref }) {

    const changeInput = e => {
        if(!limit || e.target.value.length <= limit) 
            onChange(e)
    }

    const execOnEnter = e => {
        if(onEnter && e.key === "Enter" && 
            value && value !== '') {
            onEnter()
        }
    } 

    return (
        <div 
        className={error ? "form-text-input error" : "form-text-input"}
        onClick={onClick}>
            <input
            type={type || "text"}
            className="text-input"
            placeholder=" "
            name={name || ''} 
            id={name || ''}
            value={value || ''}
            onChange={e => changeInput(e)}
            disabled={disabled || false}
            style={width && {width: width}}
            onKeyPress={e => execOnEnter(e)}
            ref={ref}
            />
            <label for={name || ''} className="label">{label}</label>
            {error &&
                <p className="error">{error}</p>
            }
        </div>
    )
}

FormInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    error: PropTypes.string
}

export default FormInput
