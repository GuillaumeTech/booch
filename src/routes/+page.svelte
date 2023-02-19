<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from 'svelte-canvas';
	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';
	import { Delaunay } from 'd3-delaunay';

	import Point from './Point.svelte';
	import Axis from './Axis.svelte';
	import Bg from './Bg.svelte';
	const margin = { top: 10, right: 10, bottom: 25, left: 25 };
	type point = {
		x: number;
		y: number;
		id: number;
	};

	let points: point[] = [
		{ id: 1, x: 1, y: 8 },
		{ id: 2, x: 9, y: 8 },
		{ id: 3, x: 8, y: 7.5 }
	];
	let width: number, height: number;
	let picked: number | null = null,
		click = false;

	$: abscissa = scaleLinear()
		.domain([0, 10])
		.range([margin.left, width - margin.right])
		.nice();
	$: ordinate = scaleLinear()
		.domain([0, 10])
		.range([height - margin.bottom, margin.top])
		.nice();
	$: delaunay = Delaunay.from(
		points,
		(d: point) => abscissa(d.x),
		(d: point) => ordinate(d.y)
	);
</script>

<div class="app">
	<ul>
		<li>test</li>
	</ul>
	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		<Canvas
			{width}
			{height}
			style="cursor: pointer"
			on:mousemove={({ layerX, layerY }) => {
				const index = delaunay.find(layerX, layerY);
				if (Number.isInteger(index) && index >= 0) {
					picked = points[index].id;
				}
			}}
			on:mouseout={() => (picked = null)}
			on:mousedown={() => (click = true)}
			on:mouseup={() => (click = false)}
		>
			<Axis type="x" scale={abscissa} tickNumber={10} {margin} />
			<Axis type="y" scale={ordinate} tickNumber={10} {margin} />
			<Bg />
			{#each points as { x, y, id } (id)}
				<Point
					x={abscissa(x)}
					y={ordinate(y)}
					fill="tomato"
					r={id === picked && !click ? 5 : 3}
					stroke={id === picked ? '#000' : null}
				/>
			{/each}
		</Canvas>
	</div>
</div>

<style>
	div.graph {
		width: 65%;
		top: 50%;
		margin-left: 5rem;
		margin-top: 5rem;
	}
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		width: 25%;
		background-color: #f1f1f1;
		height: 100%;
		overflow: auto;
	}
	.app {
		display: flex;
	}
</style>
