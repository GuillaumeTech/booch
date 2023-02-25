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

	type NewPoint = {
		x?: number;
		y?: number;
		id?: string;
		title?: string;
		details?: string;
		date?: Date;
	};

	type Recipe = {
		name: string;
		id: string;
		points: Point[];
	};

	const emptyNewPoint: NewPoint = { title: '', details: '' };
	let newPoint = writable(emptyNewPoint);
	let name = 'test';

	let points: Point[] = [
		{ id: 'a', x: 2, y: 8, title: 'truc', details: 'lorem ipsum dolor sit ament va consectetyr' },
		{ id: 'v', x: 9, y: 7 },
		{ id: 'vds', x: 3, y: 6 },
		{ id: 'vdds', x: 5, y: 8 },
		{ id: 'vddsa', x: 8.1, y: 8 }
	];

	let width: number, height: number;

	function addToPoints(point: Point): void {
		points = [...points, point];
	}
</script>

<div class="app">
	<ul>
		<li>test</li>

		<li><button>add</button></li>
	</ul>

	<div class="graph" bind:clientWidth={width} bind:clientHeight={height}>
		<Recipe {width} {height} onAddPoint={addToPoints} {name} {points} />
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
