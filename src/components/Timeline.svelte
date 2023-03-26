<script lang="ts">
	import type { StepDate } from '../types/recipe';
	export let dates: StepDate[] | undefined;

	$: prepedDates = (dates || [])
		.map(({ title, date }) => ({ title, date: new Date(date) }))
		.sort(({ date: dateA }, { date: dateB }) => {
			return dateA - dateB;
		});
</script>

{#if dates !== undefined && dates.length > 0}
	<div class="timeline">
		{#each prepedDates as { date, title }}
			<div class="outer">
				<div class="card">
					<div class="info">
						<span class="date"
							>{date.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}</span
						>
						<p>{title}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p>No chronology for this</p>
{/if}

<style lang="less">
	* {
		margin: 0;
		padding: 0;
	}

	/* Timeline Container */
	.timeline {
		margin: 20px auto;
		padding: 0;
	}

	/* Outer Layer with the timeline border */
	.outer {
		border-left: 2px solid #333;
	}

	/* Card container */
	.card {
		position: relative;
		margin: 0 0 0rem 1rem;
		padding: 0.5rem;
		padding-bottom: 1rem;
		color: black;
		max-width: 400px;
	}

	/* Information about the timeline */
	.info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	/* Title of the card */
	.date {
		color: balck;
		position: relative;
	}

	/* Timeline dot  */
	.date::before {
		content: '';
		position: absolute;
		width: 1rem;
		height: 0.2rem;
		background: black;
		left: -2rem;
	}
</style>
