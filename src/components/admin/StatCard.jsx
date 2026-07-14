import "./StatCard.css";

const StatCard = ({ icon: Icon, label, value, tone = "primary" }) => (
  <div className="stat-card">
    <div className={`stat-card__icon stat-card__icon--${tone}`}>
      <Icon />
    </div>
    <div>
      <span className="stat-card__value mono">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </div>
);

export default StatCard;
