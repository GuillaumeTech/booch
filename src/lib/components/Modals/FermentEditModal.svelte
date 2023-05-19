<script lang="ts">
	import type { AxisNames, NewPoint, Point, StepDate } from '../../../types/recipe';
	import { removeAtIndex } from '$lib/utils';
	import Modal from '../Modal.svelte';
	import { field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	import IconButton from '../Icons/IconButton.svelte';
	import AlertModal from './AlertModal.svelte';
	import { activeRecipeId, points } from '../../../stores/recipe';

	export let point: NewPoint;
	export let showModal: boolean;
	export let axisNames: AxisNames;

	export let onOk: (point: Point) => void;

	export let onCancel: () => void;
	let grading = false;
	let showDuplicatePopup = false;
	let chronology: StepDate[] = point?.chronology || [];
	const title = field('title', point?.title, [required()]);
	const details = field('details', point?.details);
	const xAxis = field('xAxis', point?.x, [required()]);
	const yAxis = field('yAxis', point?.y, [required()]);
	title.validate();
	$: isValid =
		$title.valid &&
		((!grading && point.isFermenting) ||
			($xAxis.valid && $yAxis.valid && $xAxis.value && $yAxis.value));
</script>

<Modal
	{showModal}
	onCancel={() => {
		onCancel();
		title.reset();
		details.reset();
	}}
	onOk={() => {
		let updatedPoint = {
			...point,
			details: $details.value,
			title: $title.value,
			x: $xAxis.value,
			y: $yAxis.value,
			chronology
		};
		if (grading && isValid) {
			updatedPoint.isFermenting = false;
		}
		// if the person decided to not grade those. remove the values
		// that could possibly be there
		if (!grading && updatedPoint.isFermenting) {
			updatedPoint.x = undefined;
			updatedPoint.y = undefined;
		}
		onOk(updatedPoint);
	}}
	disableOK={!isValid}
>
	<AlertModal
		showModal={showDuplicatePopup}
		onCancel={() => {
			showDuplicatePopup = false;
		}}
		onOk={() => {
			if (point.id) {
				points.duplicate(point.id, $activeRecipeId);
			}
		}}
	>
		<p>
			You will duplicate <b>{$title.value}</b>, The grades for the duplicapted one will be reset and
			moved to "Currently Fermenting"
		</p></AlertModal
	>
	<form data-testid="new-point-form" class="content">
		<button
			class="duplicate"
			disabled={!isValid || typeof point?.id !== 'string'}
			on:click={() => {
				showDuplicatePopup = true;
			}}
		>
			Duplicate
		</button>
		<label for="title">Title</label>
		<input id="title" type="text" bind:value={$title.value} />
		<small> {errorsToText($title.errors)}</small>

		<label for="detail">Details</label>
		<textarea id="detail" rows="7" bind:value={$details.value} />
		<div class="label-side-button">
			<label for="detail">Chronology</label>
			<button
				on:click={() => {
					chronology = [...chronology, { title: '', date: new Date() }];
				}}
				data-testid="add-date"
			>
				Add date</button
			>
		</div>
		{#each chronology as chronoEntry, index (index)}
			<div class="chrono">
				<input type="text" data-testid={`title-${index}`} bind:value={chronoEntry.title} />
				<input type="date" data-testid={`date-${index}`} bind:value={chronoEntry.date} />
				<IconButton
					iconName="trash"
					fill="black"
					stroke="black"
					on:click={(e) => {
						chronology = removeAtIndex(chronology, index);
					}}
				/>
			</div>
		{/each}

		{#if point?.isFermenting}
			<hr />
		{/if}

		{#if point?.isFermenting}
			<div class="label-side-button">
				<span> Done fermenting ?</span>
				<button
					on:click={() => {
						grading = !grading;
						// force validate show it show errors
						// otherwise it need a first input to trigger validation
						xAxis.validate();
						yAxis.validate();
					}}
					data-testid="grade"
				>
					{grading ? 'Keep fermenting' : 'Grade it !'}</button
				>
			</div>
		{/if}
		{#if !point?.isFermenting || grading}
			<label for="xAxis">{axisNames.x}</label>
			<input id="xAxis" type="number" min="0" max="10" bind:value={$xAxis.value} />
			<small> {errorsToText($xAxis.errors)}</small>
			<label for="yAxis">{axisNames.y}</label>
			<input id="yAxis" type="number" min="0" max="10" bind:value={$yAxis.value} />
			<small> {errorsToText($yAxis.errors)}</small>
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

	.duplicate {
		margin: auto;
		margin-right: 0rem;
		max-width: 6rem;
	}
</style>
