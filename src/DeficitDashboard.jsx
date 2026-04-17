import { ACCENT, KCAL_PER_KG, TOTAL_TARGET_KG, TOTAL_TARGET_KCAL } from './constants';
import { formatDate } from './utils';
import { useDeficitState } from './hooks/useDeficitState';
import { useDeficitMetrics } from './hooks/useDeficitMetrics';
import { useNotificationScheduler } from './hooks/useNotificationScheduler';

import Header from './components/Header';
import QuoteCard from './components/QuoteCard';
import WeekInReview from './components/WeekInReview';
import TotalProgressHero from './components/TotalProgressHero';
import WeeklyDeficitCard from './components/WeeklyDeficitCard';
import DeficitInputCard from './components/DeficitInputCard';
import MilestonesCard from './components/MilestonesCard';
import ProjectionsRow from './components/ProjectionsRow';
import ChartsSection from './components/ChartsSection';
import WeightTracker from './components/WeightTracker';
import HeatmapGrid from './components/HeatmapGrid';

export default function DeficitDashboard() {
    const {
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
    } = useDeficitState();

    const metrics = useDeficitMetrics(state);

    useNotificationScheduler(state.notifications, state.entries, metrics.streak);

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-white font-sans overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-[0.12] blur-3xl"
                style={{ background: `radial-gradient(circle, ${ACCENT}66 0%, transparent 70%)` }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <Header
                    notifications={state.notifications}
                    onToggleNotifications={toggleNotifications}
                    onExport={exportData}
                    onImport={importData}
                />

                <QuoteCard />

                <WeekInReview
                    completedWeeks={metrics.completedWeeks}
                    onDismiss={dismissWeekReview}
                />

                <TotalProgressHero metrics={metrics} />

                <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 mb-8">
                    <WeeklyDeficitCard
                        metrics={metrics}
                        weeklyTarget={state.weeklyTarget}
                        onSaveTarget={saveWeeklyTarget}
                    />
                    <DeficitInputCard
                        entries={state.entries}
                        streak={metrics.streak}
                        totalDaysLogged={metrics.totalDaysLogged}
                        onLog={logDeficit}
                        onDelete={deleteEntry}
                    />
                </section>

                <MilestonesCard metrics={metrics} />

                <ProjectionsRow metrics={metrics} />

                <ChartsSection
                    chartData={metrics.chartData}
                    weeklyData={metrics.weeklyData}
                    weeklyTarget={state.weeklyTarget}
                />

                <WeightTracker
                    weights={state.weights}
                    metrics={metrics}
                    onLogWeight={logWeight}
                    onDeleteWeight={deleteWeight}
                />

                <HeatmapGrid heatmapData={metrics.heatmapData} startDate={formatDate(state.startDate)} />

                <footer className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                    <div>Started {formatDate(state.startDate)} · {metrics.totalDaysLogged} entries</div>
                    <div>1kg = {KCAL_PER_KG.toLocaleString()} kcal · {TOTAL_TARGET_KG}kg = {TOTAL_TARGET_KCAL.toLocaleString()} kcal</div>
                </footer>
            </div>
        </div>
    );
}
