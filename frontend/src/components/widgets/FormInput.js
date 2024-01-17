import React from "react";
import PropTypes from "prop-types";

const FormInput = ({
    title,
    id,
    value,
    name,
    placeholder,
    type,
    invalid,
    disabled,
    required,
    InvalidText,
    onChange,
    className
}) => {
    const defaultinputClasses = `border border-gray-200 rounded-md px-3 py-3 placeholder-blueGray-300 text-gray-800 bg-white rounded text-sm focus:border-gray-200 focus:outline-none w-full ${invalid ? "border-red-500" : "border-gray-200"
        }`;
    const inputClasses = className
        ? `${defaultinputClasses} ${className}`
        : defaultinputClasses;
    return (
        <div className="relative w-full">

            <label
                className="block uppercase text-gray-800 text-xs font-semibold mb-2"
            >
                {title}
            </label>
            <input
                className={inputClasses}
                id={id}
                value={value}
                name={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                onChange={onChange}
            />

            {invalid && (
                <p className="text-red-500 text-sm mt-1 ml-2">{InvalidText}</p>
            )}
        </div>
    );
};

FormInput.propTypes = {
    title: PropTypes.string,
    InvalidText: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
};

export default FormInput;