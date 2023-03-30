<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	import type { NewPoint, Point, PointUpdate, StepDate } from '../../types/recipe';

	import { recipes, activeRecipe, points as pointsStore } from '../../stores/recipe';
	import { flip } from 'svelte/animate';
	import { activeSession } from '../../stores/supabase';

	import Jar from './Jar.svelte';
	import FermentEditModal from './Modals/FermentEditModal.svelte';
	import RecipeChart from './RecipeChart.svelte';
	import AxisEditModal from './Modals/AxisEditModal.svelte';
	import IconButton from './IconButton.svelte';

	export let name: string,
		points: Point[] = [],
		isPublic: Boolean = false,
		axisNames: {
			x: string;
			y: string;
		};
	let pointData: NewPoint;
	let width: number, height: number;

	let showAxisEditModal = false;
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
		({ isFermenting, x, y }) => {
			if (isFermenting !== undefined) {
				return !isFermenting && x !== 'NaN' && y !== 'NaN';
			} else {
				return x !== 'NaN' && y !== 'NaN';
			}
		}
		// the check on x and y is for retro compatibility nad also prevent freeze when x & y would be Nan
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
	<h3>CURRENTLY FERMENTING</h3>

	<ul>
		{#each pointsFermenting as point (point.id)}
			<div class="item" animate:flip>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<li
					on:click={() => {
						pointData = point;
						showModal = true;
					}}
					data-testid={`jar-${point.title}`}
					draggable={true}
					on:dragstart={(event) => dragStart(event, point.id)}
				>
					<Jar />
					<small data-testid={`text-${point.title}`}>{point.title}</small>
				</li>
			</div>
		{/each}
		<div class="item">
			<button
				data-testid="add-ferment"
				class="add-ferment"
				on:click={() => {
					pointData = { isFermenting: true };
					showModal = true;
				}}
				><Jar displayLiquid={false} displayPlus />
			</button>
		</div>
	</ul>
</div>

<div class="grading">
	<h3>GRADING</h3>
	<AxisEditModal
		onOk={() => {
			showAxisEditModal = false;
		}}
		onCancel={() => {
			showAxisEditModal = false;
		}}
		showModal={showAxisEditModal}
		{axisNames}
	/>

	<IconButton
		iconName="edit-2"
		fill="black"
		stroke="black"
		on:click={(e) => {
			showAxisEditModal = true;
		}}
	/>
</div>

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
			width: 4.5rem;
			text-align: center;
		}
	}

	button.add-ferment {
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
	.grading {
		display: flex;
	}
</style>
