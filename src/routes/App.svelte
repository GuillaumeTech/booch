<script lang="ts">
	import type { Point } from '../types/recipe';
	import RecipeChart from '../components/Recipe.svelte';
	import { recipes, activeRecipe, points } from '../stores/recipe';
	import Sidebar from '../components/Sidebar.svelte';

	let width: number, height: number;

	function getAddToPoints(recipeId: string) {
		return function (point: Point): void {
			points.add(point, recipeId);
		};
	}
</script>

<div class="app">
	<Sidebar />
	{#if $recipes && Object.keys($recipes).includes($activeRecipe)}
		<div class="recipe">
			<!-- Can't render it as long as we don't have width height -->
			<!-- fix ssr issue logically and seems on very first render  -->
			<!-- width height are undefined as well -->
			<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
				{#if width && height}
					<RecipeChart
						{width}
						{height}
						onAddPoint={getAddToPoints($activeRecipe)}
						name={$recipes[$activeRecipe]?.name}
						points={$recipes[$activeRecipe]?.points}
						axisNames={$recipes[$activeRecipe]?.axisNames}
						isPublic={$recipes[$activeRecipe]?.public}
					/>
				{/if}
			</div>
		</div>
	{:else}
		<p>select a recipe</p>
	{/if}
</div>

<style lang="less">
	div.recipe {
		width: 100%;
		position: static;
		overflow-y: scroll;
	}
	div.graph {
		margin: auto;
		max-width: 90%;
		width: min(65vw, 65vh);
		height: min(65vw, 65vh);
		margin-top: 0;
	}

	.app {
		display: flex;
		min-height: calc(100% - 3rem - 2px);
	}
</style>
