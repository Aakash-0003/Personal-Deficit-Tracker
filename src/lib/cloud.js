import { supabase } from './supabase';

const ROW_ID = 'tracker_main';

// 'unconfigured' | 'ok' | 'error'
export let cloudStatus = supabase ? 'ok' : 'unconfigured';

export const cloudLoad = async () => {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('tracker_data')
            .select('payload')
            .eq('id', ROW_ID)
            .single();
        if (error) {
            // PGRST116 = no rows yet (first ever load) — not a real error
            if (error.code !== 'PGRST116') {
                console.error('[cloud] load error:', error.message, error.code);
                cloudStatus = 'error';
            }
            return null;
        }
        cloudStatus = 'ok';
        return data.payload;
    } catch (e) {
        console.error('[cloud] load exception:', e);
        cloudStatus = 'error';
        return null;
    }
};

export const cloudSave = async (state) => {
    if (!supabase) return;
    try {
        const { error } = await supabase
            .from('tracker_data')
            .upsert({ id: ROW_ID, payload: state, updated_at: new Date().toISOString() });
        if (error) {
            console.error('[cloud] save error:', error.message, error.code);
            cloudStatus = 'error';
        } else {
            cloudStatus = 'ok';
        }
    } catch (e) {
        console.error('[cloud] save exception:', e);
        cloudStatus = 'error';
    }
};
