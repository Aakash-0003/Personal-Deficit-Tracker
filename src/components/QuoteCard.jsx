import { useState, useEffect } from 'react';
import { QUOTES, ACCENT } from '../constants';
import { Card } from './ui';

export default function QuoteCard() {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        const seed = new Date().getDate() + new Date().getMonth() * 31;
        setQuote(QUOTES[seed % QUOTES.length]);
    }, []);

    return (
        <section className="mb-8">
            <Card className="relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-60 h-60 pointer-events-none opacity-25 blur-3xl" style={{ background: ACCENT }} />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 pointer-events-none opacity-15 blur-3xl" style={{ background: '#dc2626' }} />
                <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">// Signal.Daily</div>
                        <div className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-mono hidden sm:block">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-black leading-tight mb-3" style={{ letterSpacing: '-0.02em' }}>
                        "{quote.text}"
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-orange-400 uppercase tracking-[0.2em] font-bold">— {quote.author}</div>
                </div>
            </Card>
        </section>
    );
}
