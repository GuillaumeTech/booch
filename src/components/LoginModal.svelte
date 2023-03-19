<script lang="ts">
	import { success } from '../lib/toasters';
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
		CHECK_EMAIL = 'CHECK_EMAIL'
	}
	let dialog: HTMLDialogElement;
	let hasAccount = false;
	let loginStep: LoginStep = LoginStep.DOES_ACCOUNT_EXIST;
	let loginKind: LoginKind | undefined;
	let email: string;
	let password: string;
	let passwordConfirm: string;
	let emailError = false;

	async function login() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (!error) {
			success('You succesfully logged in !', { target: 'loggedin' });
			dialog.close();
		}
	}

	async function createAccount() {
		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});
		console.log(error);

		if (!error) {
			loginStep = LoginStep.CHECK_EMAIL;
		}
	}

	$: if (dialog && showModal) dialog.showModal();
	$: passwordMatch = passwordConfirm === password;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- on:mousedown is better that on:click here
as when selecting something we might end out side the dialog 
thus triggerig onclick when releasing the mouse, mouse down prevent this -->
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
	on:mousedown|self={() => dialog.close()}
>
	<div class="login">
		{#if loginStep == LoginStep.DOES_ACCOUNT_EXIST}
			<div on:click|stopPropagation>
				<button
					on:click={() => {
						hasAccount = false;
						loginKind = LoginKind.EMAIL;
						loginStep = LoginStep.ENTER_ACCOUNT_INFO;
						// loginStep = LoginStep.PICK_KIND; // skip google for now
					}}
				>
					I'm a new user
				</button>
				<button
					on:click={() => {
						hasAccount = true;
						loginKind = LoginKind.EMAIL;
						loginStep = LoginStep.ENTER_ACCOUNT_INFO;
						// loginStep = LoginStep.PICK_KIND; // skip google for now
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
				autocomplete="on"
			>
				<label for="email">E-mail</label>
				<input autocomplete="email" id="email" type="email" bind:value={email} />
				{#if emailError}
					<b>The password do not match</b>
				{/if}
				<label for="password"> Password</label>
				<input
					id="password"
					type="password"
					autocomplete={hasAccount ? 'current-password' : 'new-password'}
					bind:value={password}
				/>
				{#if !hasAccount}
					<label for="password-confirm">Confirm Password</label>
					<input
						id="password-confirm"
						autocomplete="new-password"
						type="password"
						bind:value={passwordConfirm}
					/>
					{#if !passwordMatch}
						<b>The passwords do not match</b>
					{/if}
				{/if}
				<button type="submit"> {hasAccount ? 'Login' : 'Create'}</button>
			</form>
		{:else if loginStep == LoginStep.CHECK_EMAIL}
			<p>Check your email for the verification link</p>
		{:else if loginStep == LoginStep.ERROR}
			<p>There was an error when login in</p>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		width: 30%;
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
		width: 100%;
		padding: 1rem;
		margin: 0.5rem 0 0.5rem 0;
	}
	.login {
		margin: 0.5rem 0.2rem 0.5rem 0.2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	form {
		display: flex;
		flex-direction: column;
	}
</style>
