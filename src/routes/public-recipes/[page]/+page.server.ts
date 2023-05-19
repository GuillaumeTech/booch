import { error as httpError, redirect } from '@sveltejs/kit';

const pageSize = 20;

export const load = async ({ params, locals: { supabase } }) => {
	const pageNumber = Number(params.page);
	if (pageNumber < 0) {
		throw redirect(308, '/public-recipes/0');
	}
	const { data, error } = await supabase
		.from('recipes')
		.select()
		// minus one bc we start from zero e.g: (0,19) -> 20 elements
		.range(pageNumber * pageSize, pageSize + pageNumber * pageSize - 1)
		.eq('public', true);

	if (error) {
		throw httpError(404, 'Not found');
	}

	return {
		recipes: data
	};
};
