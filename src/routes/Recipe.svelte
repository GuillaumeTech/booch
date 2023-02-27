<script lang="ts">
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { v4 as uuidv4 } from 'uuid';
	import { Delaunay } from 'd3-delaunay';
	import Entry from './Entry.svelte';
	import Axis from './Axis.svelte';
	import Modal from './Modal.svelte';
	import { writable } from 'svelte/store';
	import type { NewPoint, Point } from '../types/recipe';
	import { fade, fly } from 'svelte/transition';

	export let width: number, height: number, onAddPoint: Function, name: string, points: Point[];

	const margin = { top: 25, right: 25, bottom: 25, left: 25 };

	const emptyNewPoint: NewPoint = { title: '', details: '' };
	let newPoint = writable(emptyNewPoint);

	let addMode = false;
	let showModal = false;
	let showTable = false;

	let picked: string | null = null,
		click = false;

	function computeDistance(xa: number, ya: number, xb: number, yb: number): number {
		return Math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2);
	}

	function resetNewPoint() {
		newPoint.set(emptyNewPoint);
	}

	function PixelsToDomain(valuePix: number, scale: ScaleLinear<any, any>): number {
		return scale.invert(valuePix);
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

<h1>{name}</h1>
<button
	on:click={() => {
		addMode = !addMode;
	}}
>
	{addMode ? 'Cancel' : 'New entry'}</button
>
<Modal
	{showModal}
	onCancel={() => {
		showModal = false;
		resetNewPoint();
	}}
	onClose={() => {
		showModal = false;
		onAddPoint($newPoint);
		resetNewPoint();
	}}
>
	<form class="content">
		<label>Title</label>
		<input type="text" bind:value={$newPoint.title} />
		<label>Details</label>
		<textarea bind:value={$newPoint.details} />
	</form>
</Modal>
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
			const x = PixelsToDomain(offsetX, abscissa).toFixed(2);
			const y = PixelsToDomain(offsetY, ordinate).toFixed(2);
			const id = uuidv4();

			showModal = true;
			newPoint.set({ x, y, id });
			addMode = false;
		}
	}}
>
	<Axis {width} {height} type="x" name={'Funk'} scale={abscissa} tickNumber={10} {margin} />
	<Axis {width} {height} type="y" name={'Dryness'} scale={ordinate} tickNumber={10} {margin} />
	<!-- <Bg /> -->
	{#each points as { x, y, id, title, details, date } (id)}
		<Entry
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
<button
	on:click={() => {
		showTable = !showTable;
	}}>{showTable ? 'Hide' : 'Show'} underlying table</button
>
{#if showTable}
	<table in:fly={{ y: 100, duration: 500 }} out:fade>
		<tr>
			<th>Title</th>
			<th>Details</th>
			<th>Funk</th>
			<th>Dryness</th>
		</tr>
		{#each points as { x, y, id, title, details, date } (id)}
			<tr>
				<td><input bind:value={title} />{title ?? ''}</td>
				<td>{details ?? ''}</td>
				<td>{x}</td>
				<td>{y}</td>
			</tr>
		{/each}
	</table>
{/if}

<style>
	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
	}

	td,
	th {
		border: 1px solid #dddddd;
		text-align: left;
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: #dddddd;
	}
</style>
