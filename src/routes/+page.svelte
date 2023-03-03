<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { Point } from '../types/recipe';
	import Modal from './Modal.svelte';
	import RecipeChart from './Recipe.svelte';
	import { recipes, activeRecipe, points } from '../store';

	let addingNewRecipe = false;
	let newRecipeName = '';
	let editingId = '';
	let editingName = '';
	let deletingId = '';
	let deletingName = '';
	let showDeleteConfirm = false;

	let width: number, height: number;

	function getAddToPoints(recipeId: string) {
		return function (point: Point): void {
			points.add(point, recipeId);
		};
	}

	function addNewRecipe() {
		const id = uuidv4();
		const newRecipe = { name: newRecipeName, id, points: [] };
		recipes.add(newRecipe);
	}

	function editRecipeName(recipeId: string, newName: string) {
		recipes.updateName(recipeId, newName);
	}

	function deleteRecipe(id: string) {
		recipes.remove(id);
	}

	function resetDeletingInfo() {
		deletingId = '';
		deletingName = '';
	}
</script>

<div class="app">
	<ul>
		{#each Object.entries($recipes) as [_, { name, id }] (id)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if editingId == id}
				<li>
					<input type="text" bind:value={editingName} />
					<button
						on:click={(e) => {
							e.stopPropagation();
							editRecipeName(id, editingName);
							editingId = '';
							editingName = '';
						}}
					>
						OK
					</button>
				</li>
			{:else}
				<li
					on:click={() => {
						$activeRecipe = id;
					}}
				>
					{name}
					<button
						on:click={(e) => {
							e.stopPropagation();
							deletingId = id;
							deletingName = name;
							showDeleteConfirm = true;
						}}
					>
						del
					</button>
					<button
						on:click={(e) => {
							e.stopPropagation();
							editingId = id;
							editingName = name;
						}}
					>
						edit
					</button>
				</li>
			{/if}
		{/each}

		<li>
			{#if addingNewRecipe}
				<input type="text" bind:value={newRecipeName} />
			{/if}

			<button
				on:click={() => {
					if (addingNewRecipe) {
						addNewRecipe();
						addingNewRecipe = false;
					} else {
						addingNewRecipe = true;
					}
				}}>{addingNewRecipe ? 'add' : 'new recipe'}</button
			>
		</li>
	</ul>

	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		<!-- Can't render it as long as we don't have width height -->
		<!-- fix ssr issue logically and seems on very first render  -->
		<!-- width height are undefined as well -->
		{#if width && height}
			<RecipeChart
				{width}
				{height}
				onAddPoint={getAddToPoints($activeRecipe)}
				name={$recipes[$activeRecipe]?.name}
				points={$recipes[$activeRecipe]?.points}
			/>
		{/if}
	</div>
	<Modal
		showModal={showDeleteConfirm}
		onCancel={() => {
			showDeleteConfirm = false;
			resetDeletingInfo();
		}}
		onClose={() => {
			showDeleteConfirm = false;
			deleteRecipe(deletingId);
			resetDeletingInfo();
		}}
	>
		<p>Are you sure about deleting <b>{deletingName}</b> ? This can't be undone</p>
	</Modal>
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
