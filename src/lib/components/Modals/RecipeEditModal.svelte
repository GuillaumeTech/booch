<script lang="ts">
	import type { AxisNames, NewPoint, Point } from '../../../types/recipe';
	import Modal from '../Modal.svelte';
	import { field, form } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	import { activeRecipe, recipes } from '../../../stores/recipe';

	export let point: NewPoint;
	export let showModal: boolean;
	export let axisNames: AxisNames;

	export let onOk: () => void;

	export let onCancel: () => void;
	const title = field('title', point?.title, [required()]);
	const decription = field('decription', point?.details);
	const xAxis = field('xAxis', axisNames?.x, [required()]);
	const yAxis = field('yAxis', axisNames?.y, [required()]);
	const recipeParams = form(title, decription, xAxis, yAxis);
	recipeParams.validate();
</script>

<Modal
	{showModal}
	onCancel={() => {
		onCancel();
		recipeParams.reset();
	}}
	onOk={() => {
		if ($recipeParams.valid) {
			recipes.update({
				id: $activeRecipe,
				axisNames: { x: $xAxis.value, y: $yAxis.value },
				description: $decription.value,
				name: $title.value
			});
		}
		onOk();
	}}
	disableOK={!$recipeParams.valid}
>
	<form data-testid="new-point-form" class="content">
		<label for="title">Title</label>
		<input id="title" type="text" bind:value={$title.value} />
		<small> {errorsToText($title.errors)}</small>

		<label for="detail">Decription</label>
		<textarea id="detail" rows="7" bind:value={$decription.value} />
		<label for="xAxis">X axis</label>
		<input id="xAxis" type="text" bind:value={$xAxis.value} />
		<small> {errorsToText($xAxis.errors)}</small>
		<label for="yAxis">Y axis</label>
		<input id="yAxis" type="text" bind:value={$yAxis.value} />
		<small> {errorsToText($yAxis.errors)}</small>
	</form>
</Modal>

<style lang="less">
	.content {
		display: flex;
		flex-direction: column;
		label {
			margin-top: 0.7rem;
			margin-bottom: 0.5rem;
		}
		textarea {
			resize: none;
		}
	}

	div.label-side-button {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	hr {
		margin: 1rem 0;
	}
	div.chrono {
		display: flex;
		flex-direction: row;
		margin-bottom: 0.5rem;
		input[type='text'] {
			flex-grow: 1;
			min-width: 1rem;
		}

		input[type='date'] {
			min-width: 8rem;
		}
	}
	hr {
		width: 100%;
	}
	small {
		height: 0.7rem;
	}
</style>
