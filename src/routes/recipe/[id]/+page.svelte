<script lang="ts">
	import { page } from '$app/stores';
	import ReadOnlyRecipe from '../../../components/ReadOnlyRecipe.svelte';

	let width: number, height: number;
</script>

<div>
	{JSON.stringify($page, null, 2)}
	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		{#if width && height}
			<ReadOnlyRecipe
				{width}
				{height}
				name={'name'}
				points={[]}
				axisNames={{ x: 'test', y: 'tea' }}
			/>
		{/if}
	</div>
</div>

<style>
	div.graph {
		margin: auto;
		max-width: 90%;
		width: min(65vw, 65vh);
		height: min(65vw, 65vh);
		margin-top: 0;
	}
</style>
