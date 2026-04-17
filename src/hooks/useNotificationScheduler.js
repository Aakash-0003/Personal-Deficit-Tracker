import { useEffect } from 'react';
import { todayISO } from '../utils';

export function useNotificationScheduler(notifications, entries, streak) {
    useEffect(() => {
        if (!notifications) return;
        const check = () => {
            const now = new Date();
            if (now.getHours() === 20 && now.getMinutes() === 0) {
                const today = todayISO();
                if (!entries[today]) {
                    new Notification('Log your deficit 🔥', {
                        body: `Day ${streak + 1} of your streak is on the line. Lock it in.`,
                    });
                }
            }
        };
        const id = setInterval(check, 60 * 1000);
        return () => clearInterval(id);
    }, [notifications, entries, streak]);
}
