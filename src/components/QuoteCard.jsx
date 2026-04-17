import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { QUOTES, ACCENT } from '../constants';
import { Card } from './ui';

export default function QuoteCard() {
    const [index, setIndex] = useState(() => {
        const seed = new Date().getDate() + new Date().getMonth() * 31;
        return seed % QUOTES.length;
    });

    const next = () => setIndex((i) => (i + 1) % QUOTES.length);

    const quote = QUOTES[index];

    const len = quote.text.length;
    const textSize =
        len < 120 ? 'text-xl sm:text-2xl md:text-3xl leading-tight' :
        len < 220 ? 'text-lg sm:text-xl md:text-2xl leading-snug' :
                    'text-sm sm:text-base md:text-lg leading-relaxed';

    return (
        <section className="mb-8">
            <Card className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-60 h-60 pointer-events-none opacity-25 blur-3xl" style={{ background: ACCENT }} />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 pointer-events-none opacity-15 blur-3xl" style={{ background: '#dc2626' }} />
                <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">// Signal.Daily</div>
                        <div className="flex items-center gap-3">
                            <div className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-mono hidden sm:block">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                            <button
                                onClick={next}
                                title="Next quote"
                                className="p-1.5 rounded-md text-white/30 hover:text-white/80 hover:bg-white/10 transition-all active:scale-90"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    <div className={`${textSize} font-bold mb-3`} style={{ letterSpacing: '-0.01em' }}>
                        "{quote.text}"
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-orange-400 uppercase tracking-[0.2em] font-bold">— {quote.author}</div>
                </div>
            </Card>
        </section>
    );
}
