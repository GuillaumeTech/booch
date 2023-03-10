
import type { AuthSession } from '@supabase/supabase-js';
import { writable } from 'svelte/store';


export const activeSession = writable<AuthSession | null>(null);




export const syncing = (() => {
    const { subscribe, set, update } = writable<Set<string>>(new Set());


    return {
        subscribe,
        // similar api to the Set but avoid subscribtion to reach the underlying Set Object
        add: (toAdd: string) => {
            update((syncing) => { return syncing.add(toAdd) })
        },
        remove: (toDelete: string) => {
            update((syncing) => {
                const newSet = syncing
                newSet.delete(toDelete)
                return newSet
            })
        },
        reset: () => set(new Set())
    };

})()
