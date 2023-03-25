<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	import { writable } from 'svelte/store';
	import type { NewPoint, Point, PointUpdate, StepDate } from '../types/recipe';

	import { recipes, activeRecipe, points as pointsStore } from '../stores/recipe';
	import { flip } from 'svelte/animate';
	import { activeSession } from '../stores/supabase';

	import Jar from './Jar.svelte';
	import FermentEditModal from './Modals/FermentEditModal.svelte';
	import RecipeChart from './RecipeChart.svelte';

	export let name: string,
		points: Point[] = [],
		isPublic: Boolean = false,
		axisNames: {
			x: string;
			y: string;
		};
	let pointData: NewPoint;
	let width: number, height: number;

	let editingAxes = false;
	$: editableAxisNames = writable(axisNames);
	let showModal = false;

	function dragStart(event: DragEvent, id: string) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the basket from which it is leaving.
		event?.dataTransfer?.setData('text/plain', id);
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
<!-- Can't render it as long as we don't have width height -->
<!-- fix ssr issue logically, and seems on very first render  width height are undefined as well -->
<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	{#if width && height}
		<RecipeChart {width} {height} {axisNames} points={pointsFermented} />
	{/if}
</div>

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
	.chart {
		width: 100%;
		height: 100%;
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
