<script lang="ts">
	import type { AxisNames, NewPoint, Point } from '../../../types/recipe';
	import Modal from '../Modal.svelte';
	import { field, form } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	import { activeRecipeId, currentRecipe, recipes } from '../../../stores/recipe';
	import { activeSession } from '../../../stores/supabase';

	export let showModal: boolean;
	export let oldAxisNames: AxisNames;
	export let oldDescription: string | undefined;
	export let oldName: string;
	export let oldIsPublic: boolean | undefined = false;
	export let onOk: () => void;
	export let onCancel: () => void;

	let copyText = 'Copy link';

	let name = field('name', oldName, [required()]);
	let description = field('description', oldDescription);
	let xAxis = field('xAxis', oldAxisNames?.x, [required()]);
	let yAxis = field('yAxis', oldAxisNames?.y, [required()]);
	let isPublic = oldIsPublic;
	let recipeParams = form(name, description, xAxis, yAxis);

	// set fields inital value when props changes
	$: xAxis = field('xAxis', oldAxisNames?.x, [required()]);
	$: yAxis = field('yAxis', oldAxisNames?.y, [required()]);
	$: recipeParams = form(name, description, xAxis, yAxis);
	$: name = field('name', oldName, [required()]);
	$: description = field('description', oldDescription);
	$: isPublic = oldIsPublic;

	recipeParams.validate();
</script>

<Modal
	{showModal}
	onCancel={() => {
		onCancel();
		recipeParams.reset();
		isPublic = oldIsPublic;
	}}
	onOk={() => {
		if ($recipeParams.valid) {
			recipes.update({
				id: $activeRecipeId,
				axisNames: { x: $xAxis.value, y: $yAxis.value },
				description: $description.value,
				name: $name.value,
				public: isPublic
			});
		} else {
			recipeParams.reset();
		}
		onOk();
	}}
	disableOK={!$recipeParams.valid}
>
	<form data-testid="new-point-form" class="content">
		<label for="name">Name</label>
		<input id="name" type="text" bind:value={$name.value} />
		<small> {errorsToText($name.errors)}</small>

		<label for="detail">Decription</label>
		<textarea id="detail" rows="7" bind:value={$description.value} />
		<label for="xAxis">X axis</label>
		<input id="xAxis" type="text" bind:value={$xAxis.value} />
		<small> {errorsToText($xAxis.errors)}</small>
		<label for="yAxis">Y axis</label>
		<input id="yAxis" type="text" bind:value={$yAxis.value} />
		<small> {errorsToText($yAxis.errors)}</small>
		{#if $activeSession}
			<label for="public">This recipe is currenty {isPublic ? 'public' : 'private'}</label>
			<div>
				<button
					on:click={() => {
						isPublic = !isPublic;
					}}
					class="public-button"
					id="public"
				>
					{isPublic ? 'Make private' : 'Make public'}</button
				>
				{#if isPublic}
					<button
						class="copy-button"
						on:click={() => {
							navigator.clipboard.writeText(`${window.location.origin}/recipe/${$activeRecipeId}`);
							copyText = 'Copied !';
							setTimeout(() => {
								copyText = 'Copy link';
							}, 3000);
						}}
					>
						{copyText}</button
					>
				{/if}
			</div>
		{/if}
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

	small {
		height: 0.7rem;
	}
</style>
