<script lang="ts">
	import App from './App.svelte';

	import { page } from '$app/stores';
	import Auth from '../components/Auth.svelte';
</script>

<svelte:head>
	<title>Supabase + SvelteKit</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<Auth />
{:else}
	<App session={$page.data.session} />
{/if}
