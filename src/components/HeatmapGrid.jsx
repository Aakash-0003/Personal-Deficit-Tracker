import { Grid3x3 } from 'lucide-react';
import { Card, CardHeader } from './ui';

export default function HeatmapGrid({ heatmapData }) {
    return (
        <section className="mb-8">
            <Card>
                <CardHeader
                    tag="Heatmap.16Weeks"
                    title="Consistency Grid"
                    right={<Grid3x3 className="w-4 h-4 text-white/40" />}
                />
                <div className="mt-4 overflow-x-auto -mx-2 px-2">
                    <div className="inline-flex flex-col gap-1 min-w-full">
                        <div className="flex gap-1">
                            <div className="w-8 text-[9px] font-mono text-white/30" />
                            {heatmapData.map((_, i) => (
                                <div key={i} className="w-3.5 sm:w-4 text-center text-[8px] font-mono text-white/20">
                                    {i % 4 === 0 ? `W${i + 1}` : ''}
                                </div>
                            ))}
                        </div>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayLabel, dayIdx) => (
                            <div key={dayIdx} className="flex gap-1 items-center">
                                <div className="w-8 text-[9px] font-mono text-white/30 uppercase">{dayLabel}</div>
                                {heatmapData.map((week, weekIdx) => {
                                    const cell = week[dayIdx];
                                    const def = cell.deficit;
                                    let bg = 'rgba(255,255,255,0.04)';
                                    let border = 'rgba(255,255,255,0.06)';
                                    let title = `${cell.date}: no entry`;
                                    if (cell.isFuture) {
                                        bg = 'rgba(255,255,255,0.02)';
                                    } else if (def >= 1000) {
                                        bg = '#f97316';
                                        border = '#fbbf24';
                                        title = `${cell.date}: ${def} kcal — HIGH HEAT 🔥`;
                                    } else if (def >= 800) {
                                        bg = '#ea580c';
                                        title = `${cell.date}: ${def} kcal — strong`;
                                    } else if (def >= 600) {
                                        bg = '#9a3412';
                                        title = `${cell.date}: ${def} kcal — moderate`;
                                    } else if (def > 0) {
                                        bg = '#451a03';
                                        title = `${cell.date}: ${def} kcal — light`;
                                    }
                                    return (
                                        <div
                                            key={weekIdx}
                                            title={title}
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-all hover:ring-1 hover:ring-white/40 hover:scale-125"
                                            style={{ background: bg, border: `1px solid ${border}` }}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Last 16 weeks · hover for detail</div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/50">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                            <div className="w-3 h-3 rounded-sm" style={{ background: '#451a03' }} title="<600 kcal" />
                            <div className="w-3 h-3 rounded-sm" style={{ background: '#9a3412' }} title="600-800" />
                            <div className="w-3 h-3 rounded-sm" style={{ background: '#ea580c' }} title="800-1000" />
                            <div className="w-3 h-3 rounded-sm" style={{ background: '#f97316', border: '1px solid #fbbf24' }} title="1000+" />
                        </div>
                        <span>More heat</span>
                    </div>
                </div>
            </Card>
        </section>
    );
}
