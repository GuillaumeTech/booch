<script lang="ts">
	import { page } from '$app/stores';
	import ReadOnlyRecipe from '../../../components/ReadOnlyRecipe.svelte';

	let width: number, height: number;

	const name = $page.data.recipe.name;
	const points = $page.data.recipe.points;
	const axisNames = $page.data.recipe.axisNames;
</script>

<div class="recipe">
	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		{#if width && height}
			<ReadOnlyRecipe {width} {height} {name} {points} {axisNames} />
		{/if}
	</div>
</div>

<style>
	div.recipe {
		width: 100%;
		position: static;
		overflow-y: scroll;
		min-height: calc(100% - 3rem - 6px);
	}
	div.graph {
		margin: auto;
		max-width: 90%;
		width: min(65vw, 65vh);
		height: min(65vw, 65vh);
		margin-top: 0;
	}
</style>
