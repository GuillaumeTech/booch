import { createPoint, createRecipe, deletePoint, editPointName, gradePoint } from "./utils.ts";
import { expect, test } from '@playwright/test';

test('Can create,edit and delete a point', async ({ page }) => {
    await page.goto('/');
    await createRecipe(page, 'test-recipe')
    await createPoint(page, 'test-point', 'somedetails')
    await editPointName(page, 'test-point', 'something-new')
    await gradePoint(page, 'something-new')

    await deletePoint(page, 'something-new')
    await expect(page.locator('circle')).toBeHidden();


});

// test('Can edit Axis name, async ({ page })', async ({ page }) => {
//     return
// });

