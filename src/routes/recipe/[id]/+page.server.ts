
import { error as httpError } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
    const { data, error } = await supabase
        .from('recipes')
        .select()
        .eq('id', params.id)
        .limit(1)
        .single()

    if (error) {
        throw httpError(404, 'Not found');
    }

    return {
        recipe: data
    };
};

