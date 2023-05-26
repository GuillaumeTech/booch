<script>
	import { recipes } from '../../stores/recipe';

	const dataStr =
		'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($recipes, null, 2));
</script>

<div>
	<a href="/"> Go back to the app</a>
	<p>If you want a backup or do whatever fancy stuff with your data you can download it here.</p>
	<p>
		Ultimately, This is your data so you should be able to have full access to it, for whatever
		reason you see fit
	</p>
	<a href={dataStr} download={'myfermentationnotes-data.json'}> <button>Download</button></a>
</div>

<style lang="less">
	div {
		display: flex;
		flex-direction: column;
		max-width: 30rem;

		gap: 1rem;
		border: black 2px solid;
		padding: 2rem;
		margin: auto;
	}
	@media screen and (max-width: 600px) {
		div {
			border: transparent 2px solid;
		}
	}

	h2 {
		margin-top: 2rem;
		span {
			font-family: Oi;
			font-size: 1.2rem;
			color: var(--main-color);
		}
	}
	h3 {
		margin-top: 1rem;
	}

	button {
		width: 100%;
	}
</style>
