<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import Modal from './Modal.svelte';
	import { recipes, activeRecipe } from '../stores/recipe';
	import Icon from './Icon.svelte';
	import LoginModal from './LoginModal.svelte';
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
			>
				+ new recipe
			</li>
		{:else}
			<li class="add-recipe">
				<input type="text" bind:value={newRecipeName} />
				<button
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
				<li>
					<input type="text" bind:value={editingName} />
					<button
						on:click={(e) => {
							e.stopPropagation();
							editRecipeName(id, editingName);
							editingId = '';
							editingName = '';
						}}
					>
						<Icon strokeWidth="4px" name="check" stroke="black" />
					</button>
				</li>
			{:else}
				<li
					on:click={() => {
						$activeRecipe = id;
					}}
				>
					{name}
					<span
						><button
							on:click={(e) => {
								e.stopPropagation();
								editingId = id;
								editingName = name;
							}}
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

		<li>About</li>
		<li>Contact</li>
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
				button {
					filter: invert(1);
				}
			}
			button {
				margin: 0;
				padding: 0;
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
		}
		&.more {
			border-top: 2px solid salmon;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
		}
	}
	.add-recipe {
		border-bottom: 2px solid salmon;
	}
</style>
