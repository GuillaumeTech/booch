<script lang="ts">
	import Modal from '../Modal.svelte';

	export let showModal: boolean;
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
	<b>Confirm</b>
	<slot />
</Modal>
