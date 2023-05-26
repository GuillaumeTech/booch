import { createPoint, createRecipe, deletePoint, editPointName, gradePoint } from './utils.ts';
import { expect, test } from '@playwright/test';

test('Can create,edit and delete a point', async ({ page }) => {
	await page.goto('/');
	await createRecipe(page, 'test-recipe');
	await createPoint(page, 'test-point', 'somedetails');
	await editPointName(page, 'test-point', 'something-new');
	await gradePoint(page, 'something-new');

	await deletePoint(page, 'something-new');
	await expect(page.locator('circle')).toBeHidden();
});

test('Cannot set grading to empty', async ({ page }) => {
	await page.goto('/');
	await createRecipe(page, 'test-recipe');
	await createPoint(page, 'test-point', 'somedetails');
	await editPointName(page, 'test-point', 'something-new');
	await gradePoint(page, 'something-new');

	// 	opens the edit modal
	await page.getByTestId('something-new').click();
	await page.getByTestId('edit-something-new').click();
	// empties the x value
	await page.getByTestId('xValue-something-new').fill('');
	// check that we can't save
	await expect(page.getByRole('button', { name: 'OK' })).toBeDisabled();
});
