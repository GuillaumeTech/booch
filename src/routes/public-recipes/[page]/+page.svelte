<script>
	import { page } from '$app/stores';

	const recipes = $page.data.recipes;
	const pageNumber = Number($page.params.page);
</script>

<div class="recipes">
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
	<div class="pages">
		{#if pageNumber > 0}
			<a data-sveltekit-reload href={`/public-recipes/${pageNumber - 1}`}>Previous page</a>
		{/if}
		<a class="next" data-sveltekit-reload href={`/public-recipes/${pageNumber + 1}`}>Next page</a>
	</div>
</div>

<style lang="less">
	div.recipes {
		margin-left: 2rem;
		margin-right: 2rem;
	}
	div.pages {
		margin-top: 2rem;
		display: flex;
		flex-direction: row;
		.next {
			margin-left: auto;
		}
	}
	li {
		list-style-type: none;
	}
	ul {
		margin-top: 2rem;
		padding: 0;
		a {
			font-size: 1.2rem;
		}
	}
</style>
