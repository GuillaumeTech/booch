<script>
	import { field } from 'svelte-forms';
	import { page } from '$app/stores';
	import { required, email as emailValid } from 'svelte-forms/validators';
	import { errorsToText } from '$lib/forms';
	import { supabase } from '../../supabaseClient';

	const emailFromQuery = $page.url.searchParams.get('email');
	let sent = false;
	let loginError = false;
	const email = field('email', emailFromQuery, [required(), emailValid()]);
</script>

<form>
	{#if sent}
		<div>
			<h4>Sent !</h4>
			<p>
				We sent you an email with a reset link, If you didn't receive it check your spam folder as
				well, it could take a few minutes
			</p>
			<a href="/"> Go home</a>
		</div>
	{:else}
		<h4>Password Recovery</h4>
		<span>Enter your email-below and we will send you an email with a reset link</span>
		<label for="email">E-mail</label>
		<input autocomplete="email" id="email" type="email" bind:value={$email.value} />

		<small> {errorsToText($email.errors)}</small>
		<button
			disabled={!$email.valid}
			on:click={async () => {
				if ($email.value) {
					const { data, error } = await supabase.auth.resetPasswordForEmail($email.value, {
						redirectTo: window.location.origin // not /reset-password as it's included in the email template
					});

					if (!error) {
						sent = true;
					} else {
						loginError = true;
					}
				}
			}}
			>Send
		</button>
		{#if loginError}
			<small> Something went wrong, try again or contact us</small>
		{/if}
	{/if}
</form>

<style lang="less">
	form {
		display: flex;
		flex-direction: column;
		min-height: 20rem;
		max-width: 30rem;

		gap: 1rem;
		border: black 2px solid;
		padding: 2rem;
		margin: auto;
		margin-top: 25vh;
	}
	@media screen and (max-width: 600px) {
		form {
			border: transparent 2px solid;
		}
	}
	button {
		font-size: 1.2rem;
		padding: 1rem;
	}
	div {
		margin: auto;
		position: relative;
		top: 30%;
	}
	small {
		height: 1.2rem;
	}
</style>
