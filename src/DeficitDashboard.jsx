import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Flame, TrendingUp, Calendar, Target, Zap, Award, Plus, BarChart3, Trash2, Edit3, Bell, BellOff, Scale, Download, Upload, Trophy, Grid3x3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';

// ----- constants -----
const KCAL_PER_KG = 7500;
const TOTAL_TARGET_KCAL = 60000;
const TOTAL_TARGET_KG = 8;
const DEFAULT_WEEKLY = 6000;

const QUOTES = [
    { text: "Discipline equals freedom.", author: "Jocko Willink" },
    { text: "The only way out is through.", author: "David Goggins" },
    { text: "Stay hard.", author: "David Goggins" },
    { text: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.", author: "David Goggins" },
    { text: "Self-discipline is the ultimate form of self-love.", author: "Alex Hormozi" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
    { text: "Talent you have naturally. Skill is only developed by hours and hours of work.", author: "Usain Bolt" },
    { text: "I've failed over and over and over again. And that is why I succeed.", author: "Michael Jordan" },
    { text: "Some people want it to happen, some wish it would happen, others make it happen.", author: "Michael Jordan" },
    { text: "Self-belief and hard work will always earn you success.", author: "Virat Kohli" },
    { text: "Nothing comes easy. Work hard for it.", author: "Virat Kohli" },
    { text: "You can't put a limit on anything. The more you dream, the further you get.", author: "Michael Phelps" },
    { text: "If you want to be the best, you have to do things that other people aren't willing to do.", author: "Michael Phelps" },
    { text: "The less you talk, the more you're listened to.", author: "Tom Brady" },
    { text: "You have a right to perform your duty, but not to the fruits of action.", author: "Krishna, Bhagavad Gita" },
    { text: "Perform your obligatory duty, because action is indeed better than inaction.", author: "Krishna, Bhagavad Gita" },
    { text: "The mind is restless, but it can be controlled by practice and detachment.", author: "Krishna, Bhagavad Gita" },
    { text: "A man is made by his beliefs. As he believes, so he is.", author: "Krishna, Bhagavad Gita" },
    { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "Volume negates luck.", author: "Alex Hormozi" },
    { text: "Boring consistency beats exciting inconsistency.", author: "Alex Hormozi" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
    { text: "You must build callouses on your mind just like you build them on your hands.", author: "David Goggins" },
    { text: "The most important conversation you’ll ever have is the one you have with yourself.", author: "David Goggins" },
    { text: "When you think that you are done, you're only 40% into what your body's capable of doing.", author: "David Goggins" },
    { text: "Go get after it.", author: "Jocko Willink" },
    { text: "Extreme ownership. Leaders must own everything in their world. There is no one else to blame.", author: "Jocko Willink" },
    { text: "Don't count on motivation. Count on discipline.", author: "Jocko Willink" },
    { text: "If you want to be tougher, be tougher.", author: "Jocko Willink" },
    { text: "You don't need more time. You need more focus.", author: "Alex Hormozi" },
    { text: "The person who can sit in a room for 10 years and do the boring thing wins.", author: "Alex Hormozi" },
    { text: "You don't become confident by shouting affirmations. You become confident by a stack of undeniable proof.", author: "Alex Hormozi" },
    { text: "Work like there is someone working 24 hours a day to take it away from you.", author: "Mark Cuban" },
    { text: "I don't play for 90 minutes. I play until I win.", author: "Cristiano Ronaldo" },
    { text: "Your love makes me strong. Your hate makes me unstoppable.", author: "Cristiano Ronaldo" },
    { text: "Dedication, hard work all the time, and belief.", author: "Cristiano Ronaldo" },
    { text: "I'm not a perfectionist, but I like to feel that things are done well.", author: "Cristiano Ronaldo" },
    { text: "Maybe they hate me because I'm too good.", author: "Cristiano Ronaldo" },
    { text: "Everything negative—pressure, challenges—is all an opportunity for me to rise.", author: "Kobe Bryant" },
    { text: "Rest at the end, not in the middle.", author: "Kobe Bryant" },
    { text: "Mamba mentality is all about focusing on the process and trusting in the hard work.", author: "Kobe Bryant" },
    { text: "If you're afraid to fail, then you're probably going to fail.", author: "Kobe Bryant" },
    { text: "Obsession is natural.", author: "Kobe Bryant" },
    { text: "I can accept failure, everyone fails at something. But I can't accept not trying.", author: "Michael Jordan" },
    { text: "To be successful you have to be selfish, or else you never achieve.", author: "Michael Jordan" },
    { text: "Limits, like fears, are often just an illusion.", author: "Michael Jordan" },
    { text: "Step by step. I can't see any other way of accomplishing anything.", author: "Michael Jordan" },
    { text: "I want to be the best of all time.", author: "Virat Kohli" },
    { text: "On the field, you are a warrior. You have to give your 100%.", author: "Virat Kohli" },
    { text: "Whatever you want to do, do with full passion and work really hard towards it.", author: "Virat Kohli" },
    { text: "There are no shortcuts to success.", author: "Virat Kohli" },
    { text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'", author: "Muhammad Ali" },
    { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },
    { text: "It's lack of faith that makes people afraid of meeting challenges, and I believed in myself.", author: "Muhammad Ali" },
    { text: "If my mind can conceive it, and my heart can believe it—then I can achieve it.", author: "Muhammad Ali" },
    { text: "There is no such thing as 'natural' talent. There is only hard work.", author: "Michael Phelps" },
    { text: "I want to look back and say I did everything I could.", author: "Michael Phelps" },
    { text: "I won't predict anything historic. But I will predict that I'm going to do my best.", author: "Michael Phelps" },
    { text: "Consistency is what makes the average into the elite.", author: "Tom Brady" },
    { text: "I didn't come this far to only come this far.", author: "Tom Brady" },
    { text: "If you don't believe in yourself, why is anyone else going to believe in you?", author: "Tom Brady" },
    { text: "Too many people say 'no' to themselves before they even try.", author: "Joe Rogan" },
    { text: "Be the hero of your own movie.", author: "Joe Rogan" },
    { text: "Excellence is being able to perform at a high level over and over again.", author: "Joe Rogan" },
    { text: "One of the most fascinating things about humans is the capacity to self-correct.", author: "Joe Rogan" },
    { text: "Someone is sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
    { text: "The man who says he can and the man who says he can't are both usually right.", author: "Henry Ford" },
    { text: "Better to live your own destiny imperfectly than to live an imitation of somebody else's life with perfection.", author: "Krishna, Bhagavad Gita" },
    { text: "The soul is neither born, and nor does it die.", author: "Krishna, Bhagavad Gita" },
    { text: "Focus on your work, not the results.", author: "Krishna, Bhagavad Gita" },
    { text: "Calmness, gentleness, silence, self-restraint, and purity: these are the disciplines of the mind.", author: "Krishna, Bhagavad Gita" },
    { text: "To the mind that is still, the whole universe surrenders.", author: "Lao Tzu" },
    { text: "You are what you do, not what you say you'll do.", author: "Carl Jung" },
    { text: "Other people's opinion of you does not have to become your reality.", author: "Les Brown" },
    { text: "Shoot for the moon. Even if you miss, you'll land among the stars.", author: "Les Brown" },
    { text: "It’s not over until I win.", author: "Les Brown" },
    { text: "You must be willing to do the things today others won't do, in order to have the things tomorrow others won't have.", author: "Les Brown" },
    { text: "If you do what is easy, your life will be hard. If you do what is hard, your life will be easy.", author: "Les Brown" },
    { text: "The greatness of a man is not in how much wealth he acquires, but in his integrity.", author: "Bob Marley" },
    { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
    { text: "The more you sweat in peace, the less you bleed in war.", author: "Navy SEAL Motto" },
    { text: "Comfort is the enemy of progress.", author: "P.T. Barnum" },
    { text: "Uncommon amongst uncommon.", author: "David Goggins" },
    { text: "Don't let your ego get in the way of your progress.", author: "Jocko Willink" },
    { text: "The only person you should try to be better than is the person you were yesterday.", author: "Matty Mullins" },
    { text: "I don't stop when I'm tired. I stop when I'm done.", author: "David Goggins" },
    { text: "Winning is not a sometime thing; it's an all the time thing.", author: "Vince Lombardi" },
    { text: "Practice like you've never won. Play like you've never lost.", author: "Michael Jordan" },
    { text: "Amateurs hope. Professionals work.", author: "Unknown" },
    { text: "Show up. Every single day.", author: "Joe Rogan" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
    { text: "Work in silence. Let your success be your noise.", author: "Frank Ocean" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Hard work is a prison sentence only if it does not have a meaning.", author: "Malcolm Gladwell" },
    { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
    { text: "Great things come from hard work and perseverance. No excuses.", author: "Kobe Bryant" }
];

// ----- storage helpers -----
const STORAGE_KEY = 'deficit_dashboard_v1';

const loadState = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch { return null; }
};

const saveState = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { }
};

// ----- date utils -----
const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getWeekStart = (isoDate) => {
    const d = new Date(isoDate);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    d.setDate(d.getDate() + diff);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const daysBetween = (a, b) => {
    const d1 = new Date(a); const d2 = new Date(b);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ----- animated number -----
const AnimatedNumber = ({ value, decimals = 0, duration = 600 }) => {
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
};

// ----- circular progress -----
const CircularProgress = ({ value, max, size = 160, stroke = 10, color = '#f97316', label, sublabel }) => {
    const radius = (size - stroke) / 2;
    const circ = 2 * Math.PI * radius;
    const pct = Math.max(0, Math.min(1, value / max));
    const offset = circ * (1 - pct);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth={stroke} fill="none"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${color}99)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-black tabular-nums text-white tracking-tight">{label}</div>
                {sublabel && <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">{sublabel}</div>}
            </div>
        </div>
    );
};

// ----- main component -----
export default function DeficitDashboard() {
    const [state, setState] = useState(() => {
        const loaded = loadState();
        const base = {
            entries: {},          // { 'YYYY-MM-DD': number } — deficit in kcal
            weights: {},          // { 'YYYY-MM-DD': number } — weight in kg
            weeklyTarget: DEFAULT_WEEKLY,
            startDate: todayISO(),
            notifications: false,
            reviewedWeeks: {},    // { 'YYYY-MM-DD': true } — weeks user has dismissed review for
        };
        return loaded ? { ...base, ...loaded } : base;
    });

    const [inputValue, setInputValue] = useState('');
    const [inputDate, setInputDate] = useState(todayISO());
    const [weightInput, setWeightInput] = useState('');
    const [weightDate, setWeightDate] = useState(todayISO());
    const [showWeightHistory, setShowWeightHistory] = useState(false);
    const [editingTarget, setEditingTarget] = useState(false);
    const [targetDraft, setTargetDraft] = useState(state.weeklyTarget);
    const [quote, setQuote] = useState(QUOTES[0]);
    const [showHistory, setShowHistory] = useState(false);
    const [justLogged, setJustLogged] = useState(false);

    // persist
    useEffect(() => { saveState(state); }, [state]);

    // rotate quote daily (and on mount)
    useEffect(() => {
        const seed = new Date().getDate() + new Date().getMonth() * 31;
        setQuote(QUOTES[seed % QUOTES.length]);
    }, []);

    // ----- derived metrics -----
    const metrics = useMemo(() => {
        const entries = state.entries;
        const dates = Object.keys(entries).sort();
        const totalDeficit = Object.values(entries).reduce((s, v) => s + (Number(v) || 0), 0);
        const remaining = Math.max(0, TOTAL_TARGET_KCAL - totalDeficit);
        const fatLostKg = totalDeficit / KCAL_PER_KG;
        const pctTotal = Math.min(1, totalDeficit / TOTAL_TARGET_KCAL);

        const thisWeekStart = getWeekStart(todayISO());
        const weekEntries = Object.entries(entries).filter(([d]) => getWeekStart(d) === thisWeekStart);
        const weekDeficit = weekEntries.reduce((s, [, v]) => s + (Number(v) || 0), 0);
        const weekPct = Math.min(1, weekDeficit / state.weeklyTarget);
        const weekDaysLogged = weekEntries.length;

        // streak: count backwards from today, consecutive days with entries
        let streak = 0;
        const d = new Date(todayISO());
        while (true) {
            const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (entries[iso] && Number(entries[iso]) > 0) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else break;
        }

        // weekly average (per-day)
        const avgDaily = dates.length > 0 ? totalDeficit / dates.length : 0;
        const weeklyAvg = avgDaily * 7;

        // projected days to goal at current weekly rate
        const weeksToGoal = weeklyAvg > 0 ? remaining / weeklyAvg : Infinity;
        const daysToGoal = Math.ceil(weeksToGoal * 7);

        // ahead/behind: compare actual vs expected at target rate
        const daysSinceStart = Math.max(1, daysBetween(state.startDate, todayISO()) + 1);
        const expectedPerDay = state.weeklyTarget / 7;
        const expectedSoFar = expectedPerDay * daysSinceStart;
        const deltaKcal = totalDeficit - expectedSoFar;
        const deltaDays = expectedPerDay > 0 ? Math.round(deltaKcal / expectedPerDay) : 0;

        // milestones
        const nextKcalMilestone = Math.ceil((totalDeficit + 1) / 5000) * 5000;
        const nextKgMilestone = Math.ceil((fatLostKg + 0.0001) * 1) / 1; // next whole kg
        const kcalToNextKcal = nextKcalMilestone - totalDeficit;
        const kcalToNextKg = nextKgMilestone * KCAL_PER_KG - totalDeficit;

        // chart data (cumulative)
        let running = 0;
        const chartData = dates.map((date) => {
            running += Number(entries[date]) || 0;
            return {
                date: formatDate(date),
                fullDate: date,
                daily: Number(entries[date]) || 0,
                cumulative: running,
            };
        });

        // weekly breakdown
        const weeklyMap = {};
        Object.entries(entries).forEach(([d, v]) => {
            const ws = getWeekStart(d);
            weeklyMap[ws] = (weeklyMap[ws] || 0) + (Number(v) || 0);
        });
        const weeklyData = Object.entries(weeklyMap).sort().map(([ws, v]) => ({
            week: formatDate(ws),
            weekStart: ws,
            deficit: v,
        }));

        // weight tracking
        const weights = state.weights || {};
        const weightDates = Object.keys(weights).sort();
        const startWeight = weightDates.length > 0 ? Number(weights[weightDates[0]]) : null;
        const latestWeight = weightDates.length > 0 ? Number(weights[weightDates[weightDates.length - 1]]) : null;
        const actualKgLost = startWeight && latestWeight ? startWeight - latestWeight : 0;
        const weightChartData = weightDates.map((d) => ({
            date: formatDate(d),
            fullDate: d,
            weight: Number(weights[d]),
            // predicted weight if user started tracking: startWeight - (cumulative deficit on that date / 7500)
            predicted: startWeight ? startWeight - (Object.entries(entries).filter(([ed]) => ed <= d).reduce((s, [, v]) => s + (Number(v) || 0), 0) / KCAL_PER_KG) : null,
        }));

        // heatmap data — last 16 weeks grid
        const heatmapWeeks = 16;
        const heatmapData = [];
        const todayD = new Date(todayISO());
        const heatStart = new Date(todayD);
        heatStart.setDate(heatStart.getDate() - (heatmapWeeks * 7 - 1));
        // align to Monday
        const startDay = heatStart.getDay();
        const shiftToMon = startDay === 0 ? -6 : 1 - startDay;
        heatStart.setDate(heatStart.getDate() + shiftToMon);
        for (let w = 0; w < heatmapWeeks; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const cell = new Date(heatStart);
                cell.setDate(cell.getDate() + w * 7 + d);
                const iso = `${cell.getFullYear()}-${String(cell.getMonth() + 1).padStart(2, '0')}-${String(cell.getDate()).padStart(2, '0')}`;
                const deficit = Number(entries[iso]) || 0;
                const isFuture = cell > todayD;
                week.push({ date: iso, deficit, isFuture });
            }
            heatmapData.push(week);
        }

        // week-in-review: detect completed weeks not yet dismissed
        const completedWeeks = [];
        const seenWeeks = new Set();
        Object.keys(entries).forEach((d) => {
            const ws = getWeekStart(d);
            seenWeeks.add(ws);
        });
        const currentWeekStart = getWeekStart(todayISO());
        return {
            totalDeficit, remaining, fatLostKg, pctTotal,
            weekDeficit, weekPct, weekDaysLogged,
            streak, weeklyAvg, avgDaily, daysToGoal, weeksToGoal,
            deltaKcal, deltaDays,
            kcalToNextKcal, kcalToNextKg, nextKcalMilestone, nextKgMilestone,
            chartData, weeklyData,
            totalDaysLogged: dates.length,
            // weight stuff
            startWeight, latestWeight, actualKgLost, weightChartData,
            // heatmap
            heatmapData,
            // week in review
            completedWeeks,
        };
    }, [state]);

    // ----- actions -----
    const logDeficit = () => {
        const val = parseInt(inputValue, 10);
        if (isNaN(val) || val === 0) return;
        setState((s) => ({
            ...s,
            entries: { ...s.entries, [inputDate]: val },
        }));
        setInputValue('');
        setInputDate(todayISO());
        setJustLogged(true);
        setTimeout(() => setJustLogged(false), 1200);
    };

    const deleteEntry = (date) => {
        setState((s) => {
            const newEntries = { ...s.entries };
            delete newEntries[date];
            return { ...s, entries: newEntries };
        });
    };

    const logWeight = () => {
        const val = parseFloat(weightInput);
        if (isNaN(val) || val <= 0) return;
        setState((s) => ({
            ...s,
            weights: { ...(s.weights || {}), [weightDate]: val },
        }));
        setWeightInput('');
        setWeightDate(todayISO());
    };

    const deleteWeight = (date) => {
        setState((s) => {
            const newWeights = { ...(s.weights || {}) };
            delete newWeights[date];
            return { ...s, weights: newWeights };
        });
    };

    const dismissWeekReview = (weekStart) => {
        setState((s) => ({
            ...s,
            reviewedWeeks: { ...(s.reviewedWeeks || {}), [weekStart]: true },
        }));
    };

    const exportData = () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deficit-tracker-${todayISO()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importData = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                if (!parsed.entries) throw new Error('Invalid file');
                if (confirm(`Import ${Object.keys(parsed.entries).length} entries? This will replace current data.`)) {
                    setState(parsed);
                }
            } catch (err) {
                alert('Invalid file. Expected a JSON file exported from this app.');
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // reset
    };

    const saveWeeklyTarget = () => {
        const v = parseInt(targetDraft, 10);
        if (!isNaN(v) && v > 0) {
            setState((s) => ({ ...s, weeklyTarget: v }));
        }
        setEditingTarget(false);
    };

    const toggleNotifications = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications.');
            return;
        }
        if (state.notifications) {
            setState((s) => ({ ...s, notifications: false }));
            return;
        }
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
            setState((s) => ({ ...s, notifications: true }));
            new Notification('DEFICIT TRACKER', {
                body: "Notifications enabled. You'll get a daily nudge at 8 PM.",
            });
        }
    };

    // notification scheduler (checks every minute while tab is open)
    useEffect(() => {
        if (!state.notifications) return;
        const check = () => {
            const now = new Date();
            if (now.getHours() === 20 && now.getMinutes() === 0) {
                const today = todayISO();
                if (!state.entries[today]) {
                    new Notification('Log your deficit 🔥', {
                        body: `Day ${metrics.streak + 1} of your streak is on the line. Lock it in.`,
                    });
                }
            }
        };
        const id = setInterval(check, 60 * 1000);
        return () => clearInterval(id);
    }, [state.notifications, state.entries, metrics.streak]);

    const ACCENT = '#f97316'; // orange
    const GREEN = '#22c55e';
    const RED = '#ef4444';

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-white font-sans overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
            {/* subtle radial glow — no grid for cleaner foreground contrast */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-[0.12] blur-3xl"
                style={{ background: `radial-gradient(circle, ${ACCENT}66 0%, transparent 70%)` }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* ============ HEADER ============ */}
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
                            onChange={importData}
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
                            onClick={exportData}
                            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-wider font-semibold"
                            title="Export data as JSON"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={toggleNotifications}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs uppercase tracking-wider font-semibold"
                        >
                            {state.notifications ? <Bell className="w-3.5 h-3.5" style={{ color: ACCENT }} /> : <BellOff className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{state.notifications ? 'On' : 'Alerts'}</span>
                        </button>
                    </div>
                </header>

                {/* ============ QUOTE (top, motivational anchor) ============ */}
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

                {/* ============ WEEK IN REVIEW (shows if a past week hasn't been dismissed) ============ */}
                {metrics.completedWeeks.length > 0 && (
                    <section className="mb-8">
                        {metrics.completedWeeks.slice(-1).map((wk) => {
                            const pct = wk.target > 0 ? wk.total / wk.target : 0;
                            const hitTarget = wk.total >= wk.target;
                            return (
                                <div
                                    key={wk.weekStart}
                                    className="relative bg-gradient-to-br from-orange-500/10 via-neutral-900/90 to-neutral-900/90 border-2 border-orange-500/40 rounded-2xl p-5 overflow-hidden"
                                >
                                    <div className="absolute -top-8 -right-8 w-40 h-40 pointer-events-none opacity-30 blur-3xl" style={{ background: ACCENT }} />
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-3 gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-mono mb-1" style={{ color: ACCENT }}>
                                                    <Trophy className="w-3 h-3" />
                                                    Week.Complete
                                                </div>
                                                <div className="text-xl sm:text-2xl font-black tracking-tight">
                                                    Week of {formatDate(wk.weekStart)} — {hitTarget ? 'Target Smashed 🔥' : 'Wrapped'}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => dismissWeekReview(wk.weekStart)}
                                                className="text-[10px] uppercase tracking-wider text-white/50 hover:text-white font-mono px-2 py-1 border border-white/10 rounded"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                            <ReviewStat label="Total" value={`${wk.total.toLocaleString()}`} unit="kcal" />
                                            <ReviewStat label="Target" value={`${wk.target.toLocaleString()}`} unit="kcal" />
                                            <ReviewStat label="Days logged" value={`${wk.days}/7`} />
                                            <ReviewStat label="Fat burned" value={wk.fatLossKg.toFixed(2)} unit="kg" highlight />
                                        </div>
                                        <div className="mt-4">
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${Math.min(100, pct * 100)}%`,
                                                        background: hitTarget ? `linear-gradient(90deg, #22c55e, #4ade80)` : `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
                                                    }}
                                                />
                                            </div>
                                            <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mt-2">
                                                {Math.round(pct * 100)}% of weekly target
                                                {metrics.completedWeeks.length > 1 && ` · ${metrics.completedWeeks.length - 1} more week(s) pending`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* ============ HERO: TOTAL PROGRESS ============ */}
                <section className="mb-8 sm:mb-12">
                    <div className="flex items-baseline justify-between mb-3">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">// Mission — 8kg Fat Loss</div>
                        <div className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: metrics.deltaDays >= 0 ? GREEN : RED }}>
                            {metrics.deltaDays >= 0 ? '▲ ' : '▼ '}{Math.abs(metrics.deltaDays)} days {metrics.deltaDays >= 0 ? 'ahead' : 'behind'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center">
                        <div>
                            <div className="flex items-baseline gap-3 mb-1">
                                <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter tabular-nums leading-none" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.05em' }}>
                                    <AnimatedNumber value={metrics.totalDeficit} />
                                </div>
                                <div className="text-sm font-mono text-white/40 uppercase tracking-widest">kcal</div>
                            </div>
                            <div className="text-sm text-white/50 font-mono mb-5">
                                of <span className="text-white/80">{TOTAL_TARGET_KCAL.toLocaleString()}</span> total target
                            </div>

                            {/* big progress bar */}
                            <div className="relative h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                                    style={{
                                        width: `${metrics.pctTotal * 100}%`,
                                        background: `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
                                        boxShadow: `0 0 20px ${ACCENT}88`,
                                    }}
                                />
                                {/* milestone ticks */}
                                {[0.25, 0.5, 0.75].map((t) => (
                                    <div key={t} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${t * 100}%` }} />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30 uppercase tracking-wider">
                                <span>0kg</span><span>2kg</span><span>4kg</span><span>6kg</span><span>8kg</span>
                            </div>
                        </div>

                        {/* stat stack */}
                        <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[180px]">
                            <StatTile
                                label="Fat burned"
                                value={<><AnimatedNumber value={metrics.fatLostKg} decimals={2} /><span className="text-lg font-mono text-white/40 ml-1">kg</span></>}
                                color={ACCENT}
                            />
                            <StatTile
                                label="Remaining"
                                value={<><AnimatedNumber value={metrics.remaining} /><span className="text-xs font-mono text-white/40 ml-1">kcal</span></>}
                            />
                            <StatTile
                                label="Complete"
                                value={<><AnimatedNumber value={metrics.pctTotal * 100} decimals={1} /><span className="text-lg font-mono text-white/40">%</span></>}
                            />
                        </div>
                    </div>
                </section>

                {/* ============ WEEKLY + INPUT ROW ============ */}
                <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 mb-8">

                    {/* WEEKLY CARD */}
                    <Card>
                        <CardHeader
                            tag="Week.Current"
                            title="Weekly Deficit"
                            right={
                                editingTarget ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={targetDraft}
                                            onChange={(e) => setTargetDraft(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveWeeklyTarget()}
                                            className="w-20 px-2 py-1 bg-black border border-white/20 rounded text-xs font-mono text-right focus:outline-none focus:border-orange-500"
                                            autoFocus
                                        />
                                        <button onClick={saveWeeklyTarget} className="text-xs px-2 py-1 bg-orange-500 text-black rounded font-bold">OK</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setEditingTarget(true); setTargetDraft(state.weeklyTarget); }}
                                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 hover:text-white font-mono transition-colors"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        Target: {state.weeklyTarget.toLocaleString()}
                                    </button>
                                )
                            }
                        />

                        <div className="flex items-center gap-6 mt-4">
                            <CircularProgress
                                value={metrics.weekDeficit}
                                max={state.weeklyTarget}
                                size={140}
                                stroke={8}
                                color={ACCENT}
                                label={`${Math.round(metrics.weekPct * 100)}%`}
                                sublabel="this week"
                            />
                            <div className="flex-1 space-y-3 min-w-0">
                                <MiniStat label="Logged" value={`${metrics.weekDeficit.toLocaleString()}`} unit="kcal" />
                                <MiniStat label="Days" value={`${metrics.weekDaysLogged}/7`} />
                                <MiniStat label="Avg/day" value={Math.round(metrics.avgDaily)} unit="kcal" />
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${metrics.weekPct * 100}%`,
                                            background: `linear-gradient(90deg, ${ACCENT}, #fbbf24)`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* INPUT CARD */}
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
                                    onKeyDown={(e) => e.key === 'Enter' && logDeficit()}
                                    className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-lg font-bold font-mono focus:outline-none focus:border-orange-500 placeholder:text-white/20"
                                />
                            </div>
                            <button
                                onClick={logDeficit}
                                disabled={!inputValue}
                                className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${justLogged
                                    ? 'bg-green-500 text-black scale-[0.98]'
                                    : 'bg-orange-500 text-black hover:bg-orange-400 active:scale-[0.98] disabled:bg-white/10 disabled:text-white/30'
                                    }`}
                                style={{ boxShadow: inputValue ? `0 0 30px ${ACCENT}66` : 'none' }}
                            >
                                {justLogged ? <><Zap className="w-4 h-4" /> Locked in</> : <><Plus className="w-4 h-4" /> Commit deficit</>}
                            </button>
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-400 font-mono font-bold">
                                        <Flame className="w-3 h-3" />
                                        {metrics.streak} day streak
                                    </span>
                                </div>
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="text-[10px] uppercase tracking-wider text-white/40 hover:text-white font-mono"
                                >
                                    {showHistory ? '− Hide' : '+ History'} ({metrics.totalDaysLogged})
                                </button>
                            </div>
                        </div>

                        {showHistory && (
                            <div className="mt-3 max-h-48 overflow-y-auto border-t border-white/10 pt-3 space-y-1">
                                {Object.entries(state.entries).sort(([a], [b]) => b.localeCompare(a)).map(([date, val]) => (
                                    <div key={date} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-white/5 text-sm font-mono group">
                                        <span className="text-white/60">{formatDate(date)}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-400 font-bold">{Number(val).toLocaleString()}</span>
                                            <button onClick={() => deleteEntry(date)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(state.entries).length === 0 && (
                                    <div className="text-center text-white/30 text-xs py-4 font-mono">No entries yet</div>
                                )}
                            </div>
                        )}
                    </Card>
                </section>

                {/* ============ MILESTONES ============ */}
                <section className="mb-8">
                    <Card>
                        <CardHeader tag="Milestones" title="Next Up" />
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MilestoneRow
                                icon={<Target className="w-4 h-4" />}
                                label="Next 5k"
                                value={`${metrics.kcalToNextKcal.toLocaleString()} kcal`}
                                progress={(metrics.totalDeficit % 5000) / 5000}
                                color={ACCENT}
                            />
                            <MilestoneRow
                                icon={<Award className="w-4 h-4" />}
                                label={`Next kg (${Math.floor(metrics.fatLostKg) + 1}kg)`}
                                value={`${Math.round(metrics.kcalToNextKg).toLocaleString()} kcal`}
                                progress={(metrics.fatLostKg % 1)}
                                color="#fbbf24"
                            />
                        </div>
                    </Card>
                </section>

                {/* ============ PROJECTIONS ============ */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <ProjectionCard
                        icon={<TrendingUp className="w-4 h-4" />}
                        label="Weekly avg"
                        value={Math.round(metrics.weeklyAvg).toLocaleString()}
                        unit="kcal/wk"
                        accent={ACCENT}
                    />
                    <ProjectionCard
                        icon={<Calendar className="w-4 h-4" />}
                        label="Days to goal"
                        value={isFinite(metrics.daysToGoal) ? metrics.daysToGoal : '—'}
                        unit="days"
                    />
                    <ProjectionCard
                        icon={<Zap className="w-4 h-4" />}
                        label="Total logged"
                        value={metrics.totalDaysLogged}
                        unit="days"
                    />
                    <ProjectionCard
                        icon={<Flame className="w-4 h-4" />}
                        label="Current streak"
                        value={metrics.streak}
                        unit="days"
                        accent={ACCENT}
                    />
                </section>

                {/* ============ CHARTS ============ */}
                {metrics.chartData.length > 0 && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                        <Card>
                            <CardHeader tag="Chart.Cumulative" title="Progress Curve" right={<BarChart3 className="w-4 h-4 text-white/40" />} />
                            <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={metrics.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                                        <Tooltip
                                            contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 12 }}
                                            labelStyle={{ color: ACCENT, fontFamily: 'monospace', fontSize: 11 }}
                                        />
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
                            <CardHeader tag="Chart.Weekly" title="Weekly Output" right={<span className="text-[10px] font-mono text-white/40">Target: {state.weeklyTarget}</span>} />
                            <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={metrics.weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                                        <Tooltip
                                            contentStyle={{ background: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 12 }}
                                            labelStyle={{ color: ACCENT, fontFamily: 'monospace', fontSize: 11 }}
                                            cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                                        />
                                        <ReferenceLine y={state.weeklyTarget} stroke={GREEN} strokeDasharray="3 3" />
                                        <Bar dataKey="deficit" fill={ACCENT} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </section>
                )}

                {/* ============ WEIGHT TRACKING ============ */}
                <section className="mb-8">
                    <Card>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">// Weight.Log</div>
                                <div className="text-base font-black tracking-tight mt-0.5">Reality Check</div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono">
                                {metrics.startWeight && (
                                    <div className="text-white/60">
                                        <span className="text-white/40 uppercase tracking-wider">Start</span>{' '}
                                        <span className="font-bold text-white">{metrics.startWeight.toFixed(1)}kg</span>
                                    </div>
                                )}
                                {metrics.latestWeight && (
                                    <div className="text-white/60">
                                        <span className="text-white/40 uppercase tracking-wider">Now</span>{' '}
                                        <span className="font-bold text-white">{metrics.latestWeight.toFixed(1)}kg</span>
                                    </div>
                                )}
                                {metrics.actualKgLost > 0 && (
                                    <div className="text-green-400 font-bold">
                                        −{metrics.actualKgLost.toFixed(2)}kg
                                    </div>
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
                                onKeyDown={(e) => e.key === 'Enter' && logWeight()}
                                className="flex-1 px-3 py-2.5 bg-black border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-500 placeholder:text-white/30"
                            />
                            <button
                                onClick={logWeight}
                                disabled={!weightInput}
                                className="px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 transition-all disabled:opacity-40"
                            >
                                <Scale className="w-3.5 h-3.5" />
                                Log weight
                            </button>
                            <button
                                onClick={() => setShowWeightHistory(!showWeightHistory)}
                                className="px-3 py-2.5 rounded-lg text-[10px] uppercase tracking-wider font-mono text-white/50 hover:text-white border border-white/10"
                            >
                                {showWeightHistory ? '−' : '+'} Log ({Object.keys(state.weights || {}).length})
                            </button>
                        </div>

                        {showWeightHistory && Object.keys(state.weights || {}).length > 0 && (
                            <div className="mt-3 max-h-40 overflow-y-auto border-t border-white/10 pt-3 grid grid-cols-2 sm:grid-cols-3 gap-1">
                                {Object.entries(state.weights || {}).sort(([a], [b]) => b.localeCompare(a)).map(([date, val]) => (
                                    <div key={date} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 text-xs font-mono group">
                                        <span className="text-white/60">{formatDate(date)}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{Number(val).toFixed(1)}kg</span>
                                            <button onClick={() => deleteWeight(date)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {metrics.weightChartData.length >= 2 && (
                            <div className="mt-5">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mb-2">Actual vs Predicted</div>
                                <div className="h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={metrics.weightChartData}>
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

                        {Object.keys(state.weights || {}).length === 0 && (
                            <div className="mt-3 text-[11px] text-white/40 font-mono text-center py-3">
                                Log whenever you weigh in — weekly, biweekly, whatever. Not required daily.
                            </div>
                        )}
                    </Card>
                </section>

                {/* ============ HEATMAP ============ */}
                <section className="mb-8">
                    <Card>
                        <CardHeader
                            tag="Heatmap.16Weeks"
                            title="Consistency Grid"
                            right={<Grid3x3 className="w-4 h-4 text-white/40" />}
                        />
                        <div className="mt-4 overflow-x-auto -mx-2 px-2">
                            <div className="inline-flex flex-col gap-1 min-w-full">
                                {/* day labels */}
                                <div className="flex gap-1">
                                    <div className="w-8 text-[9px] font-mono text-white/30" />
                                    {metrics.heatmapData.map((_, i) => (
                                        <div key={i} className="w-3.5 sm:w-4 text-center text-[8px] font-mono text-white/20">
                                            {i % 4 === 0 ? `W${i + 1}` : ''}
                                        </div>
                                    ))}
                                </div>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayLabel, dayIdx) => (
                                    <div key={dayIdx} className="flex gap-1 items-center">
                                        <div className="w-8 text-[9px] font-mono text-white/30 uppercase">{dayLabel}</div>
                                        {metrics.heatmapData.map((week, weekIdx) => {
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
                        {/* legend */}
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

                {/* ============ FOOTER ============ */}
                <footer className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                    <div>Started {formatDate(state.startDate)} · {metrics.totalDaysLogged} entries</div>
                    <div>1kg = {KCAL_PER_KG.toLocaleString()} kcal · {TOTAL_TARGET_KG}kg = {TOTAL_TARGET_KCAL.toLocaleString()} kcal</div>
                </footer>
            </div>
        </div>
    );
}

// ----- sub-components -----
const Card = ({ children, className = '' }) => (
    <div className={`relative bg-neutral-900/80 border border-white/15 rounded-2xl p-5 backdrop-blur-sm shadow-xl ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ tag, title, right }) => (
    <div className="flex items-center justify-between">
        <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">// {tag}</div>
            <div className="text-base font-black tracking-tight mt-0.5">{title}</div>
        </div>
        {right}
    </div>
);

const StatTile = ({ label, value, color }) => (
    <div className="bg-neutral-900/80 border border-white/15 rounded-xl p-3">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono mb-1">{label}</div>
        <div className="text-xl sm:text-2xl font-black tabular-nums tracking-tight" style={color ? { color } : {}}>
            {value}
        </div>
    </div>
);

const MiniStat = ({ label, value, unit }) => (
    <div className="flex items-baseline justify-between border-b border-white/5 pb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">{label}</span>
        <span className="font-mono font-bold tabular-nums">
            {value}
            {unit && <span className="text-white/40 text-xs ml-1">{unit}</span>}
        </span>
    </div>
);

const MilestoneRow = ({ icon, label, value, progress, color }) => (
    <div>
        <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs text-white/70">
                <span style={{ color }}>{icon}</span>
                <span className="font-mono uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress * 100}%`, background: color }} />
        </div>
    </div>
);

const ProjectionCard = ({ icon, label, value, unit, accent }) => (
    <div className="bg-neutral-900/80 border border-white/15 rounded-xl p-4 hover:border-white/30 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-white/50" style={accent ? { color: accent } : {}}>
            {icon}
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono">{label}</span>
        </div>
        <div className="text-2xl font-black tabular-nums tracking-tight">
            {value}
            <span className="text-xs font-mono text-white/50 ml-1.5 font-normal">{unit}</span>
        </div>
    </div>
);

const ReviewStat = ({ label, value, unit, highlight }) => (
    <div className="bg-black/30 border border-white/10 rounded-lg p-3">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono mb-1">{label}</div>
        <div className={`text-lg sm:text-xl font-black tabular-nums tracking-tight ${highlight ? 'text-orange-400' : 'text-white'}`}>
            {value}
            {unit && <span className="text-[10px] font-mono text-white/50 ml-1 font-normal">{unit}</span>}
        </div>
    </div>
);