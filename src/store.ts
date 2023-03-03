import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Point, PointUpdate, Recipe, RecipeUpdate } from './types/recipe';



const initActiveRecipe = browser && localStorage.activeRecipe && JSON.parse(localStorage.activeRecipe);

export const activeRecipe = writable<string>(initActiveRecipe ?? 'kom');

activeRecipe.subscribe((activeRecipeId) => {
    if (browser) {
        localStorage.activeRecipe = JSON.stringify(activeRecipeId)
    }
})

const defaultValueRecipes: Record<string, Recipe> = {
    kom: {
        name: 'Kombucha',
        id: 'kom',
        points: [{
            id: 'a', x: 2, y: 8, title: 'Apple&Cranberries',
            details: 'Good one but not enough fermentaion'
        },
        {
            id: 'b', x: 6, y: 8, title: 'Orange',
            details: 'need a few more days, made with Ceylan tea'
        }],
        axisNames: { x: 'Dryness', y: 'Funk' }
    },
    bread: {
        name: 'Bread',
        id: 'bread',
        points: [{
            id: 'c', x: 4, y: 8, title: '10% Buckwheat 10% Complete',
            details: 'Not a lot of rising, 65% hydratation'
        },
        {
            id: 'd', x: 6, y: 7, title: '20% Complete Wheat',
            details: 'Good one but not enough fermentation'
        }],
        axisNames: { x: 'Tenderness', y: 'Funk' }
    }
};

const initRecipes = browser && localStorage.recipes && JSON.parse(localStorage.recipes);

export const recipes = (() => {
    const { subscribe, set, update } = writable<Record<string, Recipe>>(initRecipes ?? defaultValueRecipes);

    function defaultUpdate(props: RecipeUpdate) {
        return (recipe: Recipe) => {
            return { ...recipe, ...props };
        };
    }

    subscribe((recipes) => {
        if (browser) {
            localStorage.recipes = JSON.stringify(recipes)
        }
    })

    return {
        subscribe,
        set,
        add: (recipe: Recipe) => {
            update((recipes) => {
                recipes[recipe.id] = recipe;
                return recipes;
            });
        },
        remove: (recipeId: string) => {
            update((recipes) => {
                delete recipes[recipeId]
                return recipes
            });
        },
        updateName: (recipeId: string, newName: string) => {
            update((recipes) => {
                recipes[recipeId] = { ...recipes[recipeId], name: newName }
                return recipes
            });
        },
        update: (props: RecipeUpdate, fn = defaultUpdate(props)) => {
            update((recipes) => {
                recipes[props.id] = fn(recipes[props.id])
                return recipes
            });
        },
    };
})();




export const points = {
    add: (point: Point, recipeId: string) => {
        recipes.update({ id: recipeId }, addPointToRecipe(point));
    },
    remove: (pointId: string, recipeId: string) => {
        recipes.update({ id: recipeId }, removePointFromRecipe(pointId));
    },
    update: (pointUpdate: PointUpdate, recipeId: string) => {
        recipes.update({ id: recipeId }, updatePointFromRecipe(pointUpdate));
    },
};


function addPointToRecipe(point: Point) {
    return (recipe: Recipe) => {
        recipe.points.push(point);
        return recipe;
    };
}


function removePointFromRecipe(pointId: string) {
    return (recipe: Recipe) => {
        recipe.points = recipe.points.filter(({ id }) => id !== pointId)
        return recipe;
    };
}


function updatePointFromRecipe(pointUpdate: PointUpdate) {
    return (recipe: Recipe) => {
        recipe.points.map((point) => point.id == pointUpdate.id ? { ...point, ...pointUpdate } : point)
        return recipe;
    };
}


