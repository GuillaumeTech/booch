<script lang="ts">
	import { supabase } from '../supabaseClient';

	export let showModal: Boolean, onCancel: Function;
	enum LoginKind {
		GOOGLE = 'GOOGLE',
		EMAIL = 'EMAIL'
	}

	enum LoginStep {
		DOES_ACCOUNT_EXIST = 'DOES_ACCOUNT_EXIST',
		PICK_KIND = 'PICK_KIND',
		ENTER_ACCOUNT_INFO = 'ENTER_ACCOUNT_INFO',
		ERROR = 'ERROR',
		CHECK_EMAIL = 'CHECK_EMAIL',
		LOGGED_IN = 'LOGGED_IN'
	}
	let dialog: HTMLDialogElement;
	let hasAccount = false;
	let loginStep: LoginStep = LoginStep.DOES_ACCOUNT_EXIST;
	let loginKind: LoginKind | undefined;
	let email = '';
	let password = '';
	let passwordConfirm = '';
	let emailError = false;

	async function login() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (!error) {
			loginStep = LoginStep.LOGGED_IN;
		}
	}

	async function createAccount() {
		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});
		if (!error) {
			loginStep = LoginStep.CHECK_EMAIL;
		}
	}

	$: if (dialog && showModal) dialog.showModal();
	$: passwordMatch = passwordConfirm === password;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => {
		dialog.close();
		hasAccount = false;
		loginStep = LoginStep.DOES_ACCOUNT_EXIST;
		loginKind = undefined;
		email = '';
		password = '';
		passwordConfirm = '';
		onCancel();
	}}
	on:click|self={() => dialog.close()}
>
	{#if loginStep == LoginStep.DOES_ACCOUNT_EXIST}
		<div on:click|stopPropagation>
			<hr />
			<button
				on:click={() => {
					hasAccount = false;
					loginStep = LoginStep.PICK_KIND;
				}}
			>
				I'm a new user
			</button>
			<button
				on:click={() => {
					hasAccount = true;
					loginStep = LoginStep.PICK_KIND;
				}}
			>
				I have an account already
			</button>
		</div>
	{:else if loginStep == LoginStep.PICK_KIND}
		<p>{hasAccount ? 'Login in using' : 'Create an account using'}</p>
		<button
			on:click={() => {
				loginKind = LoginKind.EMAIL;
				loginStep = LoginStep.ENTER_ACCOUNT_INFO;
			}}
			>Email
		</button>
		<button
			on:click={() => {
				loginKind = LoginKind.GOOGLE;
				loginStep = LoginStep.ENTER_ACCOUNT_INFO;
			}}
			>Google
		</button>
	{:else if loginStep == LoginStep.ENTER_ACCOUNT_INFO && loginKind == LoginKind.EMAIL}
		<form
			on:submit={() => {
				if (hasAccount) {
					login();
				} else {
					createAccount();
				}
			}}
		>
			<label>E-mail</label>
			<input autocomplete="email" type="email" bind:value={email} />
			{#if emailError}
				<b>The password do not match</b>
			{/if}
			<label> Password</label>
			<input type="password" bind:value={password} />
			{#if !hasAccount}
				<label>Confirm Password</label>
				<input type="password" bind:value={passwordConfirm} />
				{#if !passwordMatch}
					<b>The passwords do not match</b>
				{/if}
			{/if}

			<input type="submit" value={hasAccount ? 'Login' : 'Create'} />
		</form>
	{:else if loginStep == LoginStep.CHECK_EMAIL}
		<p>Check your email for the verification link</p>
	{:else if loginStep == LoginStep.LOGGED_IN}
		<p>You succesfully logged in !</p>
	{:else if loginStep == LoginStep.ERROR}
		<p>There was an error when login in</p>
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
