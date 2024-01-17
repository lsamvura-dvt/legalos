import React from "react";
import PropTypes from "prop-types";

const Button = ({
  buttonText,
  id,
  name,
  type,
  disabled,
  onClick,
  className,
  icon,
}) => {
  const defaultButtonClasses =
    "bg-blue-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150";
  const buttonClasses = className
    ? `${defaultButtonClasses} ${className}`
    : defaultButtonClasses;

  return (
    <button
      className={buttonClasses}
      id={id}
      name={name}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{buttonText}</span>
    </button>
  );
};

Button.propTypes = {
  buttonText: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.node,
};

export default Button;