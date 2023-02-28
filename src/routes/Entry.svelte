<script lang="ts">
	import { spring } from 'svelte/motion';

	export let x = 0,
		y = 0,
		r = 1,
		fill = 'black',
		stroke: null | string = null,
		strokeWidth = 1,
		id: string,
		title: string = '',
		showTooltip = false;

	const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
	$: radius.set(r);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle cx={x} cy={y} {id} r={$radius} {fill} {stroke} stroke-width={strokeWidth} />
