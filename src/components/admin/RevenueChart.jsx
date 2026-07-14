import "./RevenueChart.css";

const RevenueChart = ({ data = {} }) => {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return <p className="text-soft">No revenue data yet.</p>;
  }

  return (
    <div className="revenue-chart">
      {entries.map(([month, value]) => (
        <div key={month} className="revenue-chart__bar-wrap">
          <span className="revenue-chart__value mono">₹{Math.round(value / 1000)}k</span>
          <div className="revenue-chart__track">
            <div
              className="revenue-chart__bar"
              style={{ height: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="revenue-chart__label">{month}</span>
        </div>
      ))}
    </div>
  );
};

export default RevenueChart;
