<script lang="ts">
	import type { Point } from '../types/recipe';
	import { points, activeRecipe } from '../stores/recipe';
	import { fade, fly } from 'svelte/transition';
	import { writable } from 'svelte/store';

	export let pointPicked: Point, resetPickedPoint: Function, readOnly: Boolean;

	$: editablePoint = writable(pointPicked);
	let editing = false;
</script>

<div in:fly={{ y: 10, duration: 500 }} out:fade>
	{#key pointPicked.id}
		<div>
			{#if !readOnly}
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
			{/if}
			<button
				on:click={() => {
					resetPickedPoint();
				}}>hide</button
			>
		</div>

		<div>
			{#if editing && !readOnly}
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
						if (!editing && !readOnly) {
							editing = true;
						}
					}}
				>
					<h3>{pointPicked.title}</h3>
					<h4>Details</h4>
					<p>{pointPicked.details}</p>
					<div class="grades">
						<div class="grade">
							<h4>Funk</h4>
							<p>{pointPicked.x}</p>
						</div>
						<div class="grade">
							<h4>Dryness</h4>
							<p>{pointPicked.y}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/key}
</div>

<style lang="less">
	.grades {
		display: flex;
		flex-direction: row;
		align-items: center;
		:nth-child(1).grade {
			margin-right: 1rem;
			margin-left: 0;
		}
		.grade {
			margin-left: 1rem;
		}
	}
</style>
