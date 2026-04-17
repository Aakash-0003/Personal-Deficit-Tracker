import { supabase } from './supabase';

const ROW_ID = 'tracker_main';

export const cloudLoad = async () => {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('tracker_data')
            .select('payload')
            .eq('id', ROW_ID)
            .single();
        if (error || !data) return null;
        return data.payload;
    } catch {
        return null;
    }
};

export const cloudSave = async (state) => {
    if (!supabase) return;
    try {
        await supabase
            .from('tracker_data')
            .upsert({ id: ROW_ID, payload: state, updated_at: new Date().toISOString() });
    } catch {
        // silent fail — localStorage is always the backup
    }
};
