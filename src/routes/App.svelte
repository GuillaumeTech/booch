<script lang="ts">
	import Recipe from '$lib/components/Recipe.svelte';
	import { recipes, activeRecipeId, currentRecipe } from '../stores/recipe';

	import Sidebar from '$lib/components/Sidebar.svelte';

	let width: number, height: number;
</script>

<div class="app">
	<Sidebar />

	{#if $recipes && Object.keys($recipes).includes($activeRecipeId)}
		<div class="scroll">
			<!-- Can't render it as long as we don't have width height -->
			<!-- fix ssr issue logically and seems on very first render  -->
			<!-- width height are undefined as well -->
			<div class="recipe" bind:clientWidth={width} bind:clientHeight={height}>
				{#if width && height}
					<Recipe
						name={$currentRecipe?.name}
						points={$currentRecipe?.points}
						axisNames={$currentRecipe?.axisNames}
						isPublic={$currentRecipe?.public}
						description={$currentRecipe?.description}
					/>
				{/if}
			</div>
		</div>
	{:else}
		<div class="no-recipe">
			<h2 data-testid="pick-a-recipe">
				Select or create a recipe using the side bar, You can also check out <a href="/help">help</a
				> if your are lost
			</h2>
		</div>
	{/if}
</div>

<style lang="less">
	div.scroll {
		width: 100%;
		position: static;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}
	div.recipe {
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

	.app {
		display: flex;
		height: 100%;
	}
	.no-recipe {
		text-align: center;
		align-self: center;
		margin: 5rem;
	}
</style>
