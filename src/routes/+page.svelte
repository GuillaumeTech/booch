<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { Point, Recipe } from '../types/recipe';
	import Modal from './Modal.svelte';
	import RecipeChart from './Recipe.svelte';

	const margin = { top: 25, right: 25, bottom: 25, left: 25 };

	let selectedRecipeId = 'aaaa';
	let addingNewRecipe = false;
	let newRecipeName = '';
	let editingId = '';
	let editingName = '';
	let deletingId = '';
	let deletingName = '';
	let showDeleteConfirm = false;

	let points: Point[] = [
		{ id: 'a', x: 2, y: 8, title: 'truc', details: 'lorem ipsum dolor sit ament va consectetyr' },
		{ id: 'v', x: 9, y: 7 },
		{ id: 'vds', x: 3, y: 6 },
		{ id: 'vdds', x: 5, y: 8 },
		{ id: 'vddsa', x: 8.1, y: 8 }
	];

	let recipes: Record<string, Recipe> = {
		aaaa: { name: 'Kombucha', points: points, id: 'aaaa' },
		bb: {
			name: 'Bread',
			id: 'bb',
			points: [
				{ id: 'v', x: 9, y: 7 },
				{ id: 'vds', x: 3, y: 6 }
			]
		}
	};

	let width: number, height: number;

	function getAddToPoints(recipeId: string) {
		return function (point: Point): void {
			const points = recipes[recipeId].points;
			const updatedPoints = [...points, point];
			recipes[recipeId].points = updatedPoints;
		};
	}

	function addNewRecipe() {
		const id = uuidv4();
		recipes = { ...recipes, id: { name: newRecipeName, id, points: [] } };
		newRecipeName = '';
	}

	function editRecipeName(recipeId: string, newName: string) {
		recipes[recipeId].name = newName;
	}

	function deleteRecipe(id: string) {
		delete recipes[id];
	}

	function resetDeletingInfo() {
		deletingId = '';
		deletingName = '';
	}

	resetDeletingInfo;
</script>

<div class="app">
	<ul>
		{#each Object.entries(recipes) as [_, { name, id }] (id)}
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
						selectedRecipeId = id;
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
		<RecipeChart
			{width}
			{height}
			onAddPoint={getAddToPoints(selectedRecipeId)}
			name={recipes[selectedRecipeId].name}
			points={recipes[selectedRecipeId].points}
		/>
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
