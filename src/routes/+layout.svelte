<script>
	import { syncing } from '../stores/supabase';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { browser } from '$app/environment';
	import { displaySideBarResponsive } from '../stores/display';
	import Icon from '$lib/components/Icon.svelte';
	import { page } from '$app/stores';
</script>

<!-- limit this to client side rendering, behave a bit weirdly with ssr -->
<!-- Also not even sure SSRing this make sense -->
{#if browser}
	<div class="toasters">
		<SvelteToast target="loggedin" />
		<SvelteToast target="notloggedin" />
	</div>
{/if}
<div class="app">
	<header>
		<h1>
			<!-- don't display sidebar button on anything expext app route -->
			{#if $page.route.id == '/'}
				<button
					on:click={() => {
						displaySideBarResponsive.set(true);
					}}
				>
					<Icon name="menu" fill="white" strokeWidth={2} stroke="white" />
				</button>
			{/if}

			<a href="/">my fermentation notes</a>
		</h1>
		{#if $syncing.size !== 0}
			<div class="loader"><span class="text">Syncing</span><span> &#9632;</span></div>
		{/if}
	</header>
	<div class="border">
		<slot />
	</div>
</div>

<style lang="less">
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.border {
		outline: red;
		border: var(--main-color);
		border-style: solid;
		border-width: 3px;
		display: flex;
		flex-direction: column;
		flex-grow: 2;
	}

	@media screen and (min-width: 1500px) {
		.app {
			width: 1500px;
			margin: auto;
		}
	}

	header {
		color: var(--main-color);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		h1 > a {
			color: var(--main-color);
			text-decoration: none;
			padding: 0.3rem;
		}
	}
	h1 {
		display: flex;
		flex-direction: row;
		font-size: 1em;
		padding: 0;
		margin: 0;
		font-weight: normal;

		width: fit-content;
		:hover {
			color: black;
		}
	}
	.loader {
		animation: blink 0.5s ease-in-out infinite;

		span.text {
			font-size: 1.2rem;
			font-size: 0.9rem;
			margin-right: 0.7rem;
		}
		span {
			font-size: 1.2rem;

			margin-right: 1rem;
		}
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
	button {
		display: none;
	}
	@media screen and (max-width: 800px) {
		button {
			display: inline-block;
			font-size: 1.3rem;
			border: none;
			background: var(--main-color);
		}
	}
	@media (min-width: 40rem) {
		.toasters {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 20rem);
			--toastWidth: 40rem;
		}
	}

	:root {
		--main-color: #ff6500;
		--accent-color: #0dd66f;
	}
</style>
