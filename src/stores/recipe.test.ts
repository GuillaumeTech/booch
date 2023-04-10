
import { beforeEach, describe, expect, it } from 'vitest';

import { get } from "svelte/store";
import { recipes } from "./recipe";


describe('Recipes store', () => {
    beforeEach(() => {
        recipes.set({})
    })


    it("adds a recipe", () => {
        recipes.add({ id: '123' })
        expect(get(recipes)).toEqual({ id: 'test' });
    })


});
