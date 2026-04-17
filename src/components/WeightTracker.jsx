import { useState } from 'react';
import { Scale, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ACCENT } from '../constants';
import { todayISO, formatDate } from '../utils';
import { Card } from './ui';

export default function WeightTracker({ weights, metrics, onLogWeight, onDeleteWeight }) {
    const [weightInput, setWeightInput] = useState('');
    const [weightDate, setWeightDate] = useState(todayISO());
    const [showHistory, setShowHistory] = useState(false);

    const handleLog = () => {
        const val = parseFloat(weightInput);
        if (isNaN(val) || val <= 0) return;
        onLogWeight(weightDate, val);
        setWeightInput('');
        setWeightDate(todayISO());
    };

    const { startWeight, latestWeight, actualKgLost, weightChartData } = metrics;

    return (
        <section className="mb-8">
            <Card>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">// Weight.Log</div>
                        <div className="text-base font-black tracking-tight mt-0.5">Reality Check</div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                        {startWeight && (
                            <div className="text-white/60">
                                <span className="text-white/40 uppercase tracking-wider">Start</span>{' '}
                                <span className="font-bold text-white">{startWeight.toFixed(1)}kg</span>
                            </div>
                        )}
                        {latestWeight && (
                            <div className="text-white/60">
                                <span className="text-white/40 uppercase tracking-wider">Now</span>{' '}
                                <span className="font-bold text-white">{latestWeight.toFixed(1)}kg</span>
                            </div>
                        )}
                        {actualKgLost > 0 && (
                            <div className="text-green-400 font-bold">−{actualKgLost.toFixed(2)}kg</div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input
                        type="date"
                        value={weightDate}
                        onChange={(e) => setWeightDate(e.target.value)}
                        className="px-3 py-2.5 bg-black border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-500 [color-scheme:dark]"
                    />
                    <input
                        type="number"
                        step="0.1"
                        placeholder="weight in kg (optional, whenever you weigh)"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLog()}
                        className="flex-1 px-3 py-2.5 bg-black border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-500 placeholder:text-white/30"
                    />
                    <button
                        onClick={handleLog}
                        disabled={!weightInput}
                        className="px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 transition-all disabled:opacity-40"
                    >
                        <Scale className="w-3.5 h-3.5" />
                        Log weight
                    </button>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="px-3 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-mono text-white/50 hover:text-white border border-white/10"
                    >
                        {showHistory ? '−' : '+'} Log ({Object.keys(weights || {}).length})
                    </button>
                </div>

                {showHistory && Object.keys(weights || {}).length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto border-t border-white/10 pt-3 grid grid-cols-2 sm:grid-cols-3 gap-1">
                        {Object.entries(weights || {}).sort(([a], [b]) => b.localeCompare(a)).map(([date, val]) => (
                            <div key={date} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 text-xs font-mono group">
                                <span className="text-white/60">{formatDate(date)}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{Number(val).toFixed(1)}kg</span>
                                    <button onClick={() => onDeleteWeight(date)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {weightChartData.length >= 2 && (
                    <div className="mt-5">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mb-2">Actual vs Predicted</div>
                        <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 12 }}
                                        labelStyle={{ color: ACCENT, fontFamily: 'monospace', fontSize: 11 }}
                                        formatter={(value, name) => [`${Number(value).toFixed(2)}kg`, name === 'weight' ? 'Actual' : 'Predicted']}
                                    />
                                    <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                                    <Line type="monotone" dataKey="weight" stroke={ACCENT} strokeWidth={2.5} dot={{ fill: ACCENT, r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-4 mt-2 text-[10px] font-mono text-white/50 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5" style={{ background: ACCENT }} /> Actual</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-t border-dashed border-white/50" /> Predicted (from deficit)</span>
                        </div>
                    </div>
                )}

                {Object.keys(weights || {}).length === 0 && (
                    <div className="mt-3 text-[11px] text-white/40 font-mono text-center py-3">
                        Log whenever you weigh in — weekly, biweekly, whatever. Not required daily.
                    </div>
                )}
            </Card>
        </section>
    );
}
