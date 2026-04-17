import { TrendingUp, Calendar, Zap, Flame } from 'lucide-react';
import { ACCENT } from '../constants';
import { ProjectionCard } from './ui';

export default function ProjectionsRow({ metrics }) {
    const { weeklyAvg, daysToGoal, totalDaysLogged, streak } = metrics;

    return (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <ProjectionCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="Weekly avg"
                value={Math.round(weeklyAvg).toLocaleString()}
                unit="kcal/wk"
                accent={ACCENT}
            />
            <ProjectionCard
                icon={<Calendar className="w-4 h-4" />}
                label="Days to goal"
                value={isFinite(daysToGoal) ? daysToGoal : '—'}
                unit="days"
            />
            <ProjectionCard
                icon={<Zap className="w-4 h-4" />}
                label="Total logged"
                value={totalDaysLogged}
                unit="days"
            />
            <ProjectionCard
                icon={<Flame className="w-4 h-4" />}
                label="Current streak"
                value={streak}
                unit="days"
                accent={ACCENT}
            />
        </section>
    );
}
