import React from "react";
import PropTypes from "prop-types";

const TextArea = ({
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
    const defaultinputClasses = `border border-gray-200 px-3 py-8 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm focus:outline-none focus:border-gray-200 w-full ease-linear transition-all duration-150" ${invalid ? "border-red-500" : "border-gray-200"
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
            <textarea
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

TextArea.propTypes = {
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

export default TextArea;