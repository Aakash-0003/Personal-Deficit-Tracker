import { BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { ACCENT, GREEN, TOTAL_TARGET_KCAL } from '../constants';
import { Card, CardHeader } from './ui';

const tooltipStyle = {
    contentStyle: { background: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: ACCENT, fontFamily: 'monospace', fontSize: 11 },
};

export default function ChartsSection({ chartData, weeklyData, weeklyTarget }) {
    if (!chartData.length) return null;

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Card>
                <CardHeader tag="Chart.Cumulative" title="Progress Curve" right={<BarChart3 className="w-4 h-4 text-white/40" />} />
                <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                            <Tooltip {...tooltipStyle} />
                            <ReferenceLine y={TOTAL_TARGET_KCAL} stroke={GREEN} strokeDasharray="3 3" label={{ value: 'GOAL', fill: GREEN, fontSize: 10 }} />
                            <Line
                                type="monotone"
                                dataKey="cumulative"
                                stroke={ACCENT}
                                strokeWidth={2.5}
                                dot={{ fill: ACCENT, r: 3 }}
                                activeDot={{ r: 6, fill: '#fbbf24' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <CardHeader
                    tag="Chart.Weekly"
                    title="Weekly Output"
                    right={<span className="text-[10px] font-mono text-white/40">Target: {weeklyTarget}</span>}
                />
                <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                            <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }} />
                            <ReferenceLine y={weeklyTarget} stroke={GREEN} strokeDasharray="3 3" />
                            <Bar dataKey="deficit" fill={ACCENT} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </section>
    );
}
