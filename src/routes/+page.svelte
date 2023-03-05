<script lang="ts">
	import App from './App.svelte';

	import { onMount } from 'svelte';
	import { supabase } from '../supabaseClient';
	import type { AuthSession } from '@supabase/supabase-js';
	import Auth from '../components/Auth.svelte';
	let session: AuthSession | null;
	onMount(() => {
		supabase.auth.getSession().then(({ data }) => {
			session = data.session;
		});
		supabase.auth.onAuthStateChange((_event, _session) => {
			session = _session;
		});
	});
</script>

{#if !session}
	<Auth />
{:else}
	<App {session} />
{/if}
