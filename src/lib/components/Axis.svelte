<script lang="ts">
	import type { ScaleLinear } from 'd3-scale';
	import type { Margin } from '../../types/layout';
	export let scale: ScaleLinear<any, any>,
		margin: Margin,
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
			y1={height - margin.bottom}
			x2={scale(tick)}
			y2={margin.top}
			stroke="#888"
			stroke-dasharray="3"
		/>
		<text x={scale(tick) - 5} y={height - 25}>{tick}</text>
	{:else}
		<line
			x1={margin.left}
			y1={scale(tick)}
			x2={width - margin.right}
			y2={scale(tick)}
			stroke="#888"
			stroke-dasharray="3"
		/>
		<text x={5} y={scale(tick) + 5}>{tick}</text>
	{/if}
{/each}

{#if isX}
	<text data-testid="x-axis" font-size="1.1rem" text-anchor="end" x={width - 15} y={height - 5}
		>{name}</text
	>
{:else}
	<text data-testid="y-axis" font-size="1.1rem" text-anchor="start" x={5} y={30}>{name}</text>
{/if}
