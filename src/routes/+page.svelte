<script lang="ts">
	import { onMount } from 'svelte';
	import { Canvas } from 'svelte-canvas';
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { v4 as uuidv4 } from 'uuid';
	import { Delaunay } from 'd3-delaunay';
	import Point from './Point.svelte';
	import Axis from './Axis.svelte';
	import Bg from './Bg.svelte';
	import { Layer } from 'svelte-canvas';

	const margin = { top: 10, right: 10, bottom: 25, left: 25 };
	type Point = {
		x: number;
		y: number;
		id: string;
	};

	let points: Point[] = [
		{ id: 'a', x: 2, y: 8 },
		{ id: 'v', x: 9, y: 7 },
		{ id: 'vds', x: 3, y: 6 },
		{ id: 'vdds', x: 5, y: 8 },
		{ id: 'vddsa', x: 8.1, y: 8 }
	];
	let width: number, height: number;
	let picked: string | null = null,
		click = false;

	function computeDistance(xa: number, ya: number, xb: number, yb: number): number {
		return Math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2);
	}

	function PixelsToDomain(valuePix: number, scale: ScaleLinear<any, any>): number {
		return scale.invert(valuePix);
	}

	function addToPoints(point: Point): void {
		points = [...points, point];
	}

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
		(d: Point) => abscissa(d.x),
		(d: Point) => ordinate(d.y)
	);

	$: render = ({ context, width, height }) => {
		delaunay.voronoi().render(context);
		delaunay.renderHull(context);

		context.stroke();
	};
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
					const point = points[index];
					const distance = computeDistance(
						PixelsToDomain(layerX, abscissa),
						PixelsToDomain(layerY, ordinate),
						point.x,
						point.y
					);
					if (distance < 0.3) {
						picked = point.id;
					} else {
						picked = null;
					}
				}
			}}
			on:mouseout={() => (picked = null)}
			on:mousedown={() => (click = true)}
			on:mouseup={() => (click = false)}
			on:click={({ layerX, layerY }) => {
				const x = PixelsToDomain(layerX, abscissa);
				const y = PixelsToDomain(layerY, ordinate);
				const id = uuidv4();
				addToPoints({ x, y, id });
			}}
		>
			<!-- <Layer {render} /> -->

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
