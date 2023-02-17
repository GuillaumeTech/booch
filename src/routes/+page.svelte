<script>
	import { onMount } from 'svelte';
	import { Canvas } from 'svelte-canvas';
	import { extent } from 'd3-array';
	import { scaleLinear } from 'd3-scale';
	import { Delaunay } from 'd3-delaunay';

	import Point from './Point.svelte';
	import Axis from './Axis.svelte';
	import Bg from './Bg.svelte';
	const margin = { top: 10, right: 10, bottom: 25, left: 25 };

	let points = [
		{ x: 6, y: 8 },
		{ x: 9, y: 8 }
	];
	let width, height;
	let picked,
		click = false;

	// onMount(() =>
	// 	fetch('https://raw.githubusercontent.com/vega/vega/master/docs/data/cars.json')
	// 		.then((data) => data.json())
	// 		.then((data) => {
	// 			points = data
	// 				.map((d, id) => ({ mpg: d.Miles_per_Gallon, hp: d.Horsepower, id }))
	// 				.filter((d) => d.mpg && d.hp);
	// 		})
	// );

	$: abscissa = scaleLinear()
		.domain([0, 10])
		.range([margin.left, width - margin.right])
		.nice();

	$: ordinate = scaleLinear()
		.domain([0, 10])
		.range([height - margin.bottom, margin.top])
		.nice();
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
			on:mousedown={() => (click = true)}
			on:mouseup={() => (click = false)}
			on:mouseout={() => (picked = null)}
		>
			<Axis type="x" scale={abscissa} tickNumber={8} {margin} />
			<Axis type="y" scale={ordinate} tickNumber={10} {margin} />
			<Bg />
			{#each points as { x, y }}
				<Point x={abscissa(x)} y={ordinate(y)} fill="tomato" r="5" />
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
