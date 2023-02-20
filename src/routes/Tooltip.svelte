<script lang="ts">
	export let title = '',
		display = false,
		x: number,
		y: number;
</script>

{#if display}
	<div style="top: {y}px; left: {x}px;" class="tooltip">{title}</div>
{/if}

<style>
	.tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: fixed;
		z-index: 100;
	}
</style>
