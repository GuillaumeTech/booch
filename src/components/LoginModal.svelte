<script lang="ts">
	export let showModal: Boolean, onCancel: Function;
	enum LoginKind {
		GOOGLE = 'GOOGLE',
		EMAIL = 'EMAIL'
	}
	let dialog: HTMLDialogElement;
	let hasAccount = false;
	let loginStep = 0;
	let loginKind: LoginKind | undefined;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => {
		dialog.close();
		hasAccount = false;
		loginStep = 0;
		loginKind = undefined;
		onCancel();
	}}
	on:click|self={() => dialog.close()}
>
	{#if loginStep == 0}
		<div on:click|stopPropagation>
			<slot name="header" />
			<hr />
			<button
				on:click={() => {
					hasAccount = false;
					loginStep = 1;
				}}
			>
				I'm a new user
			</button>
			<button
				on:click={() => {
					hasAccount = true;
					loginStep = 1;
				}}
			>
				I have an account already
			</button>
		</div>
	{:else if loginStep == 1}
		<p>{hasAccount ? 'Login in using' : 'Create an account using'}</p>
		<button
			on:click={() => {
				loginKind = LoginKind.EMAIL;
				loginStep = 2;
			}}
			>Email
		</button>
		<button
			on:click={() => {
				loginKind = LoginKind.GOOGLE;
				loginStep = 2;
			}}
			>Google
		</button>
	{:else if loginStep == 2 && loginKind == LoginKind.EMAIL}
		<form>
			<label>E-mail</label>
			<input />
			<label>Password</label>
			<input />
			{#if !hasAccount}
				<label>Confirm Password</label>
				<input />
			{/if}
			<button>{hasAccount ? 'Login' : 'Create'} </button>
		</form>
	{/if}
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
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
	}
</style>
