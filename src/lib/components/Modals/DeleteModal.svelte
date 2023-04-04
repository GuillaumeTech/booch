<script lang="ts">
	import Modal from '../Modal.svelte';

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
