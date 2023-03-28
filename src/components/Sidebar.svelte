<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import Modal from './Modal.svelte';
	import { recipes, activeRecipe } from '../stores/recipe';
	import Icon from './Icon.svelte';
	import LoginModal from './Modals/LoginModal.svelte';
	import { activeSession } from '../stores/supabase';
	import { supabase } from '../supabaseClient';

	let addingNewRecipe = false;
	let newRecipeName = '';
	let editingId = '';
	let editingName = '';
	let deletingId = '';
	let deletingName = '';
	let showDeleteConfirm = false;
	let showLoginModal = false;

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
</script>

<div class="side-bar">
	<ul>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		{#if !addingNewRecipe}
			<li
				class="add-recipe"
				on:click={() => {
					addingNewRecipe = true;
				}}
				data-testid="new-recipe"
			>
				+ new recipe
			</li>
		{:else}
			<li class="add-recipe">
				<input data-testid="new-recipe-name" type="text" bind:value={newRecipeName} />
				<button
					data-testid="add-new-recipe"
					on:click={() => {
						addNewRecipe();
						addingNewRecipe = false;
						newRecipeName = '';
					}}>add</button
				>
			</li>
		{/if}
		{#each recipesOrdered as { name, id } (id)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if editingId == id}
				<li class="edit-name">
					<input data-testid={`new-name-${name}`} type="text" bind:value={editingName} />
					<button
						on:click={(e) => {
							e.stopPropagation();
							editRecipeName(id, editingName);
							editingId = '';
							editingName = '';
						}}
						data-testid={`change-name-${name}`}
					>
						<Icon strokeWidth="4px" name="check" stroke="black" />
					</button>
				</li>
			{:else}
				<li
					on:click={() => {
						$activeRecipe = id;
					}}
					data-testid={`recipe-${name}`}
					class={$activeRecipe === id ? 'underline' : ''}
				>
					{name}
					<span
						><button
							on:click={(e) => {
								e.stopPropagation();
								editingId = id;
								editingName = name;
							}}
							data-testid={`edit-recipe-${name}`}
						>
							<Icon name="edit-2" fill="black" stroke="black" />
						</button>
						<button
							on:click={(e) => {
								e.stopPropagation();
								deletingId = id;
								deletingName = name;
								showDeleteConfirm = true;
							}}
							data-testid={`delete-recipe-${name}`}
						>
							<Icon name="trash" fill="black" stroke="black" />
						</button></span
					>
				</li>
			{/if}
		{/each}
	</ul>
	<ul class="more">
		{#if $activeSession}
			<li
				on:click={async () => {
					await supabase.auth.signOut();
				}}
			>
				Logout
			</li>
		{:else}
			<li
				on:click={() => {
					showLoginModal = true;
				}}
			>
				Login/Sign-up
			</li>
		{/if}
		<li>Help</li>
		<li>Contact</li>
		{#if activeSession}
			<li class="user">Logged as: {$activeSession.user.email}</li>
		{/if}
	</ul>
</div>
<Modal
	showModal={showDeleteConfirm}
	onCancel={() => {
		showDeleteConfirm = false;
		resetDeletingInfo();
	}}
	onOk={() => {
		showDeleteConfirm = false;
		deleteRecipe(deletingId);
		resetDeletingInfo();
	}}
>
	<b slot="header">Confirm</b>
	<p>Are you sure about deleting <b>{deletingName}</b> ? This can't be undone</p>
</Modal>
<LoginModal
	showModal={showLoginModal}
	onCancel={() => {
		showLoginModal = false;
	}}
/>

<style lang="less">
	div.side-bar {
		width: 25%;
		border-right: 2px solid salmon;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;

		> li {
			padding-top: 0.2rem;
			padding-bottom: 0.2rem;

			padding-left: 0.7rem;
			&:hover {
				background-color: salmon;
				color: white;
				cursor: pointer;
				button {
					filter: invert(1);
				}
			}
			&.underline {
				text-decoration: underline black;
				text-underline-offset: 0.15rem;
			}
			button {
				margin: 0;
				padding: 0 0.3rem;
				border: 0;
				background: none;
				transition: transform 0.1s;
				&:hover {
					transform: scale(1.2);
				}
			}
			span {
				float: right;
				margin-right: 0.5rem;
			}
			&.edit-name {
				display: flex;
				flex-direction: row;
				padding: 0;
				justify-content: space-between;
				input {
					padding-top: 0.1rem;
					padding-bottom: 0.1rem;
					font-family: 'Inter';
					font-style: italic;
					padding-left: 0.7rem;
					min-width: 5rem;
				}
				button {
					margin-left: 0.2rem;

					margin-right: 0.2rem;
				}
			}
		}
		&.more {
			border-top: 2px solid salmon;
			padding-top: 0.5rem;
		}
		li.user {
			overflow: hidden;
			border-top: 5px solid salmon;
			text-overflow: ellipsis;
			background: whitesmoke;
			color: black;
			&:hover {
				cursor: default;
			}
		}
	}
	.add-recipe {
		border-bottom: 2px solid salmon;
	}
</style>
