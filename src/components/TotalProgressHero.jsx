import { ACCENT, GREEN, RED, TOTAL_TARGET_KCAL } from '../constants';
import AnimatedNumber from './AnimatedNumber';
import { StatTile } from './ui';

export default function TotalProgressHero({ metrics }) {
    const { totalDeficit, fatLostKg, remaining, pctTotal, deltaDays } = metrics;

    return (
        <section className="mb-8 sm:mb-12">
            <div className="flex items-baseline justify-between mb-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">// Mission — 8kg Fat Loss</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: deltaDays >= 0 ? GREEN : RED }}>
                    {deltaDays >= 0 ? '▲ ' : '▼ '}{Math.abs(deltaDays)} days {deltaDays >= 0 ? 'ahead' : 'behind'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center">
                <div>
                    <div className="flex items-baseline gap-3 mb-1">
                        <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter tabular-nums leading-none" style={{ letterSpacing: '-0.05em' }}>
                            <AnimatedNumber value={totalDeficit} />
                        </div>
                        <div className="text-sm font-mono text-white/40 uppercase tracking-widest">kcal</div>
                    </div>
                    <div className="text-sm text-white/50 font-mono mb-5">
                        of <span className="text-white/80">{TOTAL_TARGET_KCAL.toLocaleString()}</span> total target
                    </div>

                    <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                        <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${pctTotal * 100}%`,
                                background: `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
                                boxShadow: `0 0 20px ${ACCENT}88`,
                            }}
                        />
                        {[0.25, 0.5, 0.75].map((t) => (
                            <div key={t} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${t * 100}%` }} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30 uppercase tracking-wider">
                        <span>0kg</span><span>2kg</span><span>4kg</span><span>6kg</span><span>8kg</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[180px]">
                    <StatTile
                        label="Fat burned"
                        value={<><AnimatedNumber value={fatLostKg} decimals={2} /><span className="text-lg font-mono text-white/40 ml-1">kg</span></>}
                        color={ACCENT}
                    />
                    <StatTile
                        label="Remaining"
                        value={<><AnimatedNumber value={remaining} /><span className="text-xs font-mono text-white/40 ml-1">kcal</span></>}
                    />
                    <StatTile
                        label="Complete"
                        value={<><AnimatedNumber value={pctTotal * 100} decimals={1} /><span className="text-lg font-mono text-white/40">%</span></>}
                    />
                </div>
            </div>
        </section>
    );
}
