<script lang="ts">
	import type { AxisNames, Point } from '../../types/recipe';
	import { points, activeRecipeId } from '../../stores/recipe';
	import FermentEditModal from './Modals/FermentEditModal.svelte';
	import Timeline from './Timeline.svelte';
	import IconButton from './Icons/IconButton.svelte';
	import AlertModal from './Modals/AlertModal.svelte';

	export let pointPicked: Point,
		resetPickedPoint: Function,
		readOnly: Boolean,
		axisNames: AxisNames;

	let editing = false;
	let showDeletingModal = false;
</script>

{#if pointPicked}
	{#key pointPicked.id}
		<FermentEditModal
			{axisNames}
			showModal={editing}
			point={pointPicked}
			onCancel={() => {
				editing = false;
			}}
			onOk={(point) => {
				points.update(point, $activeRecipeId);
				editing = false;
			}}
		/>
		<AlertModal
			showModal={showDeletingModal}
			onCancel={() => {
				showDeletingModal = false;
			}}
			onOk={() => {
				showDeletingModal = false;
				if (pointPicked) {
					points.remove(pointPicked.id, $activeRecipeId);
				}
				resetPickedPoint();
			}}
		>
			<p>
				Are you sure about deleting <b>{pointPicked.title}</b> ? This can't be undone
			</p></AlertModal
		>

		<div class="title-and-options">
			<h3>{pointPicked.title}</h3>

			{#if !readOnly}
				<IconButton
					iconName="edit-2"
					fill="black"
					stroke="black"
					on:click={(e) => {
						editing = !editing;
					}}
					data-testid={`edit-${pointPicked.title}`}
				/>
				<IconButton
					iconName="trash"
					fill="black"
					stroke="black"
					on:click={(e) => {
						showDeletingModal = true;
					}}
					data-testid={`delete-${pointPicked.title}`}
				/>
			{/if}
			<div class="hide">
				<IconButton
					iconName="x"
					fill="black"
					stroke="black"
					strokeWidth="3"
					on:click={() => {
						resetPickedPoint();
					}}
					data-testid={`hide-${pointPicked.title}`}
				/>
			</div>
		</div>
		<div>
			<div class="point-info">
				<div>
					<h4>Details</h4>
					<p data-testid={`details-${pointPicked.title}`}>{pointPicked.details}</p>
					<div class="grades">
						<div class="grade">
							<h4>{axisNames.x}</h4>
							<p>{pointPicked.x}</p>
						</div>
						<div class="grade">
							<h4>{axisNames.y}</h4>
							<p>{pointPicked.y}</p>
						</div>
					</div>
				</div>
				<div>
					<h4>Chronology</h4>

					<Timeline dates={pointPicked.chronology} />
				</div>
			</div>
		</div>
	{/key}
{/if}

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
	.point-info {
		display: flex;
		flex-direction: row;
		gap: 5rem;
		h4 {
			margin: 1rem 0 0.4rem 0;
		}
	}
	h3 {
		font-size: 1.25rem;
	}
	.title-and-options {
		margin-top: 1rem;
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		.hide {
			margin-left: auto;
		}
	}

	@media screen and (max-width: 600px) {
		.point-info {
			flex-direction: column;
			gap: 0;
		}
	}
</style>
