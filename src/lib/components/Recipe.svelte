<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	import type { NewPoint, Point, PointUpdate, StepDate } from '../../types/recipe';

	import { recipes, activeRecipeId, points as pointsStore } from '../../stores/recipe';
	import { flip } from 'svelte/animate';
	import { activeSession } from '../../stores/supabase';

	import Jar from './Jar.svelte';
	import FermentEditModal from './Modals/FermentEditModal.svelte';
	import RecipeChart from './RecipeChart.svelte';
	import IconSettings from './Icons/IconSettings.svelte';
	import RecipeEditModal from './Modals/RecipeEditModal.svelte';

	export let name: string,
		points: Point[] = [],
		isPublic: boolean = false,
		axisNames: {
			x: string;
			y: string;
		},
		description: string | undefined = undefined;
	let pointData: NewPoint;
	let width: number, height: number;
	let copyText: string = 'Copy link';

	let showRecipeSettingsModal = false;
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
		pointsStore.add(newPoint, $activeRecipeId);
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

<div class="recipe-header">
	<h2>
		{name}
	</h2>
	<div>
		<IconSettings
			on:click={(e) => {
				showRecipeSettingsModal = true;
			}}
		/>
	</div>
</div>
{#if description}
	<p class="description">{description}</p>
{/if}

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
				pointsStore.update(point, $activeRecipeId);
			} else {
				createNewPoint(point);
			}
		}}
	/>
{/key}

{#key $activeRecipeId}
	<RecipeEditModal
		onOk={() => {
			showRecipeSettingsModal = false;
		}}
		onCancel={() => {
			showRecipeSettingsModal = false;
		}}
		showModal={showRecipeSettingsModal}
		oldAxisNames={axisNames}
		oldName={name}
		oldDescription={description}
		oldIsPublic={isPublic}
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
			<li>
				<button
					data-testid="add-ferment"
					class="add-ferment"
					on:click={() => {
						pointData = { isFermenting: true };
						showModal = true;
					}}
					><Jar displayLiquid={false} displayPlus />
				</button>
			</li>
		</div>
	</ul>
</div>

<div class="grading">
	<h3>GRADING</h3>
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
		align-items: baseline;
		h2 {
			font-family: 'Inter';
			font-weight: 800;
			white-space: nowrap;
			margin-top: 2rem;
			text-overflow: ellipsis;
			flex-wrap: wrap;
			overflow: hidden;
		}
		div {
			font-size: 1.5rem;
		}
	}
	.description {
		margin-top: 0.8rem;
		margin-bottom: 1.5rem;
	}
	.chart {
		width: 100%;
		height: 100%;
	}

	.public-button {
		margin-top: 1rem;
	}
	.copy-button {
		width: 6rem;
	}

	ul {
		display: flex;
		flex-direction: row;
		list-style-type: none;
		padding: 0;
		overflow-x: auto;
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
