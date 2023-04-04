<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { recipes, activeRecipe } from '../../stores/recipe';
	import LoginModal from './Modals/LoginModal.svelte';
	import { activeSession } from '../../stores/supabase';
	import { supabase } from '../../supabaseClient';
	import { displaySideBarResponsive } from '../../stores/display';
	import DeleteModal from './Modals/DeleteModal.svelte';
	import IconButton from './IconButton.svelte';
	import Recipe from './Recipe.svelte';

	let addingNewRecipe = false;
	let newRecipeName = '';
	let editingId = '';
	let editingName = '';
	let deletingId = '';
	let deletingName = '';
	let showDeleteConfirm = false;
	let showLoginModal = false;
	let newRecipeRef: HTMLInputElement;
	let recipeNameEditRef: HTMLInputElement;

	function addNewRecipe() {
		if (newRecipeName === '') return; // can't create a no name recipe
		const id = uuidv4();
		const newRecipe = {
			name: newRecipeName,
			id,
			points: [],
			axisNames: { x: 'Funk', y: 'Dryness' },
			public: false,
			created_at: new Date()
		};
		recipes.add(newRecipe);
	}

	function editRecipeName(recipeId: string, newName: string) {
		recipes.updateName(recipeId, newName);
	}

	function deleteRecipe(id: string) {
		recipes.remove(id);
	}

	function resetDeletingInfo() {
		deletingId = '';
		deletingName = '';
	}

	// order by created at date
	$: recipesOrdered = $recipes
		? Object.entries($recipes)
				.sort(([_, RecipeA], [__, RecipeB]) => {
					return RecipeA.created_at.valueOf() - RecipeB.created_at.valueOf();
				})
				.map(([_, recipe]) => recipe) // easier to render straight from the array
		: [];
	$: if (newRecipeRef) newRecipeRef.focus();
	$: if (recipeNameEditRef) recipeNameEditRef.focus();
</script>

<div class={`side-bar ${$displaySideBarResponsive ? 'responsive-display' : ''}`}>
	<ul>
		{#if !addingNewRecipe}
			<li class="add-recipe" data-testid="new-recipe">
				<button
					on:click={() => {
						addingNewRecipe = true;
					}}>+ new recipe</button
				>
			</li>
		{:else}
			<li class="adding-recipe">
				<form
					on:submit|preventDefault={() => {
						addNewRecipe();
						addingNewRecipe = false;
						newRecipeName = '';
					}}
				>
					<input
						bind:this={newRecipeRef}
						data-testid="new-recipe-name"
						type="text"
						bind:value={newRecipeName}
					/>
					<IconButton
						iconName="check"
						fill="black"
						stroke="black"
						margins={{ left: '0.2rem', right: '0.2rem' }}
						on:click={() => {
							addNewRecipe();
							addingNewRecipe = false;
							newRecipeName = '';
						}}
						data-testid={`add-new-recipe`}
					/>
				</form>
			</li>
		{/if}
	</ul>
	<ul class="recipes">
		<!-- svelte-ignore a11y-click-events-have-key-events -->

		{#each recipesOrdered as { name, id } (id)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if editingId == id}
				<li class="edit-name">
					<form
						on:submit|preventDefault={(e) => {
							e.stopPropagation();
							editRecipeName(id, editingName);
							editingId = '';
							editingName = '';
						}}
					>
						<input
							bind:this={recipeNameEditRef}
							data-testid={`new-name-${name}`}
							type="text"
							bind:value={editingName}
						/>
						<IconButton
							iconName="check"
							fill="black"
							stroke="black"
							margins={{ left: '0.2rem', right: '0.2rem', top: '0.2rem', bottom: '0.2rem' }}
							on:click={(e) => {
								e.stopPropagation();
								editRecipeName(id, editingName);
								editingId = '';
								editingName = '';
							}}
							data-testid={`change-name-${name}`}
						/>
					</form>
				</li>
			{:else}
				<li
					data-testid={`recipe-${name}`}
					class={`menu-item ${$activeRecipe === id ? 'underline' : ''}`}
				>
					<button
						on:click={() => {
							$activeRecipe = id;
						}}>{name}</button
					>

					<span
						><IconButton
							iconName="edit-2"
							fill="black"
							stroke="black"
							on:click={(e) => {
								e.stopPropagation();
								editingId = id;
								editingName = name;
							}}
							data-testid={`edit-recipe-${name}`}
						/>
						<IconButton
							iconName="trash"
							fill="black"
							stroke="black"
							on:click={(e) => {
								e.stopPropagation();
								deletingId = id;
								deletingName = name;
								showDeleteConfirm = true;
							}}
							data-testid={`delete-recipe-${name}`}
						/>
					</span>
				</li>
			{/if}
		{/each}
	</ul>
	<ul class="more">
		<li>
			{#if $activeSession}
				<button
					on:click={async () => {
						const { error } = await supabase.auth.signOut();
						if (!error) {
							recipes.clearLocalState();
						}
					}}
				>
					Logout
				</button>
			{:else}
				<button
					on:click={() => {
						showLoginModal = true;
					}}
				>
					Login/Sign-up
				</button>
			{/if}
		</li>
		<li class="help-contact"><a href="/help">Help/About</a></li>
		<li class="help-contact"><a href="/contact">Contact</a></li>

		{#if activeSession && $activeSession?.user}
			<li class="user">Logged as: {$activeSession.user.email}</li>
		{/if}
	</ul>
</div>

<DeleteModal
	showModal={showDeleteConfirm}
	deleting={deletingName}
	onCancel={() => {
		showDeleteConfirm = false;
		resetDeletingInfo();
	}}
	onOk={() => {
		showDeleteConfirm = false;
		deleteRecipe(deletingId);
		resetDeletingInfo();
	}}
/>
<LoginModal
	showModal={showLoginModal}
	onCancel={() => {
		showLoginModal = false;
	}}
/>

<button
	class={`side-bar-dimmer ${$displaySideBarResponsive ? 'responsive-display' : ''}`}
	on:click|self={() => {
		displaySideBarResponsive.set(false);
	}}
/>

<style lang="less">
	div.side-bar {
		width: 25%;

		min-width: 16rem;
		border-right: 2px solid var(--main-color);
		overflow: auto;
		display: flex;
		flex-direction: column;
		// justify-content: space-between;
	}

	.side-bar-dimmer {
		display: none;
	}
	@media screen and (max-width: 800px) {
		div.side-bar {
			left: -20rem; //outside ou screen when not active
			position: absolute;
			top: 0;
			height: 100%;
			padding: 1rem;
			min-width: 12rem;
			width: 15rem;
			z-index: 10;
			background: white url('/bg-texture.png');
			transition: left 200ms ease-out;
		}

		div.side-bar.responsive-display {
			left: 0; //bring it in
		}

		button.side-bar-dimmer {
			content: '';
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.2);
		}
		button.side-bar-dimmer.responsive-display {
			display: block;
		}
	}
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		&.recipes {
			overflow-y: auto;
		}
		> li {
			padding: 0;
			button {
				display: block;
				border: none;
				padding-top: 0.2rem;
				padding-bottom: 0.2rem;

				padding-left: 0.7rem;
				transition: none;
				text-align: left;
			}

			&:hover {
				background-color: var(--main-color);
				color: white;
				cursor: pointer;

				a {
					color: white;
				}
				button {
					color: white;
				}
			}
			&.help-contact {
				padding: 0;
				&:hover {
					a {
						color: white;
					}
				}
				a {
					width: 100%;
					height: 100%;
					padding-top: 0.2rem;
					padding-bottom: 0.2rem;
					color: black;
					text-decoration: none;
					padding-left: 0.7rem;
					display: block;
				}
			}
			&.underline {
				font-weight: 800;
			}
			&.menu-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				button {
					white-space: nowrap;
					text-overflow: ellipsis;
					flex-wrap: wrap;
					overflow: hidden;
				}
				span {
					margin-right: 0.5rem;
					min-width: 4rem;
				}
			}

			&.edit-name,
			&.adding-recipe {
				padding: 0;
				form {
					display: flex;
					flex-direction: row;

					justify-content: space-between;
					input {
						padding-top: 0.1rem;
						padding-bottom: 0.1rem;
						font-family: 'Inter';
						font-style: italic;
						padding-left: 0.7rem;
						min-width: 5rem;
					}
				}
			}
		}
		&.more {
			margin-top: auto;
			border-top: 2px solid var(--main-color);
			padding-top: 0.5rem;
		}
		li.user {
			overflow: hidden;
			border-top: 5px solid var(--main-color);
			text-overflow: ellipsis;
			background: whitesmoke;
			color: black;
			&:hover {
				cursor: default;
			}
		}
	}
	.add-recipe {
		border-bottom: 2px solid var(--main-color);
	}
</style>
