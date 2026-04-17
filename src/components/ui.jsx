export const Card = ({ children, className = '' }) => (
    <div className={`relative bg-neutral-900/80 border border-white/15 rounded-2xl p-5 backdrop-blur-sm shadow-xl ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ tag, title, right }) => (
    <div className="flex items-center justify-between">
        <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">// {tag}</div>
            <div className="text-base font-black tracking-tight mt-0.5">{title}</div>
        </div>
        {right}
    </div>
);

export const StatTile = ({ label, value, color }) => (
    <div className="bg-neutral-900/80 border border-white/15 rounded-xl p-3">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono mb-1">{label}</div>
        <div className="text-xl sm:text-2xl font-black tabular-nums tracking-tight" style={color ? { color } : {}}>
            {value}
        </div>
    </div>
);

export const MiniStat = ({ label, value, unit }) => (
    <div className="flex items-baseline justify-between border-b border-white/5 pb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">{label}</span>
        <span className="font-mono font-bold tabular-nums">
            {value}
            {unit && <span className="text-white/40 text-xs ml-1">{unit}</span>}
        </span>
    </div>
);

export const MilestoneRow = ({ icon, label, value, progress, color }) => (
    <div>
        <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs text-white/70">
                <span style={{ color }}>{icon}</span>
                <span className="font-mono uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress * 100}%`, background: color }} />
        </div>
    </div>
);

export const ProjectionCard = ({ icon, label, value, unit, accent }) => (
    <div className="bg-neutral-900/80 border border-white/15 rounded-xl p-4 hover:border-white/30 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-white/50" style={accent ? { color: accent } : {}}>
            {icon}
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono">{label}</span>
        </div>
        <div className="text-2xl font-black tabular-nums tracking-tight">
            {value}
            <span className="text-xs font-mono text-white/50 ml-1.5 font-normal">{unit}</span>
        </div>
    </div>
);

export const ReviewStat = ({ label, value, unit, highlight }) => (
    <div className="bg-black/30 border border-white/10 rounded-lg p-3">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono mb-1">{label}</div>
        <div className={`text-lg sm:text-xl font-black tabular-nums tracking-tight ${highlight ? 'text-orange-400' : 'text-white'}`}>
            {value}
            {unit && <span className="text-[10px] font-mono text-white/50 ml-1 font-normal">{unit}</span>}
        </div>
    </div>
);
