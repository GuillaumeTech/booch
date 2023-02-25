<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { v4 as uuidv4 } from 'uuid';
	import { Delaunay } from 'd3-delaunay';
	import Point from './Point.svelte';
	import Axis from './Axis.svelte';
	import Bg from './Bg.svelte';
	import Modal from './Modal.svelte';
	import { writable } from 'svelte/store';
	import Recipe from './Recipe.svelte';

	const margin = { top: 25, right: 25, bottom: 25, left: 25 };

	type Point = {
		x: number;
		y: number;
		id: string;
		title?: string;
		details?: string;
		date?: Date;
	};

	type Recipe = {
		name: string;
		id: string;
		points: Point[];
	};

	let selectedRecipeIndex = 0;
	let addingNewRecipe = false;
	let newRecipeName = '';

	let points: Point[] = [
		{ id: 'a', x: 2, y: 8, title: 'truc', details: 'lorem ipsum dolor sit ament va consectetyr' },
		{ id: 'v', x: 9, y: 7 },
		{ id: 'vds', x: 3, y: 6 },
		{ id: 'vdds', x: 5, y: 8 },
		{ id: 'vddsa', x: 8.1, y: 8 }
	];

	let recipes: Recipe[] = [
		{
			name: 'Kombucha',
			id: 'aaaa',
			points: points
		},
		{
			name: 'Bread',
			id: 'bb',
			points: [
				{ id: 'v', x: 9, y: 7 },
				{ id: 'vds', x: 3, y: 6 }
			]
		}
	];

	let width: number, height: number;

	function getAddToPoints(selectedRecipeIndex: number) {
		return function (point: Point): void {
			const points = recipes[selectedRecipeIndex].points;
			const updatedPoints = [...points, point];
			recipes[selectedRecipeIndex].points = updatedPoints;
		};
	}

	function addNewRecipe() {
		const id = uuidv4();
		recipes = [...recipes, { name: newRecipeName, id, points: [] }];
		newRecipeName = '';
	}
</script>

<div class="app">
	<ul>
		{#each recipes as { name, id }, index (id)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				on:click={() => {
					selectedRecipeIndex = index;
				}}
			>
				{name}
			</li>
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
		<Recipe
			{width}
			{height}
			onAddPoint={getAddToPoints(selectedRecipeIndex)}
			name={recipes[selectedRecipeIndex].name}
			points={recipes[selectedRecipeIndex].points}
		/>
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
