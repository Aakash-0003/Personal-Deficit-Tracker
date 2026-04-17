import { Target, Award } from 'lucide-react';
import { ACCENT } from '../constants';
import { Card, CardHeader, MilestoneRow } from './ui';

export default function MilestonesCard({ metrics }) {
    const { kcalToNextKcal, kcalToNextKg, fatLostKg, totalDeficit } = metrics;

    return (
        <section className="mb-8">
            <Card>
                <CardHeader tag="Milestones" title="Next Up" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MilestoneRow
                        icon={<Target className="w-4 h-4" />}
                        label="Next 5k"
                        value={`${kcalToNextKcal.toLocaleString()} kcal`}
                        progress={(totalDeficit % 5000) / 5000}
                        color={ACCENT}
                    />
                    <MilestoneRow
                        icon={<Award className="w-4 h-4" />}
                        label={`Next kg (${Math.floor(fatLostKg) + 1}kg)`}
                        value={`${Math.round(kcalToNextKg).toLocaleString()} kcal`}
                        progress={fatLostKg % 1}
                        color="#fbbf24"
                    />
                </div>
            </Card>
        </section>
    );
}
