import { useMemo } from 'react';
import { KCAL_PER_KG, TOTAL_TARGET_KCAL } from '../constants';
import { todayISO, getWeekStart, daysBetween, formatDate } from '../utils';

export function useDeficitMetrics(state) {
    return useMemo(() => {
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

        // streak: count backwards from today
        let streak = 0;
        const d = new Date(todayISO());
        while (true) {
            const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (entries[iso] && Number(entries[iso]) > 0) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else break;
        }

        const avgDaily = dates.length > 0 ? totalDeficit / dates.length : 0;
        const weeklyAvg = avgDaily * 7;

        const weeksToGoal = weeklyAvg > 0 ? remaining / weeklyAvg : Infinity;
        const daysToGoal = Math.ceil(weeksToGoal * 7);

        const daysSinceStart = Math.max(1, daysBetween(state.startDate, todayISO()) + 1);
        const expectedPerDay = state.weeklyTarget / 7;
        const expectedSoFar = expectedPerDay * daysSinceStart;
        const deltaKcal = totalDeficit - expectedSoFar;
        const deltaDays = expectedPerDay > 0 ? Math.round(deltaKcal / expectedPerDay) : 0;

        const nextKcalMilestone = Math.ceil((totalDeficit + 1) / 5000) * 5000;
        const nextKgMilestone = Math.ceil((fatLostKg + 0.0001) * 1) / 1;
        const kcalToNextKcal = nextKcalMilestone - totalDeficit;
        const kcalToNextKg = nextKgMilestone * KCAL_PER_KG - totalDeficit;

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

        const weeklyMap = {};
        Object.entries(entries).forEach(([date, v]) => {
            const ws = getWeekStart(date);
            weeklyMap[ws] = (weeklyMap[ws] || 0) + (Number(v) || 0);
        });
        const weeklyData = Object.entries(weeklyMap).sort().map(([ws, v]) => ({
            week: formatDate(ws),
            weekStart: ws,
            deficit: v,
        }));

        const weights = state.weights || {};
        const weightDates = Object.keys(weights).sort();
        const startWeight = weightDates.length > 0 ? Number(weights[weightDates[0]]) : null;
        const latestWeight = weightDates.length > 0 ? Number(weights[weightDates[weightDates.length - 1]]) : null;
        const actualKgLost = startWeight && latestWeight ? startWeight - latestWeight : 0;
        const weightChartData = weightDates.map((date) => ({
            date: formatDate(date),
            fullDate: date,
            weight: Number(weights[date]),
            predicted: startWeight
                ? startWeight - (Object.entries(entries).filter(([ed]) => ed <= date).reduce((s, [, v]) => s + (Number(v) || 0), 0) / KCAL_PER_KG)
                : null,
        }));

        const heatmapWeeks = 16;
        const heatmapData = [];
        const todayD = new Date(todayISO());
        const heatStart = new Date(todayD);
        heatStart.setDate(heatStart.getDate() - (heatmapWeeks * 7 - 1));
        const startDay = heatStart.getDay();
        const shiftToMon = startDay === 0 ? -6 : 1 - startDay;
        heatStart.setDate(heatStart.getDate() + shiftToMon);
        for (let w = 0; w < heatmapWeeks; w++) {
            const week = [];
            for (let day = 0; day < 7; day++) {
                const cell = new Date(heatStart);
                cell.setDate(cell.getDate() + w * 7 + day);
                const iso = `${cell.getFullYear()}-${String(cell.getMonth() + 1).padStart(2, '0')}-${String(cell.getDate()).padStart(2, '0')}`;
                week.push({ date: iso, deficit: Number(entries[iso]) || 0, isFuture: cell > todayD });
            }
            heatmapData.push(week);
        }

        const completedWeeks = [];

        return {
            totalDeficit, remaining, fatLostKg, pctTotal,
            weekDeficit, weekPct, weekDaysLogged,
            streak, weeklyAvg, avgDaily, daysToGoal, weeksToGoal,
            deltaKcal, deltaDays,
            kcalToNextKcal, kcalToNextKg, nextKcalMilestone, nextKgMilestone,
            chartData, weeklyData,
            totalDaysLogged: dates.length,
            startWeight, latestWeight, actualKgLost, weightChartData,
            heatmapData,
            completedWeeks,
        };
    }, [state]);
}
