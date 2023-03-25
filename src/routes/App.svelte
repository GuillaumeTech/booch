<script lang="ts">
	import type { Point } from '../types/recipe';
	import RecipeChart from '../components/Recipe.svelte';
	import { recipes, activeRecipe, points } from '../stores/recipe';
	import Sidebar from '../components/Sidebar.svelte';

	let width: number, height: number;
</script>

<div class="app">
	<Sidebar />
	{#if $recipes && Object.keys($recipes).includes($activeRecipe)}
		<div class="scroll">
			<!-- Can't render it as long as we don't have width height -->
			<!-- fix ssr issue logically and seems on very first render  -->
			<!-- width height are undefined as well -->
			<div class="recipe" bind:clientWidth={width} bind:clientHeight={height}>
				{#if width && height}
					<RecipeChart
						name={$recipes[$activeRecipe]?.name}
						points={$recipes[$activeRecipe]?.points}
						axisNames={$recipes[$activeRecipe]?.axisNames}
						isPublic={$recipes[$activeRecipe]?.public}
					/>
				{/if}
			</div>
		</div>
	{:else}
		<div class="no-recipe">
			<h2 data-testid="pick-a-recipe">Select or create a recipe using the side bar</h2>
		</div>
	{/if}
</div>

<style lang="less">
	div.scroll {
		width: 100%;
		position: static;
		overflow-y: scroll;
	}
	div.recipe {
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
	.no-recipe {
		text-align: center;
		align-self: center;
		margin: auto;
	}
</style>
