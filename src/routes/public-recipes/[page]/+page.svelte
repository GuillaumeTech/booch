<script>
	import { page } from '$app/stores';

	const recipes = $page.data.recipes;
	const pageNumber = Number($page.params.page);
</script>

<li>
	{#each recipes as { id, name, description } (id)}
		<ul>
			<a href={`/recipe/${id}`}>{name}</a>

			{#if description}
				<p>{description}</p>
			{:else}
				<p><i>no description</i></p>
			{/if}
		</ul>
	{/each}
</li>
<div>
	<a data-sveltekit-reload href={`/public-recipes/${pageNumber + 1}`}>Next page</a>
	{#if pageNumber > 0}
		<a data-sveltekit-reload href={`/public-recipes/${pageNumber - 1}`}>Previous page</a>
	{/if}
</div>

<style lang="less">
	li {
		list-style-type: none;
	}
	ul {
		margin-top: 2rem;
		a {
			font-size: 1.2rem;
		}
	}
</style>
