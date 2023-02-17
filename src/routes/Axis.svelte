<script>
	import { Layer } from 'svelte-canvas';

	export let scale,
		tickSize = 4,
		margin,
		tickNumber = 10,
		type = 'x';

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

		ticks.forEach((d) => {
			if (type === 'x') {
				context.fillText(d, scale(d), height / 2 - margin.bottom + tickSize + 1);
			} else if (type === 'y') {
				context.fillText(d, width / 2 + margin.left - tickSize - 1, scale(d));
			}
		});
	};
</script>

<Layer {render} />
