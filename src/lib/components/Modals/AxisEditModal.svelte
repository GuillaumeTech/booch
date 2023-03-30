<script lang="ts">
	import type { AxisNames } from '../../../types/recipe';
	import Modal from '../Modal.svelte';
	import { field, form } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	import { activeRecipe, recipes } from '../../../stores/recipe';

	export let axisNames: AxisNames;
	export let showModal: boolean;
	export let onOk: () => void;
	export let onCancel: () => void;

	onCancel;

	const xAxis = field('xAxis', axisNames?.x, [required()]);
	const yAxis = field('yAxis', axisNames?.y, [required()]);
	const updatedAxisNames = form(xAxis, yAxis);
	updatedAxisNames.validate();
</script>

<Modal
	{showModal}
	onCancel={() => {
		onCancel();
	}}
	onOk={() => {
		if ($updatedAxisNames.valid) {
			recipes.update({ id: $activeRecipe, axisNames: { x: $xAxis.value, y: $yAxis.value } });
		}
		onOk();
	}}
	disableOK={!$updatedAxisNames.valid}
>
	<form data-testid="axis-edit-form" class="content">
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
	}
	small {
		height: 0.7rem;
	}
</style>
