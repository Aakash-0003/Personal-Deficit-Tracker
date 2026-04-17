import { Flame, Bell, BellOff, Download, Upload } from 'lucide-react';
import { ACCENT } from '../constants';

export default function Header({ notifications, onToggleNotifications, onExport, onImport }) {
    return (
        <header className="flex items-center justify-between mb-8 sm:mb-12">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${ACCENT}, #dc2626)` }}>
                    <Flame className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono">Protocol.01</div>
                    <h1 className="text-lg sm:text-xl font-black tracking-tight">DEFICIT/TRACKER</h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="application/json"
                    onChange={onImport}
                    className="hidden"
                    id="import-file"
                />
                <label
                    htmlFor="import-file"
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    title="Import data"
                >
                    <Upload className="w-3.5 h-3.5" />
                </label>
                <button
                    onClick={onExport}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-wider font-semibold"
                    title="Export data as JSON"
                >
                    <Download className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={onToggleNotifications}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-wider font-semibold"
                >
                    {notifications
                        ? <Bell className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                        : <BellOff className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{notifications ? 'On' : 'Alerts'}</span>
                </button>
            </div>
        </header>
    );
}
