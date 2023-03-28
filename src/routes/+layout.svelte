<script>
	import { syncing } from '../stores/supabase';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { browser } from '$app/environment';
</script>

<header>
	<h1><a href="/">My fermentation Notes</a></h1>
	{#if $syncing.size !== 0}
		<div class="loader"><span>&#9632;</span> syncing</div>
	{/if}
</header>
<!-- limit this to client side rendering, behave a bit weirdly with ssr -->
<!-- Also not even sure SSRing this make sense -->
{#if browser}
	<div class="toasters">
		<SvelteToast target="loggedin" />
		<SvelteToast target="notloggedin" />
	</div>
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
		:hover {
			color: black;
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

	.toasters {
		--toastContainerTop: 0.5rem;
		--toastContainerRight: 0.5rem;
		--toastContainerBottom: auto;
		--toastContainerLeft: 0.5rem;
		--toastWidth: 100%;
		--toastMinHeight: 2rem;
		--toastPadding: 0 0.5rem;
		font-size: 0.875rem;
	}
	@media (min-width: 40rem) {
		.toasters {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 20rem);
			--toastWidth: 40rem;
		}
	}
</style>
