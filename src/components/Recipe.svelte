<script lang="ts">
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { v4 as uuidv4 } from 'uuid';
	import { Delaunay } from 'd3-delaunay';
	import Entry from './Entry.svelte';
	import Axis from './Axis.svelte';
	import Modal from './Modal.svelte';
	import { writable } from 'svelte/store';
	import type { NewPoint, Point, PointUpdate, StepDate } from '../types/recipe';
	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import EntryDetails from './EntryDetails.svelte';
	import type { Margin } from '../types/layout';
	import { recipes, activeRecipe, points as pointsStore } from '../stores/recipe';
	import { flip } from 'svelte/animate';
	import { activeSession } from '../stores/supabase';
	import { required } from 'svelte-forms/validators';
	import { field, form } from 'svelte-forms';
	import { removeAtIndex } from '$lib/utils';
	import Jar from './Jar.svelte';
	import FermentEditModal from './Modals/FermentEditModal.svelte';
	import { clamp } from 'lodash';

	export let width: number,
		height: number,
		name: string,
		points: Point[] = [],
		isPublic: Boolean = false,
		axisNames: {
			x: string;
			y: string;
		};

	const margin: Margin = { top: 50, right: 25, bottom: 50, left: 30 };
	let pointData: NewPoint;
	let editingAxes = false;
	$: editableAxisNames = writable(axisNames);
	let pointMoved: Point | undefined;
	let showModal = false;
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

	function dragStart(event: DragEvent, id: string) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the basket from which it is leaving.
		event?.dataTransfer?.setData('text/plain', id);
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		const { offsetX, offsetY } = event;
		const id = event?.dataTransfer?.getData('text/plain');
		const x = PixelsToDomain(offsetX, abscissa).toFixed(2);
		const y = PixelsToDomain(offsetY, ordinate).toFixed(2);
		if (id && x && y) {
			pointsStore.update({ id, x, y, isFermenting: false }, $activeRecipe);
		}
	}

	function createNewPoint(point: NewPoint) {
		const id = uuidv4();
		const newPoint: Point = {
			...point,
			id
		};
		pointsStore.add(newPoint, $activeRecipe);
	}

	$: pointsFermenting = points.filter(({ isFermenting }) => isFermenting);
	$: pointsFermented = points.filter(
		({ isFermenting, x, y }) => !isFermenting || (typeof x === 'number' && typeof y === 'number')
		// the check on x and y is for retro compatibility
	);

	$: abscissa = scaleLinear()
		.domain([0, 10])
		.range([margin.left, width - margin.right])
		.clamp(true);

	$: ordinate = scaleLinear()
		.domain([0, 10])
		.range([height - margin.bottom, margin.top])
		.clamp(true);

	$: delaunay = Delaunay.from(
		pointsFermented,
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
</div>

<!-- using key here reset the field everytime point data change
it could also be done with reactive statements but seems the point.chornoly does not ejoy it
+ it's is shorter -->
{#key pointData}
	<FermentEditModal
		{showModal}
		{axisNames}
		point={pointData}
		onCancel={() => {
			showModal = false;
		}}
		onOk={(point) => {
			if (point.id !== undefined) {
				// type script complains but it's actually fine here
				// as we just checked that .id exist,
				// note to self: make it work with a better typedef ??
				pointsStore.update(point, $activeRecipe);
			} else {
				createNewPoint(point);
			}
		}}
	/>
{/key}

<div>
	<h3>Currently fermenting</h3>

	<ul>
		{#each pointsFermenting as point (point.id)}
			<div class="item" animate:flip>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li
					on:click={() => {
						pointData = point;
						console.log(pointData);
						showModal = true;
					}}
					draggable={true}
					on:dragstart={(event) => dragStart(event, point.id)}
				>
					<Jar />
					<small>{point.title}</small>
				</li>
			</div>
		{/each}
		<div class="item">
			<button
				class="add-kombucha"
				on:click={() => {
					pointData = { isFermenting: true };
					showModal = true;
				}}
				><Jar displayLiquid={false} displayPlus />
			</button>
		</div>
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
		if (nearestPoint && nearestPoint == pointPicked && click) {
			return 'cursor: grabbing;';
		}
		if (nearestPoint && nearestPoint == pointPicked) {
			return 'cursor: grab;';
		}

		if (nearestPoint) {
			return 'cursor: pointer';
		}
		return '';
	})()}
	ondragover="return false"
	on:drop={(event) => drop(event)}
	on:mousemove={({ offsetX, offsetY }) => {
		const index = delaunay.find(offsetX, offsetY);
		if (Number.isInteger(index) && index >= 0) {
			const point = pointsFermented[index];
			const distance = computeDistance(
				PixelsToDomain(offsetX, abscissa),
				PixelsToDomain(offsetY, ordinate),
				// Clamp so if someone set coordinates out of the domain
				// the distance comput still works
				clamp(point.x, 0, 10),
				clamp(point.y, 0, 10)
			);

			if (distance < 0.3) {
				nearestPoint = point;
			} else {
				nearestPoint = null;
			}
		}
		if (pointPicked && click) {
			pointsFermented[index] = {
				...pointsFermented[index],
				x: PixelsToDomain(offsetX, abscissa),
				y: PixelsToDomain(offsetY, ordinate)
			};
			pointMoved = pointsFermented[index];
		}
	}}
	on:mouseout={() => (nearestPoint = null)}
	on:mousedown={() => (click = true)}
	on:mouseup={(e) => {
		click = false;
		if (pointMoved) {
			pointsStore.update(
				{ ...pointMoved, x: pointMoved.x.toFixed(2), y: pointMoved.y.toFixed(2) },
				$activeRecipe
			);
		}
		pointMoved = undefined;
	}}
	on:click={() => {
		if (nearestPoint) {
			pointPicked = pointsFermented.find((point) => point.id === nearestPoint.id);
		} else if (!nearestPoint) {
			pointPicked = undefined;
		}
	}}
>
	<Axis {width} {height} type="x" name={axisNames.x} scale={abscissa} tickNumber={10} {margin} />
	<Axis {width} {height} type="y" name={axisNames.y} scale={ordinate} tickNumber={10} {margin} />
	<!-- <Bg /> -->
	{#each pointsFermented as { x, y, id, title } (id)}
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
	<EntryDetails {axisNames} {pointPicked} {resetPickedPoint} />
{/if}

<style lang="less">
	.recipe-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		h2 {
			font-family: 'Inter';
			font-weight: 800;
		}
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

	ul {
		display: flex;
		flex-direction: row;
		list-style-type: none;
		padding: 0;
		li {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 4rem;
			text-align: center;
		}
	}

	button.add-kombucha {
		background: none;
		border: none;
		transition: opacity 200ms ease;
		opacity: 25%;
		&:hover {
			opacity: 100%;
		}
	}
	small {
		font-size: 0.79rem;
	}
</style>
