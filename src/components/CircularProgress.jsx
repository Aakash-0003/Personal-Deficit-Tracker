export default function CircularProgress({ value, max, size = 160, stroke = 10, color = '#f97316', label, sublabel }) {
    const radius = (size - stroke) / 2;
    const circ = 2 * Math.PI * radius;
    const pct = Math.max(0, Math.min(1, value / max));
    const offset = circ * (1 - pct);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth={stroke} fill="none"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${color}99)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-black tabular-nums text-white tracking-tight">{label}</div>
                {sublabel && <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">{sublabel}</div>}
            </div>
        </div>
    );
}
