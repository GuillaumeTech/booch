<script lang="ts">
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { v4 as uuidv4 } from 'uuid';
	import { Delaunay } from 'd3-delaunay';
	import Entry from './Entry.svelte';
	import Axis from './Axis.svelte';
	import Modal from './Modal.svelte';
	import { writable } from 'svelte/store';
	import type { NewPoint, Point } from '../types/recipe';
	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import EntryDetails from './EntryDetails.svelte';
	import type { Margin } from '../types/layout';
	export let width: number,
		height: number,
		onAddPoint: Function,
		name: string,
		points: Point[] = [];

	const margin: Margin = { top: 50, right: 25, bottom: 50, left: 30 };

	const emptyNewPoint: NewPoint = { title: '', details: '' };
	let newPoint = writable(emptyNewPoint);

	let addMode = false;
	let showModal = false;
	let pointPicked: Point | undefined;
	let nearestPoint: Point | null = null,
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

	function resetPickedPoint() {
		pointPicked = undefined;
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
		if (nearestPoint && !addMode) {
			return 'cursor: pointer';
		}
		if (addMode) {
			return 'cursor: crosshair';
		}
		return '';
	})()}
	on:mousemove={({ offsetX, offsetY }) => {
		const index = delaunay.find(offsetX, offsetY);
		if (Number.isInteger(index) && index >= 0 && !addMode) {
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
		if (nearestPoint && !addMode) {
			const elementPicked = document.getElementById(nearestPoint.id);
			pointPicked = points.find((point) => point.id === nearestPoint.id);
			elementPicked?.dispatchEvent(new Event('mouseenter')); //trigger the popup
		} else if (addMode) {
			const x = PixelsToDomain(offsetX, abscissa).toFixed(2);
			const y = PixelsToDomain(offsetY, ordinate).toFixed(2);
			const id = uuidv4();

			showModal = true;
			newPoint.set({ x, y, id });
			addMode = false;
		} else if (!nearestPoint) {
			pointPicked = undefined;
		}
	}}
>
	<Axis {width} {height} type="x" name={'Funk'} scale={abscissa} tickNumber={10} {margin} />
	<Axis {width} {height} type="y" name={'Dryness'} scale={ordinate} tickNumber={10} {margin} />
	<!-- <Bg /> -->
	{#each points as { x, y, id, title } (id)}
		<Entry
			x={abscissa(x)}
			y={ordinate(y)}
			{id}
			fill={id === pointPicked?.id ? 'aquamarine' : 'salmon'}
			r={(id === nearestPoint?.id && !click) || id === pointPicked?.id ? 6 : 4}
			stroke={id === nearestPoint?.id || id === pointPicked?.id ? '#000' : null}
			showTooltip={id === nearestPoint?.id}
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
	<EntryDetails {pointPicked} {resetPickedPoint} />
{/if}
