import { browser } from '$app/environment';
import type { AuthSession } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import type { Point, PointUpdate, Recipe, RecipeUpdate } from '../types/recipe';
import { activeSession, syncing } from './supabase'
import { supabase } from '../supabaseClient';
import { omit } from 'lodash'
const initActiveRecipe = browser && localStorage.activeRecipe && JSON.parse(localStorage.activeRecipe);

export const activeRecipe = writable<string>(initActiveRecipe ?? 'kom');

activeRecipe.subscribe((activeRecipeId) => {
    if (browser) {
        localStorage.activeRecipe = JSON.stringify(activeRecipeId)
    }
})


const initRecipes = browser && localStorage.recipes && JSON.parse(localStorage.recipes);

activeSession.subscribe(async (session) => {
    if (session && session.user) {
        try {
            const recipesFromSupabase = await loadRecipesFromSupabase()
            recipes.set(recipesFromSupabase)
        } catch (e) {
            console.log(e)
        }
    }
}
)

function reshapeFromSupabase(recipes: Array<Recipe>) {

    const reshaped = recipes.reduce((accumulator: Record<string, Recipe>, current: Recipe) => {

        return { ...accumulator, [current.id]: current }
    }, {})
    return reshaped
}

async function loadRecipesFromSupabase(): Promise<Record<string, Recipe>> {
    const { data, error } = await supabase
        .from('recipes')
        .select()
    if (error) {
        throw new Error(error.message)
    }

    return reshapeFromSupabase(data)

}




export const recipes = (() => {
    const { subscribe, set, update } = writable<Record<string, Recipe>>(initRecipes);


    function defaultUpdate(props: RecipeUpdate) {
        return (recipe: Recipe) => {
            return { ...recipe, ...props };
        };
    }

    async function createOnSupabase(recipeId: string, recipe: Recipe, orignalRecipes: Record<string, Recipe>) {
        syncing.add(recipeId)
        try {
            const { error } = await supabase
                .from('recipes')
                .insert([
                    recipe
                ])
            if (error) { // cancel the localstorage change
                console.log(error)
                update(() => {
                    return orignalRecipes
                });
            }
        } finally { // whatever happens this one isn't syncing anymore
            syncing.remove(recipeId)
        }



    }

    async function updateOnSupabase(recipeId: string, recipe: Recipe, orignalRecipe: Recipe) {
        syncing.add(recipeId)
        try {
            const { error } = await supabase
                .from('recipes')
                .update(recipe)
                .eq('id', recipeId)
            if (error) { // cancel the localstorage change
                update((recipes) => {
                    recipes[recipeId] = orignalRecipe
                    return recipes
                });
            }
        } finally { // whatever happens this one isn't syncing anymore
            syncing.remove(recipeId)
        }
    }

    async function deleteOnSupabase(recipeId: string, orignalRecipe: Recipe) {
        syncing.add(recipeId)
        try {
            const { error } = await supabase
                .from('recipes')
                .delete().eq('id', recipeId);
            if (error) { // cancel the localstorage change
                update((recipes) => {
                    recipes[recipeId] = orignalRecipe
                    return recipes
                });
            }
        } finally { // whatever happens this one isn't syncing anymore
            syncing.remove(recipeId)
        }
    }

    subscribe((recipes) => {
        if (browser && recipes) {
            localStorage.recipesLastUpdate = JSON.stringify(new Date())
            localStorage.recipes = JSON.stringify(recipes)
        }
    })

    function reusableUpdate(props: RecipeUpdate, fn = defaultUpdate(props)) {
        update((recipes) => {
            const orignalRecipe = recipes[props.id]
            recipes[props.id] = fn(recipes[props.id])
            updateOnSupabase(props.id, recipes[props.id], orignalRecipe)
            return recipes
        });
    }
    return {
        subscribe,
        set,
        add: (recipe: Recipe) => {
            update((recipes) => {
                const orignalRecipes = recipes
                recipes[recipe.id] = recipe;
                createOnSupabase(recipe.id, recipe, orignalRecipes)
                return recipes;

            });
        },
        remove: (recipeId: string) => {
            update((recipes) => {
                const orignalRecipe = recipes[recipeId]
                delete recipes[recipeId]
                deleteOnSupabase(recipeId, orignalRecipe)
                return recipes
            });
        },
        update: (props: RecipeUpdate, fn = defaultUpdate(props)) => {
            reusableUpdate(props, fn)
        },
        updateName: (recipeId: string, newName: string) => {
            reusableUpdate({ id: recipeId, name: newName })
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


