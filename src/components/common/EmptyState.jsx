import Button from "./Button";
import "./EmptyState.css";

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => (
  <div className="empty-state fade-in">
    {Icon && (
      <div className="empty-state__icon">
        <Icon />
      </div>
    )}
    <h3>{title}</h3>
    {message && <p>{message}</p>}
    {actionLabel && onAction && (
      <Button onClick={onAction} variant="primary">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
