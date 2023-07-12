<script>
	import { field, form } from 'svelte-forms';
	import { page } from '$app/stores';
	import { required, matchField, min } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	import { supabase } from '../../supabaseClient';

	let success = false;
	let resetError = false;
	const password = field('password', '', [required(), min(6)]);
	const passwordConfirm = field('passwordConfirm', '', [matchField(password)]);
	const resetForm = form(password, passwordConfirm);
</script>

<form>
	{#if success}
		<div>
			<h4>All good !</h4>
			<p>Your password has been reset, you are now logged in.</p>
			<a href="/"> Go back to the app</a>
		</div>
	{:else}
		<h4>Create a new password</h4>
		<label for="password">New Password</label>
		<input autocomplete="new-password" id="password" type="password" bind:value={$password.value} />
		<small> {errorsToText($password.errors)}</small>
		<label for="passwordConfirm">Confirm password</label>

		<input
			autocomplete="new-password"
			id="passwordConfirm"
			type="password"
			bind:value={$passwordConfirm.value}
		/>

		<small> {errorsToText($passwordConfirm.errors)}</small>
		<button
			disabled={!$resetForm.valid}
			on:click={async () => {
				if ($resetForm.valid) {
					const { data, error } = await supabase.auth.updateUser({
						password: $password.value
					});
					if (!error) {
						success = true;
					} else {
						resetError = true;
					}
				}
			}}
			>Reset
		</button>
		{#if resetError}
			<small> Something went wrong, try again or contact us</small>
		{/if}
	{/if}
</form>

<style lang="less">
	form {
		display: flex;
		flex-direction: column;

		max-width: 30rem;

		gap: 1rem;
		border: black 2px solid;
		padding: 2rem;
		margin: auto;
		margin-top: 25rem;
	}
	@media screen and (max-width: 600px) {
		form {
			border: transparent 2px solid;
			top: 0;
		}
	}
	button {
		font-size: 1.2rem;
		padding: 1rem;
	}
	div {
		margin: auto;
		position: relative;
	}
	small {
		height: 1.2rem;
	}
</style>
