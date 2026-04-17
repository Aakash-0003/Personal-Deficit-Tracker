import { useState } from 'react';
import { Flame, Plus, Zap, Trash2 } from 'lucide-react';
import { ACCENT } from '../constants';
import { todayISO, formatDate } from '../utils';
import { Card, CardHeader } from './ui';

export default function DeficitInputCard({ entries, streak, totalDaysLogged, onLog, onDelete }) {
    const [inputValue, setInputValue] = useState('');
    const [inputDate, setInputDate] = useState(todayISO());
    const [showHistory, setShowHistory] = useState(false);
    const [justLogged, setJustLogged] = useState(false);

    const handleLog = () => {
        const val = parseInt(inputValue, 10);
        if (isNaN(val) || val === 0) return;
        onLog(inputDate, val);
        setInputValue('');
        setInputDate(todayISO());
        setJustLogged(true);
        setTimeout(() => setJustLogged(false), 1200);
    };

    return (
        <Card>
            <CardHeader tag="Input.Daily" title="Log Today" />
            <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="px-3 py-3 bg-black border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-500 [color-scheme:dark]"
                    />
                    <input
                        type="number"
                        placeholder="kcal deficit"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLog()}
                        className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-lg font-bold font-mono focus:outline-none focus:border-orange-500 placeholder:text-white/20"
                    />
                </div>
                <button
                    onClick={handleLog}
                    disabled={!inputValue}
                    className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${
                        justLogged
                            ? 'bg-green-500 text-black scale-[0.98]'
                            : 'bg-orange-500 text-black hover:bg-orange-400 active:scale-[0.98] disabled:bg-white/10 disabled:text-white/30'
                    }`}
                    style={{ boxShadow: inputValue ? `0 0 30px ${ACCENT}66` : 'none' }}
                >
                    {justLogged ? <><Zap className="w-4 h-4" /> Locked in</> : <><Plus className="w-4 h-4" /> Commit deficit</>}
                </button>
                <div className="flex items-center justify-between pt-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-400 font-mono font-bold text-xs">
                        <Flame className="w-3 h-3" />
                        {streak} day streak
                    </span>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-[10px] uppercase tracking-wider text-white/40 hover:text-white font-mono"
                    >
                        {showHistory ? '− Hide' : '+ History'} ({totalDaysLogged})
                    </button>
                </div>
            </div>

            {showHistory && (
                <div className="mt-3 max-h-48 overflow-y-auto border-t border-white/10 pt-3 space-y-1">
                    {Object.entries(entries).sort(([a], [b]) => b.localeCompare(a)).map(([date, val]) => (
                        <div key={date} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/5 text-sm font-mono group">
                            <span className="text-white/60">{formatDate(date)}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-orange-400 font-bold">{Number(val).toLocaleString()}</span>
                                <button onClick={() => onDelete(date)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {Object.keys(entries).length === 0 && (
                        <div className="text-center text-white/30 text-xs py-4 font-mono">No entries yet</div>
                    )}
                </div>
            )}
        </Card>
    );
}
