import { createPoint, createRecipe, deletePoint, editPointDetails } from "./utils.ts";
import { expect, test } from '@playwright/test';

test('Can create,edit and delete a point', async ({ page }) => {
    await page.goto('/');
    await createRecipe(page, 'test-recipe')
    await createPoint(page, 'test-point', 'somedetails')
    await editPointDetails(page, 'test-point', 'something-new')
    await deletePoint(page, 'test-point')
    await expect(page.locator('circle')).toBeHidden();


});

// test('Can edit Axis name, async ({ page })', async ({ page }) => {
//     return
// });
