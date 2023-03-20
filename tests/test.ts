import { expect, test, type Page } from '@playwright/test';

async function createRecipe(page: Page, recipeName: string) {
	await page.getByTestId('new-recipe').click();
	await page.getByTestId('new-recipe-name').click();
	await page.getByTestId('new-recipe-name').fill(recipeName);
	await page.getByTestId('add-new-recipe').click();
	await page.getByTestId(`recipe-${recipeName}`).click();
	await expect(page.getByRole('heading', { name: recipeName })).toHaveText(recipeName);
}

async function editRecipeName(page: Page, currentName: string, newName: string) {
	await page.getByTestId(`edit-recipe-${currentName}`).click();
	await page.getByTestId(`new-name-${currentName}`).click();
	await page.getByTestId(`new-name-${currentName}`).fill(newName);
	await page.getByTestId(`change-name-${currentName}`).click();
	await expect(page.getByRole('heading', { name: newName })).toHaveText(newName);

}

async function deleteRecipe(page: Page, recipeName: string) {
	await page.getByTestId(`delete-recipe-${recipeName}`).click();
	await page.getByRole('button', { name: 'OK' }).click();
}


test('Can create,edit and delete a Recipe', async ({ page }) => {
	await page.goto('/');
	await createRecipe(page, 'test')
	await editRecipeName(page, 'test', 'new-test')
	await deleteRecipe(page, 'new-test')
	await expect(page.getByTestId(`recipe-new-test`)).toBeHidden();
});

test('Show select recipe when current recipe is deleted', async ({ page }) => {
	await page.goto('/');
	await createRecipe(page, 'test')
	await deleteRecipe(page, 'test')
	await expect(page.getByTestId(`pick-a-recipe`)).toBeVisible();
});

