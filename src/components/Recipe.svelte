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
	import { recipes, activeRecipe } from '../stores/recipe';
	import { flip } from 'svelte/animate';
	import { activeSession } from '../stores/supabase';

	export let width: number,
		height: number,
		onAddPoint: Function,
		name: string,
		points: Point[] = [],
		isPublic: Boolean = false,
		axisNames: {
			x: string;
			y: string;
		};

	const margin: Margin = { top: 50, right: 25, bottom: 50, left: 30 };

	const emptyNewPoint: NewPoint = { title: '', details: '' };
	let newPoint = writable(emptyNewPoint);
	let fermenting = ['test', 'truc'];
	let addMode = false;
	let editingAxes = false;
	$: editableAxisNames = writable(axisNames);

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

	function dragStart(event) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the basket from which it is leaving.
		const data = { test: 'tututu' };
		event.dataTransfer.setData('text/plain', JSON.stringify(data));
	}

	function drop(event) {
		event.preventDefault();
		const json = event.dataTransfer.getData('text/plain');
		console.log(json);
		console.log('hehe', event);
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

<div>
	{#if $activeSession}
		<button
			on:click={() => {
				recipes.update({ id: $activeRecipe, public: !isPublic });
			}}
			class="public-button"
		>
			{isPublic ? 'Make private' : 'Make public'}</button
		>
		{#if isPublic}
			<span>{window.location.origin}/recipe/{$activeRecipe}</span>
		{/if}
	{/if}
</div>

<div class="recipe-header">
	<h2>{name}</h2>
	<button
		on:click={() => {
			addMode = !addMode;
		}}
		class="add-entry {addMode ? 'adding' : ''}"
		data-testid="new-point"
	>
		{addMode ? 'Cancel' : 'New entry'}</button
	>
</div>

<Modal
	{showModal}
	onCancel={() => {
		showModal = false;
		resetNewPoint();
	}}
	onOk={() => {
		showModal = false;
		onAddPoint($newPoint);
		resetNewPoint();
	}}
>
	<form data-testid="new-point-form" class="content">
		<label for="title">Title</label>
		<input id="title" type="text" bind:value={$newPoint.title} />
		<label for="detail">Details</label>
		<textarea id="detail" rows="7" bind:value={$newPoint.details} />
	</form>
</Modal>

<div>
	<h3>Currently fermenting</h3>
	<ul>
		{#each fermenting as item (item)}
			<div class="item" animate:flip>
				<li draggable={true} on:dragstart={(event) => dragStart(event)}>
					{item}
				</li>
			</div>
		{/each}
	</ul>
</div>

<h3>Grading</h3>
{#if editingAxes}
	<span>X-Axis: <input bind:value={$editableAxisNames.x} /></span>
	<span>Y-Axis: <input bind:value={$editableAxisNames.y} /></span>
	<button
		on:click={() => {
			editingAxes = !editingAxes;
			recipes.update({ id: $activeRecipe, axisNames: $editableAxisNames });
		}}>Done</button
	>
{:else}
	<span>X-Axis: {axisNames.x}</span>
	<span>Y-Axis: {axisNames.y}</span>
	<button
		on:click={() => {
			editingAxes = !editingAxes;
		}}>Edit</button
	>
{/if}
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
	width="100%"
	height="100%"
	data-testid="graph"
	style={(function () {
		if (nearestPoint && !addMode) {
			return 'cursor: pointer';
		}
		if (addMode) {
			return 'cursor: crosshair';
		}
		return '';
	})()}
	ondragover="return false"
	on:drop={(event) => drop(event)}
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
	<Axis {width} {height} type="x" name={axisNames.x} scale={abscissa} tickNumber={10} {margin} />
	<Axis {width} {height} type="y" name={axisNames.y} scale={ordinate} tickNumber={10} {margin} />
	<!-- <Bg /> -->
	{#each points as { x, y, id, title } (id)}
		<Entry
			x={abscissa(x)}
			y={ordinate(y)}
			{title}
			{id}
			fill={id === pointPicked?.id ? 'aquamarine' : 'salmon'}
			r={(id === nearestPoint?.id && !click) || id === pointPicked?.id ? 6 : 4}
			stroke={id === nearestPoint?.id || id === pointPicked?.id ? '#000' : null}
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
	.content {
		display: flex;
		flex-direction: column;
		label {
			margin-top: 0.7rem;
			margin-bottom: 0.5rem;
		}
		textarea {
			resize: none;
		}
	}
</style>
