<script lang="ts">
	import { scaleLinear, type ScaleLinear } from 'd3-scale';
	import { Delaunay } from 'd3-delaunay';
	import Entry from './Entry.svelte';
	import Axis from './Axis.svelte';

	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import EntryDetails from './EntryDetails.svelte';
	import type { Margin } from '../../types/layout';
	import { activeRecipeId, points as pointsStore } from '../../stores/recipe';

	import { clamp } from 'lodash';
	import type { Point } from '../../types/recipe';

	export let width: number,
		height: number,
		points: Point[] = [],
		axisNames: {
			x: string;
			y: string;
		},
		readOnly: boolean = false;

	const margin: Margin = { top: 50, right: 25, bottom: 50, left: 30 };

	let pointMovingIdx: number | undefined;
	let pointPicked: Point | undefined;
	let nearestPoint: Point | null = null;
	let click: boolean = false;

	function computeEuclideanDistance(xa: number, ya: number, xb: number, yb: number): number {
		return Math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2);
	}

	function PixelsToDomain(valuePix: number, scale: ScaleLinear<any, any>): number {
		return scale.invert(valuePix);
	}

	function resetPickedPoint() {
		pointPicked = undefined;
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		const { offsetX, offsetY } = event;
		const id = event?.dataTransfer?.getData('text/plain');
		const x = PixelsToDomain(offsetX, abscissa).toFixed(2);
		const y = PixelsToDomain(offsetY, ordinate).toFixed(2);
		if (id && x && y) {
			pointsStore.update({ id, x, y, isFermenting: false }, $activeRecipeId);
		}
	}

	$: abscissa = scaleLinear()
		.domain([0, 10])
		.range([margin.left, width - margin.right])
		.clamp(true);

	$: ordinate = scaleLinear()
		.domain([0, 10])
		.range([height - margin.bottom, margin.top])
		.clamp(true);

	$: delaunay = Delaunay.from(
		points,
		(d: Point) => abscissa(d.x),
		(d: Point) => ordinate(d.y)
	);

	function computeDistanceInDomainSpace(xa: number, ya: number, xb: number, yb: number): number {
		const distance = computeEuclideanDistance(
			PixelsToDomain(xa, abscissa),
			PixelsToDomain(ya, ordinate),
			// Clamp so if someone set coordinates out of the domain
			// the distance comput still works
			clamp(xb, 0, 10),
			clamp(yb, 0, 10)
		);
		return distance;
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
	width="100%"
	height="100%"
	data-testid="graph"
	style={(function () {
		if (nearestPoint && nearestPoint == pointPicked && click && !readOnly) {
			return 'cursor: grabbing;';
		}
		if (nearestPoint && nearestPoint == pointPicked && !readOnly) {
			return 'cursor: grab;';
		}

		if (nearestPoint) {
			return 'cursor: pointer';
		}
		return '';
	})()}
	ondragover="return false"
	on:drop={(event) => drop(event)}
	on:mousemove={({ offsetX, offsetY }) => {
		const index = delaunay.find(offsetX, offsetY);
		if (Number.isInteger(index) && index >= 0 && !pointMovingIdx) {
			const point = points[index];
			const distance = computeDistanceInDomainSpace(offsetX, offsetY, point.x, point.y);

			if (distance < 0.5) {
				nearestPoint = point;
			} else {
				nearestPoint = null;
			}
		}
		if (pointPicked && click && !readOnly) {
			if (!pointMovingIdx) {
				// only here when we first start to move
				pointMovingIdx = index;
			}

			points[pointMovingIdx] = {
				...points[pointMovingIdx],
				x: PixelsToDomain(offsetX, abscissa),
				y: PixelsToDomain(offsetY, ordinate)
			};
		}
	}}
	on:mouseout={() => (nearestPoint = null)}
	on:mousedown={() => (click = true)}
	on:mouseup={(e) => {
		click = false;
		if (pointMovingIdx) {
			const pointMoved = points[pointMovingIdx];
			pointsStore.update(
				{ ...pointMoved, x: pointMoved.x.toFixed(2), y: pointMoved.y.toFixed(2) },
				$activeRecipeId
			);
		}
		pointMovingIdx = undefined;
	}}
	on:click={({ offsetX, offsetY }) => {
		const index = delaunay.find(offsetX, offsetY);
		if (Number.isInteger(index) && index >= 0 && !pointMovingIdx) {
			const point = points[index];
			const distance = computeDistanceInDomainSpace(offsetX, offsetY, point.x, point.y);

			if (distance < 0.5) {
				nearestPoint = point;
			} else {
				nearestPoint = null;
			}
		}
		if (nearestPoint && !pointMovingIdx) {
			pointPicked = points.find((point) => point.id === nearestPoint.id);
		} else if (!nearestPoint) {
			pointPicked = undefined;
		}
		console.log(pointPicked);
	}}
>
	<Axis {width} {height} type="x" name={axisNames.x} scale={abscissa} tickNumber={10} {margin} />
	<Axis {width} {height} type="y" name={axisNames.y} scale={ordinate} tickNumber={10} {margin} />
	<!-- <Bg /> -->
	{#each points as { x, y, id, title } (id)}
		<Entry
			x={abscissa(x)}
			y={ordinate(y)}
			{title}
			{id}
			fill={id === pointPicked?.id ? '#0dd66f' : '#ff6500'}
			r={(id === nearestPoint?.id && !click) || id === pointPicked?.id ? 6 : 4}
			stroke={id === nearestPoint?.id || id === pointPicked?.id ? '#000' : null}
		/>
	{/each}
	{#if nearestPoint}
		<text
			transition:fade={{ duration: 300, easing: quadOut }}
			text-anchor="middle"
			x={abscissa(nearestPoint.x)}
			y={ordinate(nearestPoint.y) - 10}>{nearestPoint.title}</text
		>
	{/if}
</svg>

{#if pointPicked}
	<EntryDetails {readOnly} {axisNames} {pointPicked} {resetPickedPoint} />
{/if}
