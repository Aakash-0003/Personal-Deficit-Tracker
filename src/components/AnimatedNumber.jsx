import { useState, useEffect, useRef } from 'react';

export default function AnimatedNumber({ value, decimals = 0, duration = 600 }) {
    const [display, setDisplay] = useState(value);
    const prevValue = useRef(value);
    const rafRef = useRef();

    useEffect(() => {
        const start = prevValue.current;
        const end = value;
        const startTime = performance.now();
        const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(start + (end - start) * eased);
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
            else prevValue.current = end;
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [value, duration]);

    return <>{display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}
