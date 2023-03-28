<script lang="ts">
	export let showModal: Boolean, onOk: Function, onCancel: Function, disableOK: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => {
		dialog.close();
		onCancel();
	}}
	on:mousedown|self={() => dialog.close()}
>
	<div class="modal-content" on:click|stopPropagation>
		<slot name="header" />
		<slot />
		<span
			><button
				on:click={() => {
					onCancel();
					dialog.close();
				}}
				data-testid="cancel-modal">Cancel</button
			>
			<!-- svelte-ignore a11y-autofocus -->
			<button
				autofocus
				data-testid="ok-modal"
				disabled={disableOK}
				on:click={() => {
					onOk();
					dialog.close();
				}}>OK</button
			></span
		>
	</div>
</dialog>

<style>
	dialog {
		max-width: 35rem;
		border: 2px solid black;
		background-image: url('/bg-texture.png');
		padding: 0;
		width: 35rem;
	}
	@media (max-width: 40rem) {
		dialog {
			width: 90%;
		}
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
		font-size: 1rem;
		padding: 0.5rem 2rem;
	}
	span {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 1rem;
	}
	.modal-content {
		margin: 0.5rem;
	}
</style>
