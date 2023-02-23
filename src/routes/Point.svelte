<script lang="ts">
	import { tippy } from 'svelte-tippy';
	import 'tippy.js/dist/tippy.css'; // optional
	import { spring } from 'svelte/motion';
	export let x = 0,
		y = 0,
		r = 1,
		fill = 'black',
		stroke: null | string = null,
		strokeWidth = 1,
		id: string,
		title: string = '',
		details: string = '',
		date: Date;
	let point;

	const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
	$: radius.set(r);

	const tooltipcontent = `<div>${title || ''}<p>${details || ''}</p>${date || ''}</div>`;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle
	bind:this={point}
	use:tippy={{ trigger: 'click', content: tooltipcontent, allowHTML: true }}
	cx={x}
	cy={y}
	{id}
	r={$radius}
	{fill}
	{stroke}
	stroke-width={strokeWidth}
	on:click={(e) => {
		// mutes the on click because it's handled by the one in page
		e.preventDefault();
		e.stopPropagation();
	}}
/>
