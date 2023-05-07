import { redirect } from '@sveltejs/kit';

export function load() {
    throw redirect(308, 'public-recipes/0');
}