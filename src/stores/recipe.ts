import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';
import type { Point, PointUpdate, Recipe, RecipeUpdate } from '../types/recipe';
import { activeSession, firstLogin, syncing } from './supabase'
import { supabase } from '../supabaseClient';
import { toast } from '@zerodevx/svelte-toast'
import { error, info } from '../lib/toasters';
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
            // there is no clear way to know when first login happen from supabase so we use a store
            // it's a bit hackish
            const isFirstLogin = get(firstLogin);
            if (!isFirstLogin) { // on first login we send what was in local storage to supabase so we don't want this sync
                const recipesFromSupabase = await loadRecipesFromSupabase()
                recipes.set(recipesFromSupabase)
            } else {
                firstLogin.set(false);
            }
            toast.pop({ target: 'notloggedin' })
        } catch (e) {
        }
    } else {
        // not sure about this yet it's a bit weird
        // info('We recommend you to create an account, if you plan to use this app seriouly !', { target: 'notloggedin' })
    }
}
)

function ArrayFromObject(recipes: Array<Recipe>) {

    const reshaped = recipes.reduce((accumulator: Record<string, Recipe>, current: Recipe) => {

        return { ...accumulator, [current.id]: current }
    }, {})
    return reshaped
}


function objectToArray(recipes: Record<string, Recipe>) {

    const reshaped = Object.values(recipes).reduce((accumulator: Array<Recipe>, current: Recipe) => {

        return [...accumulator, current]
    }, [])
    return reshaped
}

async function loadRecipesFromSupabase(): Promise<Record<string, Recipe>> {
    const { data, error } = await supabase
        .from('recipes')
        .select()
    if (error) {
        throw new Error(error.message)
    }

    return ArrayFromObject(data)

}




export const recipes = (() => {
    const { subscribe, set, update } = writable<Record<string, Recipe>>(initRecipes || {});


    function defaultUpdate(props: RecipeUpdate) {
        return (recipe: Recipe) => {
            return { ...recipe, ...props };
        };
    }

    // generic try block for all supabseOperation + sync indicator
    async function supabaseOperation(operation: () => Promise<void>, onId: string) {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
            syncing.add(onId)
            try {
                await operation()
            } catch {
                error('Sorry, the changes could not be saved', { target: 'loggedin' })
            } finally { // whatever happens this one isn't syncing anymore
                syncing.remove(onId)
            }
        }

    }
    async function createOnSupabase(recipeId: string, recipe: Recipe, orignalRecipes: Record<string, Recipe>) {
        supabaseOperation(async () => {
            const { error } = await supabase
                .from('recipes')
                .insert([
                    recipe
                ])
            if (error) { // cancel the localstorage change
                update(() => {
                    return orignalRecipes
                });
            }
        }, recipeId)

    }
    // this is only used at account create so there is no change to cancel locally
    async function bulkInsertOnSupabase(recipes: Recipe[]) {
        supabaseOperation(async () => {
            const { error } = await supabase
                .from('recipes')
                .insert(
                    recipes
                )
        }, 'multiple') // this is supposed to be a recipe id for the syning indicator, 
        // we use multiple instead here, as we're syncing multiples recipes

    }

    async function updateOnSupabase(recipeId: string, recipe: Recipe, orignalRecipe: Recipe) {
        supabaseOperation(async () => {
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

        }, recipeId)
    }

    async function deleteOnSupabase(recipeId: string, orignalRecipe: Recipe) {
        supabaseOperation(async () => {
            const { error } = await supabase
                .from('recipes')
                .delete().eq('id', recipeId);
            if (error) { // cancel the localstorage change
                update((recipes) => {
                    recipes[recipeId] = orignalRecipe
                    return recipes
                });
            }

        }, recipeId)
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
        sendLocalStorageToSupabase: () => {
            if (browser && localStorage.recipes) {
                const recipesToInsert = objectToArray(JSON.parse(localStorage.recipes))
                bulkInsertOnSupabase(recipesToInsert)
            }
        }
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

export const currentPoints = derived([recipes, activeRecipe], ([$recipes, $activeRecipe]) => {
    return $recipes?.[$activeRecipe]?.points
}
)


function addPointToRecipe(point: Point) {
    return (recipe: Recipe) => {
        recipe.points.push({ ...point, tasted_at: new Date() });
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
        recipe.points = recipe.points.map((point) => point.id == pointUpdate.id ? { ...point, ...pointUpdate } : point)
        return recipe;
    };
}


