<script>
	import { syncing } from '../stores/supabase';
</script>

<header>
	<h1>Fermentation Notes</h1>
	{#if $syncing.size !== 0}
		<div class="loader"><span>&#9632;</span> syncing</div>
	{/if}
</header>

<slot />

<style>
	header {
		background: salmon;
		color: white;
		padding: 0.4rem 0.7rem 0.4rem 0.7rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
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
