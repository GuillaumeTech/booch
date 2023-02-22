<script lang="ts">
	import { Layer } from 'svelte-canvas';
	import { spring } from 'svelte/motion';

	export let x = 0,
		y = 0,
		r = 1,
		fill = 'black',
		stroke: null | string = null,
		strokeWidth = 1;

	const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
	$: radius.set(r);
</script>

<circle cx={x} cy={y} r={$radius} {fill} {stroke} stroke-width={strokeWidth} />
