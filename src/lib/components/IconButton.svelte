<script lang="ts">
	import Icon from './Icon.svelte';

	export let iconName: string;

	export let strokeWidth = '1';
	export let stroke = 'black';

	export let fill: string | null = null;
</script>

<button {...$$restProps}>
	<Icon name={iconName} {fill} {stroke} {strokeWidth} />
</button>

<style lang="less">
	button {
		border: none;
		transition: transform 150ms ease-out;
		&:hover {
			background: none;
			border: none;
			transform: scale(1.2);
		}
	}
</style>
