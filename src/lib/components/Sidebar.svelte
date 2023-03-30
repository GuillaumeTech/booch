<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { recipes, activeRecipe } from '../../stores/recipe';
	import LoginModal from './Modals/LoginModal.svelte';
	import { activeSession } from '../../stores/supabase';
	import { supabase } from '../../supabaseClient';
	import { displaySideBarResponsive } from '../../stores/display';
	import DeleteModal from './Modals/DeleteModal.svelte';
	import IconButton from './IconButton.svelte';

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

<div class={`side-bar ${$displaySideBarResponsive ? 'responsive-display' : ''}`}>
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
					<IconButton
						iconName="check"
						fill="black"
						stroke="black"
						on:click={(e) => {
							e.stopPropagation();
							editRecipeName(id, editingName);
							editingId = '';
							editingName = '';
						}}
						data-testid={`change-name-${name}`}
					/>
				</li>
			{:else}
				<li
					on:click={() => {
						$activeRecipe = id;
					}}
					data-testid={`recipe-${name}`}
					class={`menu-item ${$activeRecipe === id ? 'underline' : ''}`}
				>
					<div>{name}</div>

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

<div
	class={`side-bar-dimmer ${$displaySideBarResponsive ? 'responsive-display' : ''}`}
	on:click|self={() => {
		displaySideBarResponsive.set(false);
	}}
/>

<style lang="less">
	div.side-bar {
		width: 25%;

		min-width: 16rem;
		border-right: 2px solid salmon;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
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

		div.side-bar-dimmer {
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
		div.side-bar-dimmer.responsive-display {
			display: block;
		}
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
				font-weight: 800;
			}
			&.menu-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				div {
					white-space: nowrap;
					text-overflow: ellipsis;
					flex-wrap: wrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				span {
					margin-right: 0.5rem;
					min-width: 4rem;
				}
			}
			button {
				margin: 0;
				padding: 0 0.3rem;
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
