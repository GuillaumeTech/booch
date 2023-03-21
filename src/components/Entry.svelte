<script lang="ts">
	import { spring } from 'svelte/motion';
	export let x = 0,
		y = 0,
		r = 1,
		fill = 'black',
		stroke: null | string = null,
		strokeWidth = 1,
		title: string,
		id: string;

	const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
	$: radius.set(r);
	const _x = spring(x, { stiffness: 0.3, damping: 0.6 });
	$: _x.set(x);

	const _y = spring(y, { stiffness: 0.3, damping: 0.6 });
	$: _y.set(y);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle
	data-testid={title}
	cx={$_x}
	cy={$_y}
	{id}
	r={$radius}
	{fill}
	{stroke}
	stroke-width={strokeWidth}
/>
