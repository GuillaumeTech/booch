<script lang="ts">
	import { success } from '../../lib/toasters';
	import { supabase } from '../../supabaseClient';
	import { recipes } from '../../stores/recipe';
	import { firstLogin } from '../../stores/supabase';
	import { field, form, style } from 'svelte-forms';
	import { required, matchField, email as emailValid, min } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	export let showModal: Boolean, onCancel: Function;
	enum LoginKind {
		GOOGLE = 'GOOGLE',
		EMAIL = 'EMAIL'
	}

	enum LoginStep {
		DOES_ACCOUNT_EXIST = 'DOES_ACCOUNT_EXIST',
		PICK_KIND = 'PICK_KIND',
		ENTER_ACCOUNT_INFO = 'ENTER_ACCOUNT_INFO',
		ERROR = 'ERROR'
	}
	let dialog: HTMLDialogElement;
	let hasAccount = false;
	let loginStep: LoginStep = LoginStep.DOES_ACCOUNT_EXIST;
	let loginKind: LoginKind | undefined;
	let loginFailed: boolean = false;

	const email = field('email', '', [required(), emailValid()]);
	const password = field('password', '', [required(), min(6)]);
	const passwordConfirm = field('passwordConfirm', '', [matchField(password)]);
	const loginForm = form(email, password, passwordConfirm);
	async function login() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: $email.value,
			password: $password.value
		});

		if (!error) {
			success('You succesfully logged in !', { target: 'loggedin' });
			dialog.close();
		} else {
			loginFailed = true;
		}
	}

	async function createAccount() {
		firstLogin.set(true);
		const { data, error } = await supabase.auth.signUp({
			email: $email.value,
			password: $password.value,
			options: {
				emailRedirectTo: window.location.origin
			}
		});

		if (!error) {
			recipes.sendLocalStorageToSupabase();
			dialog.close();
		}
	}
	$: formEmtpy = !($email.value || $password.value || $passwordConfirm.value);
	$: if (dialog && showModal) dialog.showModal();
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
		loginFailed = false;
		email.reset();
		password.reset();
		passwordConfirm.reset();
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
			<!-- {:else if loginStep == LoginStep.PICK_KIND}
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
			</button> -->
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
				<input
					use:style={{ field: email, valid: 'valid', invalid: 'invalid' }}
					autocomplete="email"
					id="email"
					type="email"
					bind:value={$email.value}
				/>

				<small use:style={{ field: email, valid: 'valid-text', invalid: 'invalid-text' }}>
					{errorsToText($email.errors)}</small
				>
				<label for="password"> Password</label>
				<input
					required
					id="password"
					type="password"
					autocomplete={hasAccount ? 'current-password' : 'new-password'}
					bind:value={$password.value}
				/>
				<small use:style={{ field: password, valid: 'valid-text', invalid: 'invalid-text' }}>
					{errorsToText($password.errors, { min: 6 })}</small
				>
				{#if !hasAccount}
					<label for="password-confirm">Confirm Password</label>
					<input
						required
						id="password-confirm"
						autocomplete="new-password"
						type="password"
						bind:value={$passwordConfirm.value}
					/>
					<small
						use:style={{ field: passwordConfirm, valid: 'valid-text', invalid: 'invalid-text' }}
					>
						{errorsToText($passwordConfirm.errors, { min: 6 })}</small
					>
				{/if}
				<button disabled={!$loginForm.valid || formEmtpy} type="submit">
					{hasAccount ? 'Login' : 'Create'}</button
				>
				{#if loginFailed}
					<small use:style={{ field: password, valid: 'valid-text', invalid: 'invalid-text' }}>
						Login-in failed, <a class="recover" href={`/recover?email=${$email.value}`}>
							Recover your password</a
						></small
					>
				{/if}
			</form>
		{:else if loginStep == LoginStep.ERROR}
			<p>There was an error when login in</p>
		{/if}
	</div>
</dialog>

<style lang="less">
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
	label {
		margin-bottom: 0.2rem;
	}
	small {
		height: 1.2rem;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	a.recover {
		display: inline;
		width: auto;
		padding: 0;
		margin: 0;
		background: none;
		border: none;
		font-size: inherit;
		color: salmon;
		&:hover {
			text-decoration: underline;
			cursor: pointer;
		}
	}
</style>
