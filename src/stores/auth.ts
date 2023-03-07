
import type { AuthSession } from '@supabase/supabase-js';
import { writable } from 'svelte/store';


export const activeSession = writable<AuthSession | null>(null);
