<script lang="ts">
	import App from './App.svelte';

	import { onMount } from 'svelte';
	import { supabase } from '../supabaseClient';
	import type { AuthSession } from '@supabase/supabase-js';
	import { activeSession } from '../stores/auth';

	let session: AuthSession | null;
	onMount(() => {
		supabase.auth.getSession().then(({ data }) => {
			session = data.session;
			console.log(session);

			activeSession.set(session);
		});
		supabase.auth.onAuthStateChange((_event, _session) => {
			session = _session;
			console.log(session);

			activeSession.set(session);
		});
	});
</script>

<App />
