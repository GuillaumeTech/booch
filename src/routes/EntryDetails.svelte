<script lang="ts">
	import type { Point } from '../types/recipe';
	import { points, activeRecipe } from '../store';
	import { fade, fly } from 'svelte/transition';
	import { writable } from 'svelte/store';

	export let pointPicked: Point, resetPickedPoint: Function;

	$: editablePoint = writable(pointPicked);
	let editing = false;
</script>

<div in:fly={{ y: 10, duration: 500 }} out:fade>
	{#key pointPicked.id}
		<div>
			<button
				on:click={() => {
					if (editing) {
						points.update($editablePoint, $activeRecipe);
					}
					editing = !editing;
				}}>{editing ? 'Done' : 'Edit'}</button
			>
			<button
				on:click={() => {
					if (pointPicked) {
						points.remove(pointPicked.id, $activeRecipe); // makes ts happy but if is un-needed really
						resetPickedPoint();
					}
				}}>delete</button
			>
			<button
				on:click={() => {
					resetPickedPoint();
				}}>hide</button
			>
		</div>
		<div>
			{#if editing}
				<form>
					<input bind:value={$editablePoint.title} />
					<h4>Details</h4>
					<input bind:value={$editablePoint.details} />
					<h4>Funk</h4>
					<input bind:value={$editablePoint.x} />
					<h4>Dryness</h4>
					<input bind:value={$editablePoint.y} />
				</form>
			{:else}
				<div
					on:click={() => {
						if (editing) {
							points.update($editablePoint, $activeRecipe);
						}
						editing = !editing;
					}}
				>
					<h3>{pointPicked.title}</h3>
					<h4>Details</h4>
					<p>{pointPicked.details}</p>
					<h4>Funk</h4>
					<p>{pointPicked.x}</p>
					<h4>Dryness</h4>
					<p>{pointPicked.y}</p>
				</div>
			{/if}
		</div>
	{/key}
</div>
