<script lang="ts">
	import type { ScaleLinear } from 'd3-scale';
	export let scale: ScaleLinear<any, any>,
		tickSize = 4,
		margin,
		tickNumber = 10,
		type = 'x',
		name = '',
		width: number,
		height: number;
	const isX = type === 'x';
	$: ticks = scale.ticks(tickNumber);
</script>

{#each ticks as tick}
	{#if isX}
		<line
			x1={scale(tick)}
			y1={height / 2}
			x2={scale(tick)}
			y2={height / 2 + tickSize}
			stroke="black"
		/>
		<text x={scale(tick) - 5} y={height / 2 - 5}>{tick}</text>
	{:else}
		<line
			x1={width / 2}
			y1={scale(tick)}
			x2={width / 2 - tickSize}
			y2={scale(tick)}
			stroke="black"
		/>
		<text x={width / 2 + 10} y={scale(tick) + 5}>{tick}</text>
	{/if}
{/each}

{#if isX}
	<text x={width - 50} y={height / 2 + 20}>{name}</text>
{:else}
	<text x={width / 2 - 65} y={27}>{name}</text>
{/if}
