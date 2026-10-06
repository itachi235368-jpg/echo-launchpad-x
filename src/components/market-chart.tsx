import { chartPoints } from "@/lib/demo-data";

export function MarketChart({ compact = false }: { compact?: boolean }) {
  const width = 720;
  const height = compact ? 84 : 190;
  const max = Math.max(...chartPoints);
  const min = Math.min(...chartPoints);
  const points = chartPoints.map((value, index) => {
    const x = (index / (chartPoints.length - 1)) * width;
    const y = height - ((value - min) / (max - min)) * (height - 12) - 6;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative w-full overflow-hidden" style={{ height }} aria-label="Token price trend chart">
      <div className="chart-grid absolute inset-0" />
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 size-full" role="img">
        <defs>
          <linearGradient id={`fill-${compact}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity=".28" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#fill-${compact})`} />
        <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}