import { useState, useEffect } from 'react';
import { DEFAULT_WEEKLY } from '../constants';
import { loadState, saveState, todayISO } from '../utils';
import { cloudLoad, cloudSave } from '../lib/cloud';

export function useDeficitState() {
    const [state, setState] = useState(() => {
        const loaded = loadState();
        const base = {
            entries: {},
            weights: {},
            weeklyTarget: DEFAULT_WEEKLY,
            startDate: todayISO(),
            notifications: false,
            reviewedWeeks: {},
        };
        return loaded ? { ...base, ...loaded } : base;
    });

    // On mount: pull from cloud and merge with whatever is in localStorage.
    // entries/weights union — local wins on same-day conflicts (user may have
    // just typed something before cloud responded).
    useEffect(() => {
        cloudLoad().then((cloudState) => {
            if (!cloudState) return;
            setState((s) => ({
                ...s,
                ...cloudState,
                entries: { ...cloudState.entries, ...s.entries },
                weights: { ...(cloudState.weights || {}), ...(s.weights || {}) },
            }));
        });
    }, []);

    // Save to localStorage immediately; save to cloud on every change.
    useEffect(() => {
        saveState(state);
        cloudSave(state);
    }, [state]);

    const logDeficit = (date, value) => {
        setState((s) => ({ ...s, entries: { ...s.entries, [date]: value } }));
    };

    const deleteEntry = (date) => {
        setState((s) => {
            const entries = { ...s.entries };
            delete entries[date];
            return { ...s, entries };
        });
    };

    const logWeight = (date, value) => {
        setState((s) => ({ ...s, weights: { ...(s.weights || {}), [date]: value } }));
    };

    const deleteWeight = (date) => {
        setState((s) => {
            const weights = { ...(s.weights || {}) };
            delete weights[date];
            return { ...s, weights };
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
            } catch {
                alert('Invalid file. Expected a JSON file exported from this app.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const saveWeeklyTarget = (value) => {
        const v = parseInt(value, 10);
        if (!isNaN(v) && v > 0) {
            setState((s) => ({ ...s, weeklyTarget: v }));
        }
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

    return {
        state,
        logDeficit,
        deleteEntry,
        logWeight,
        deleteWeight,
        dismissWeekReview,
        exportData,
        importData,
        saveWeeklyTarget,
        toggleNotifications,
    };
}
