import { createPoint, createRecipe, deletePoint, editPointName } from "./utils.js";
import { expect, test } from '@playwright/test';
import { gradePoint } from "./utils";

test('Can create,edit and delete a point', async ({ page }) => {
    await page.goto('/');
    await createRecipe(page, 'test-recipe')
    await createPoint(page, 'test-point', 'somedetails')
    await editPointName(page, 'test-point', 'something-new')
    await gradePoint(page, 'something-new')

    await deletePoint(page, 'test-point')
    await expect(page.locator('circle')).toBeHidden();


});

// test('Can edit Axis name, async ({ page })', async ({ page }) => {
//     return
// });

