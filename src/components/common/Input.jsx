import { useId } from "react";
import "./Input.css";

const Input = ({
  label,
  error,
  icon: Icon,
  type = "text",
  className = "",
  containerClassName = "",
  ...rest
}) => {
  const id = useId();

  return (
    <div className={`field ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      )}
      <div className={`field__control ${error ? "field__control--error" : ""}`}>
        {Icon && <Icon className="field__icon" />}
        <input id={id} type={type} className={`field__input ${className}`} {...rest} />
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
};

export default Input;
