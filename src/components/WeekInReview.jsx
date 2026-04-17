import { Trophy } from 'lucide-react';
import { ACCENT } from '../constants';
import { formatDate } from '../utils';
import { ReviewStat } from './ui';

export default function WeekInReview({ completedWeeks, onDismiss }) {
    if (!completedWeeks.length) return null;

    return (
        <section className="mb-8">
            {completedWeeks.slice(-1).map((wk) => {
                const pct = wk.target > 0 ? wk.total / wk.target : 0;
                const hitTarget = wk.total >= wk.target;
                return (
                    <div
                        key={wk.weekStart}
                        className="relative bg-gradient-to-br from-orange-500/10 via-neutral-900/90 to-neutral-900/90 border-2 border-orange-500/40 rounded-2xl p-5 overflow-hidden"
                    >
                        <div className="absolute -top-8 -right-8 w-40 h-40 pointer-events-none opacity-30 blur-3xl" style={{ background: ACCENT }} />
                        <div className="relative">
                            <div className="flex items-start justify-between mb-3 gap-3">
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-mono mb-1" style={{ color: ACCENT }}>
                                        <Trophy className="w-3 h-3" />
                                        Week.Complete
                                    </div>
                                    <div className="text-xl sm:text-2xl font-black tracking-tight">
                                        Week of {formatDate(wk.weekStart)} — {hitTarget ? 'Target Smashed 🔥' : 'Wrapped'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDismiss(wk.weekStart)}
                                    className="text-[10px] uppercase tracking-wider text-white/50 hover:text-white font-mono px-2 py-1 border border-white/10 rounded"
                                >
                                    Dismiss
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                <ReviewStat label="Total" value={wk.total.toLocaleString()} unit="kcal" />
                                <ReviewStat label="Target" value={wk.target.toLocaleString()} unit="kcal" />
                                <ReviewStat label="Days logged" value={`${wk.days}/7`} />
                                <ReviewStat label="Fat burned" value={wk.fatLossKg.toFixed(2)} unit="kg" highlight />
                            </div>
                            <div className="mt-4">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(100, pct * 100)}%`,
                                            background: hitTarget
                                                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                                                : `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
                                        }}
                                    />
                                </div>
                                <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mt-2">
                                    {Math.round(pct * 100)}% of weekly target
                                    {completedWeeks.length > 1 && ` · ${completedWeeks.length - 1} more week(s) pending`}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
