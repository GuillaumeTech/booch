<script>
	import { Layer } from 'svelte-canvas';

	$: render = ({ context, width, height }) => {
		const arrowLenght = height - 0.98 * height;
		context.beginPath();
		context.moveTo(0, height);
		context.lineTo(width, 0);
		context.lineTo(width, arrowLenght);
		context.moveTo(width, 0);
		context.lineTo(width - arrowLenght, 0);
		context.strokeStyle = '#999999';
		context.stroke();
		context.fillText('BEST', width - 20, 0 + 10);
		context.fillText('EW', 0 + 50, height - 10);

		// context.fillText(d, , height / 2 - margin.bottom + tickSize + 1);
	};
</script>

<Layer {render} />
