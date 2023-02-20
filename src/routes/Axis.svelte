<script lang="ts">
	import { Layer } from 'svelte-canvas';
	import type { ScaleLinear } from 'd3-scale';
	export let scale: ScaleLinear<any, any>,
		tickSize = 4,
		margin,
		tickNumber = 10,
		type = 'x',
		name = '';

	$: ticks = scale.ticks(tickNumber);

	$: render = ({ context, width, height }) => {
		context.beginPath();

		ticks.forEach((d) => {
			if (type === 'x') {
				context.moveTo(scale(d), height / 2 - margin.bottom);
				context.lineTo(scale(d), height / 2 - margin.bottom + tickSize);
			} else if (type === 'y') {
				context.moveTo(width / 2 + margin.left, scale(d));
				context.lineTo(width / 2 + margin.left - tickSize, scale(d));
			}
		});

		context.strokeStyle = 'black';
		context.stroke();

		context.textAlign = type === 'x' ? 'center' : 'right';
		context.textBaseline = type === 'x' ? 'top' : 'middle';
		context.fillStyle = 'black';
		context.font = '14pt serif';

		ticks.forEach((d) => {
			if (type === 'x') {
				context.fillText(d, scale(d), height / 2 - margin.bottom + tickSize + 1);
			} else if (type === 'y') {
				context.fillText(d, width / 2 + margin.left - tickSize - 1, scale(d));
			}
		});

		if (type === 'x') {
			context.direction = 'rtl';
			context.fillText(name, width - 20, height / 2 - margin.bottom - 20);
		} else if (type === 'y') {
			context.fillText(name, width / 2 + margin.left + 70, 10);
		}
	};
</script>

<Layer {render} />
