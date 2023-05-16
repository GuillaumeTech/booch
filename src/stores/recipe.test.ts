import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { get } from 'svelte/store';
import { recipes, points, activeRecipeId, currentRecipe } from './recipe';

const recipeId = '123';
const pointId = '456';

vi.mock('uuid', () => {
	return { v4: () => 'abc' };
});

vi.mock('@supabase/supabase-js', () => {
	return {
		createClient: () => ({
			auth: {
				getSession: () => { return { data: { session: true } } }
			}
		})
	};
});


const recipeFixture = {
	name: 'test',
	id: recipeId,
	points: [],
	axisNames: { x: 'testX', y: 'testY' },
	public: false,
	created_at: new Date(),
	description: 'test test descript'
};


const recipeUpdateFixture = {
	id: recipeId,
	name: 'testaa',
	axisNames: { x: 'Taaaa', y: 'testY' },
	public: true,
	created_at: new Date(),
	description: 'test test descript'
};


const pointsFixture = {
	x: 5,
	y: 5,
	id: pointId,
	title: 'test point',
	details: 'lalalal ',
	chronology: [],
	isFermenting: true
};

const pointsUpdateFixture = {
	x: 9,
	y: 5,
	id: pointId,
	title: 'test a',
	chronology: [],
	isFermenting: false
};

describe('Recipes store', () => {
	beforeEach(() => {
		recipes.set({});
	});
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('adds a recipe', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
	});

	it('adds a recipe and clear local storage', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		recipes.clearLocalState();
		expect(get(recipes)).toStrictEqual({});
	});

	it('deletes a recipe', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		recipes.remove(recipeId);
		expect(get(recipes)).toStrictEqual({});
	});

	it('update a recipe', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		recipes.update(recipeUpdateFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: { ...recipeFixture, ...recipeUpdateFixture } });
	});

	it('update a recipe name', () => {
		const newName = 'newname'
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		recipes.updateName(recipeId, newName);
		expect(get(recipes)).toStrictEqual({ [recipeId]: { ...recipeFixture, name: newName } });
	});

	it('get active recipe', () => {
		recipes.add(recipeFixture);
		recipes.add({ ...recipeFixture, id: 'active' });
		activeRecipeId.set('active')
		expect(get(currentRecipe)).toStrictEqual({ ...recipeFixture, id: 'active' });

	});


	it('duplicate a point', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		points.add(pointsFixture, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: { ...recipeFixture, points: [pointsFixture] }
		});
		points.duplicate(pointId, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: { ...recipeFixture, points: [pointsFixture, { ...pointsFixture, id: 'abc', x: undefined, y: undefined }] }
		});
	});

	it('adds a point', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		points.add(pointsFixture, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: { ...recipeFixture, points: [pointsFixture] }
		});
	});

	it('delete a point', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		points.add(pointsFixture, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: { ...recipeFixture, points: [pointsFixture] }
		});
		points.remove(pointId, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: { ...recipeFixture, points: [] }
		});
	});

	it('update a point', () => {
		recipes.add(recipeFixture);
		expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
		points.add(pointsFixture, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: { ...recipeFixture, points: [pointsFixture] }
		});
		points.update(pointsUpdateFixture, recipeId);
		expect(get(recipes)).toStrictEqual({
			[recipeId]: {
				...recipeFixture, points: [{ ...pointsFixture, ...pointsUpdateFixture }]
			}
		});
	});
});
