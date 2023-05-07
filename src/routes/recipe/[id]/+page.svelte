<script lang="ts">
	import { page } from '$app/stores';
	import RecipeChart from '$lib/components/RecipeChart.svelte';

	let width: number, height: number;

	const name = $page.data.recipe.name;
	const description = $page.data.recipe?.description;
	const points = $page.data.recipe.points;
	const axisNames = $page.data.recipe.axisNames;

	$: pointsFermented = points.filter(
		({ isFermenting, x, y }) => {
			if (isFermenting !== undefined) {
				return !isFermenting && x !== 'NaN' && y !== 'NaN';
			} else {
				return x !== 'NaN' && y !== 'NaN';
			}
		}
		// the check on x and y is for retro compatibility nad also prevent freeze when x & y would be Nan
	);
</script>

<div class="recipe">
	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		<div class="recipe-header">
			<h2>{name}</h2>
		</div>

		{#if description}
			<p class="description">{description}</p>
		{/if}
		{#if width && height}
			<RecipeChart {width} {height} points={pointsFermented} {axisNames} readOnly />
		{/if}
	</div>
</div>

<style lang="less">
	.recipe-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		h2 {
			font-family: 'Inter';
			font-weight: 800;
			white-space: nowrap;
			margin-top: 2rem;
			text-overflow: ellipsis;
			flex-wrap: wrap;
			overflow: hidden;
		}
	}
	div.recipe {
		width: 100%;
		height: 100%;
		position: static;
		overflow-y: auto;
	}
	div.graph {
		margin: auto;
		max-width: 90%;
		width: 65vmin;
		height: 65vmin;
		margin-top: 0;
		@media screen and (max-width: 800px) {
			width: 90vmin;
			height: 90vmin;
		}
	}
</style>
