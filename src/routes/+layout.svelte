<script>
	import { syncing } from '../stores/supabase';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { browser } from '$app/environment';
</script>

<header>
	<h1><a href="/">Fermentation Notes</a></h1>
	{#if $syncing.size !== 0}
		<div class="loader"><span>&#9632;</span> syncing</div>
	{/if}
</header>
{#if browser}
	<SvelteToast target="loggedin" />
	<SvelteToast target="notloggedin" />
{/if}

<slot />

<style lang="less">
	header {
		background: salmon;
		color: white;
		padding: 0.4rem 0.7rem 0.4rem 0.7rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		h1 > a {
			color: white;
			text-decoration: none;
		}
	}
	h1 {
		font-size: 2em;
		padding: 0;
		margin: 0;
		font-weight: normal;
		width: fit-content;
		transform: rotate(-1deg);
		:hover {
			color: midnightblue;
		}
	}
	span {
		font-size: 1.2rem;
		animation: blink 0.5s ease-in-out infinite;
	}

	@keyframes blink {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
