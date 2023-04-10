import { expect, test } from '@playwright/test';
import { createRecipe, deleteRecipe, editRecipeName } from './utils.ts';

test('Can create,edit and delete a Recipe', async ({ page }) => {
	await page.goto('/');
	await createRecipe(page, 'test');
	await editRecipeName(page, 'test', 'new-test');
	await deleteRecipe(page, 'new-test');
	await expect(page.getByTestId(`recipe-new-test`)).toBeHidden();
});

test('Show select recipe when current recipe is deleted', async ({ page }) => {
	await page.goto('/');
	await createRecipe(page, 'test');
	await deleteRecipe(page, 'test');
	await expect(page.getByTestId(`pick-a-recipe`)).toBeVisible();
});
