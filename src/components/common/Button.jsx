import "./Button.css";

/**
 * Reusable Button.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
 * size: 'sm' | 'md' | 'lg'
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="btn__icon" />}
          <span>{children}</span>
          {Icon && iconPosition === "right" && <Icon className="btn__icon" />}
        </>
      )}
    </button>
  );
};

export default Button;
