import { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { ACCENT } from '../constants';
import { Card, CardHeader, MiniStat } from './ui';
import CircularProgress from './CircularProgress';

export default function WeeklyDeficitCard({ metrics, weeklyTarget, onSaveTarget }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(weeklyTarget);

    const handleSave = () => {
        onSaveTarget(draft);
        setEditing(false);
    };

    return (
        <Card>
            <CardHeader
                tag="Week.Current"
                title="Weekly Deficit"
                right={
                    editing ? (
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                className="w-20 px-2 py-1 bg-black border border-white/20 rounded text-xs font-mono text-right focus:outline-none focus:border-orange-500"
                                autoFocus
                            />
                            <button onClick={handleSave} className="text-xs px-2 py-1 bg-orange-500 text-black rounded font-bold">OK</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setEditing(true); setDraft(weeklyTarget); }}
                            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 hover:text-white font-mono transition-colors"
                        >
                            <Edit3 className="w-3 h-3" />
                            Target: {weeklyTarget.toLocaleString()}
                        </button>
                    )
                }
            />
            <div className="flex items-center gap-6 mt-4">
                <CircularProgress
                    value={metrics.weekDeficit}
                    max={weeklyTarget}
                    size={140}
                    stroke={8}
                    color={ACCENT}
                    label={`${Math.round(metrics.weekPct * 100)}%`}
                    sublabel="this week"
                />
                <div className="flex-1 space-y-3 min-w-0">
                    <MiniStat label="Logged" value={metrics.weekDeficit.toLocaleString()} unit="kcal" />
                    <MiniStat label="Days" value={`${metrics.weekDaysLogged}/7`} />
                    <MiniStat label="Avg/day" value={Math.round(metrics.avgDaily)} unit="kcal" />
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${metrics.weekPct * 100}%`, background: `linear-gradient(90deg, ${ACCENT}, #fbbf24)` }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}
