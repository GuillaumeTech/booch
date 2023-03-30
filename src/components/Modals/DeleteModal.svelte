<script lang="ts">
	import type { AxisNames } from '../../types/recipe';
	import Modal from '../Modal.svelte';
	import { field, form } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';

	export let showModal: boolean;
	export let deleting: string;

	export let onOk: () => void;
	export let onCancel: () => void;
</script>

<Modal
	{showModal}
	onCancel={() => {
		onCancel();
	}}
	onOk={() => {
		onOk();
	}}
>
	<b slot="header">Confirm</b>
	<p>Are you sure about deleting <b>{deleting}</b> ? This can't be undone</p>
</Modal>

<style lang="less">
	.content {
		display: flex;
		flex-direction: column;
		label {
			margin-top: 0.7rem;
			margin-bottom: 0.5rem;
		}
	}
	small {
		height: 0.7rem;
	}
</style>
