
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { get } from "svelte/store";
import { recipes, points } from "./recipe";

const recipeId = '123'
const pointId = '456'

vi.mock('uuid', () => {
    return { v4: () => 'abc' }
})

const recipeFixture = {
    name: 'test',
    id: recipeId,
    points: [],
    axisNames: { x: "testX", y: 'testY' },
    public: false,
    created_at: new Date(),
    description: 'test test descript',
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

describe('Recipes store', () => {
    beforeEach(() => {
        recipes.set({})
    })
    afterEach(() => {
        vi.clearAllMocks()
    })

    it("adds a recipe", () => {
        recipes.add(recipeFixture)
        expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
    })

    it("adds a point", () => {
        recipes.add(recipeFixture)
        expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
        points.add(pointsFixture, recipeId)
        expect(get(recipes)).toStrictEqual({ [recipeId]: { ...recipeFixture, points: [pointsFixture] } });
    })

    it("duplicate a point", () => {
        recipes.add(recipeFixture)
        expect(get(recipes)).toStrictEqual({ [recipeId]: recipeFixture });
        points.add(pointsFixture, recipeId)
        expect(get(recipes)).toStrictEqual({ [recipeId]: { ...recipeFixture, points: [pointsFixture] } });
        points.duplicate(pointId, recipeId)
        expect(get(recipes)).toStrictEqual({ [recipeId]: { ...recipeFixture, points: [pointsFixture, { ...pointsFixture, id: 'abc' }] } });
    })
});
