<script>
	import { syncing } from '../stores/supabase';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { browser } from '$app/environment';
	import { displaySideBarResponsive } from '../stores/display';
	import Icon from '../components/Icon.svelte';
</script>

<!-- limit this to client side rendering, behave a bit weirdly with ssr -->
<!-- Also not even sure SSRing this make sense -->
{#if browser}
	<div class="toasters">
		<SvelteToast target="loggedin" />
		<SvelteToast target="notloggedin" />
	</div>
{/if}

<div class="border">
	<header>
		<h1>
			<button
				on:click={() => {
					displaySideBarResponsive.set(true);
				}}
			>
				<Icon name="menu" fill="white" strokeWidth={2} stroke="white" /></button
			><a href="/">My fermentation Notes</a>
		</h1>
		<!-- {#if $syncing.size !== 0} -->
		<div class="loader"><span>&#9632;</span></div>
		<!-- {/if} -->
	</header>
	<slot />
</div>

<style lang="less">
	.border {
		outline: red;
		border: salmon;
		border-style: solid;
		border-width: 3px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	@media screen and (min-width: 1500px) {
		.border {
			width: 1500px;
			margin: auto;
		}
	}

	header {
		background: salmon;
		color: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		h1 > a {
			color: white;
			text-decoration: none;
			padding: 0.3rem;
		}
	}
	h1 {
		display: flex;
		flex-direction: row;
		font-size: 1.5em;
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
	button {
		display: none;
	}
	@media screen and (max-width: 800px) {
		button {
			display: inline-block;
			font-size: 1.3rem;
			border: none;
			background: darkred;
		}
	}
	@media (min-width: 40rem) {
		.toasters {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 20rem);
			--toastWidth: 40rem;
		}
	}
</style>
