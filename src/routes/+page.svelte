<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { v4 as uuidv4 } from 'uuid';
	import { Delaunay } from 'd3-delaunay';
	import Point from './Point.svelte';
	import Axis from './Axis.svelte';
	import Bg from './Bg.svelte';
	import Modal from './Modal.svelte';

	const margin = { top: 25, right: 25, bottom: 25, left: 25 };
	type Point = {
		x: number;
		y: number;
		id: string;
		title?: string;
		details?: string;
		date?: Date;
	};

	let addMode = false;
	let showModal = false;
	let points: Point[] = [
		{ id: 'a', x: 2, y: 8, title: 'truc', details: 'lorem ipsum dolor sit ament va consectetyr' },
		{ id: 'v', x: 9, y: 7 },
		{ id: 'vds', x: 3, y: 6 },
		{ id: 'vdds', x: 5, y: 8 },
		{ id: 'vddsa', x: 8.1, y: 8 }
	];

	let width: number, height: number;
	let picked: string | null = null,
		click = false;

	let showTooltip: boolean, tooltipX: number, tooltipY: number;

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
</script>

<div class="app">
	<ul>
		<li>test</li>
	</ul>

	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		<button
			on:click={() => {
				addMode = !addMode;
			}}
		>
			{addMode ? 'View' : 'Add'} mode</button
		>
		<Modal
			{showModal}
			onCancel={() => {
				showModal = false;
			}}
			onClose={() => {
				showModal = false;
			}}>test</Modal
		>
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<svg
			width="100%"
			height="100%"
			style={(function () {
				if (picked && !addMode) {
					return 'cursor: pointer';
				}
				if (addMode) {
					return 'cursor: crosshair';
				}
				return '';
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
						picked = point.id;
					} else {
						picked = null;
					}
				}
			}}
			on:mouseout={() => (picked = null)}
			on:mousedown={() => (click = true)}
			on:mouseup={(e) => (click = false)}
			on:click={({ offsetX, offsetY }) => {
				if (picked && !addMode) {
					const pointPicked = document.getElementById(picked);
					pointPicked?.dispatchEvent(new Event('click')); //trigger the popup
				} else if (addMode) {
					const x = PixelsToDomain(offsetX, abscissa);
					const y = PixelsToDomain(offsetY, ordinate);
					const id = uuidv4();
					showModal = true;
					// addToPoints({ x, y, id });
				}
			}}
		>
			<Axis {width} {height} type="x" name={'Funk'} scale={abscissa} tickNumber={10} {margin} />
			<Axis {width} {height} type="y" name={'Dryness'} scale={ordinate} tickNumber={10} {margin} />
			<!-- <Bg /> -->
			{#each points as { x, y, id, title, details, date } (id)}
				<Point
					x={abscissa(x)}
					y={ordinate(y)}
					fill="tomato"
					{id}
					r={id === picked && !click ? 6 : 4}
					stroke={id === picked ? '#000' : null}
					{title}
					{details}
					{date}
				/>
			{/each}
		</svg>
	</div>
</div>

<style>
	div.graph {
		width: min(65vw, 65vh);
		top: 50%;
		height: min(65vw, 65vh);
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
		min-height: 100%;
	}
</style>
