<!-- This is really similar to the Recipe.svelte but avoid if(s) everywhere for readonly
probably better to refactor recipe so readonly is easy but this is quicker, will see later if refactor neeeded-->
<script lang="ts">
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { Delaunay } from 'd3-delaunay';
	import Entry from './Entry.svelte';
	import Axis from './Axis.svelte';
	import type { Point } from '../types/recipe';
	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import EntryDetails from './EntryDetails.svelte';
	import type { Margin } from '../types/layout';

	export let width: number,
		height: number,
		name: string,
		points: Point[] = [],
		axisNames: {
			x: string;
			y: string;
		};

	const margin: Margin = { top: 50, right: 25, bottom: 50, left: 30 };

	let pointPicked: Point | undefined;
	let nearestPoint: Point | null = null,
		click = false;

	function computeDistance(xa: number, ya: number, xb: number, yb: number): number {
		return Math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2);
	}

	function PixelsToDomain(valuePix: number, scale: ScaleLinear<any, any>): number {
		return scale.invert(valuePix);
	}
	function resetPickedPoint() {
		pointPicked = undefined;
	}

	$: abscissa = scaleLinear()
		.domain([0, 10])
		.range([margin.left, width - margin.right])
		.clamp(true)
		.nice();
	$: ordinate = scaleLinear()
		.domain([0, 10])
		.range([height - margin.bottom, margin.top])
		.clamp(true)
		.nice();

	$: delaunay = Delaunay.from(
		points,
		(d: Point) => abscissa(d.x),
		(d: Point) => ordinate(d.y)
	);
</script>

<div class="recipe-header">
	<h2>{name}</h2>
</div>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
	width="100%"
	height="100%"
	style={(function () {
		if (nearestPoint) {
			return 'cursor: pointer';
		}
	})()}
	on:mousemove={({ offsetX, offsetY }) => {
		const index = delaunay.find(offsetX, offsetY);
		if (Number.isInteger(index) && index >= 0) {
			const point = points[index];
			const distance = computeDistance(
				PixelsToDomain(offsetX, abscissa),
				PixelsToDomain(offsetY, ordinate),
				point.x,
				point.y
			);
			if (distance < 0.3) {
				nearestPoint = point;
			} else {
				nearestPoint = null;
			}
		}
	}}
	on:mouseout={() => (nearestPoint = null)}
	on:mousedown={() => (click = true)}
	on:mouseup={(e) => (click = false)}
	on:click={({ offsetX, offsetY }) => {
		if (nearestPoint) {
			const elementPicked = document.getElementById(nearestPoint.id);
			pointPicked = points.find((point) => point.id === nearestPoint.id);
			elementPicked?.dispatchEvent(new Event('mouseenter')); //trigger the popup
		} else {
			pointPicked = undefined;
		}
	}}
>
	<Axis {width} {height} type="x" name={axisNames.x} scale={abscissa} tickNumber={10} {margin} />
	<Axis {width} {height} type="y" name={axisNames.y} scale={ordinate} tickNumber={10} {margin} />
	<!-- <Bg /> -->
	{#each points as { x, y, id, title } (id)}
		<Entry
			x={abscissa(x)}
			y={ordinate(y)}
			{id}
			fill={id === pointPicked?.id ? 'aquamarine' : 'salmon'}
			r={(id === nearestPoint?.id && !click) || id === pointPicked?.id ? 6 : 4}
			stroke={id === nearestPoint?.id || id === pointPicked?.id ? '#000' : null}
			{title}
		/>
	{/each}
	{#if nearestPoint}
		<text
			transition:fade={{ duration: 300, easing: quadOut }}
			text-anchor="middle"
			x={abscissa(nearestPoint.x)}
			y={ordinate(nearestPoint.y) - 10}>{nearestPoint.title}</text
		>
	{/if}
</svg>

{#if pointPicked}
	<EntryDetails readOnly={true} {pointPicked} {resetPickedPoint} />
{/if}

<style lang="less">
	.recipe-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.add-entry {
		float: right;
		margin-right: 25px;
		font-size: 1rem;
		&.adding {
			color: white;
			background-color: black;
			border: 2px solid black;
			&:hover {
				border: 2px solid salmon;
			}
		}
	}
	.public-button {
		margin-top: 1rem;
		font-size: 1rem;

		&:hover {
			border: 2px solid salmon;
		}
	}
</style>
