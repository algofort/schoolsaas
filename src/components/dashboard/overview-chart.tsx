export function OverviewChart() {
  return (
    <div className="overview-chart">
      <div className="chart-scale">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
      </div>
      <svg
        role="img"
        aria-label="Sample trend: attendance rises from April to September, with fee collection following a similar upward trend"
        viewBox="0 0 600 205"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="attendance-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4d44b5" stopOpacity=".15" />
            <stop offset="100%" stopColor="#4d44b5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 70, 120, 170].map((y) => (
          <line key={y} x1="0" x2="600" y1={y} y2={y} className="chart-grid" />
        ))}
        <path
          d="M0 112 C40 112 55 35 110 48 S185 140 225 95 S300 15 345 42 S420 94 460 53 S540 6 600 24 L600 205 L0 205Z"
          fill="url(#attendance-fill)"
        />
        <path
          d="M0 112 C40 112 55 35 110 48 S185 140 225 95 S300 15 345 42 S420 94 460 53 S540 6 600 24"
          fill="none"
          stroke="#4d44b5"
          strokeWidth="3.5"
        />
        <path
          d="M0 151 C55 151 60 108 110 118 S180 155 225 132 S302 58 345 80 S421 124 460 101 S545 50 600 65"
          fill="none"
          stroke="#fb7d5b"
          strokeWidth="3"
          strokeDasharray="7 6"
        />
      </svg>
      <div className="chart-months">
        {["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}
