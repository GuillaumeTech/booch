
import { expect, type Page } from '@playwright/test';
import type { NewPoint } from '../src/types/recipe';

export async function createRecipe(page: Page, recipeName: string) {
    await page.getByTestId('new-recipe').click();
    await page.getByTestId('new-recipe-name').click();
    await page.getByTestId('new-recipe-name').fill(recipeName);
    await page.getByTestId('add-new-recipe').click();
    await page.getByTestId(`recipe-${recipeName}`).click();
    await expect(page.getByRole('heading', { name: recipeName })).toHaveText(recipeName);
}

export async function editRecipeName(page: Page, currentName: string, newName: string) {
    await page.getByTestId(`edit-recipe-${currentName}`).click();
    await page.getByTestId(`new-name-${currentName}`).click();
    await page.getByTestId(`new-name-${currentName}`).fill(newName);
    await page.getByTestId(`change-name-${currentName}`).click();
    await expect(page.getByRole('heading', { name: newName })).toHaveText(newName);

}

export async function deleteRecipe(page: Page, recipeName: string) {
    await page.getByTestId(`delete-recipe-${recipeName}`).click();
    await page.getByRole('button', { name: 'OK' }).click();
}


export async function editAxes(page: Page, axisNames: { x: string, y: string }) {
    return
}


export async function createPoint(page: Page, title: string, details: string) {
    await page.getByTestId('new-point').click();
    await page.getByTestId('graph').click();
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Details').click();
    await page.getByLabel('Details').fill(details)
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByTestId(title)).toBeVisible()
}

export async function editPointDetails(page: Page, pointName: string, newDetails: string) {
    await page.getByTestId(pointName).click();
    await page.getByTestId(`edit-${pointName}`).click();
    await page.getByTestId(`edit-details-${pointName}`).click();
    await page.getByTestId(`edit-details-${pointName}`).fill(newDetails);
    await page.getByTestId(`edit-${pointName}`).click(); // this is like clicking on done
    await expect(page.getByTestId(`details-${pointName}`)).toHaveText(newDetails)
}

export async function deletePoint(page: Page, pointName: string) {
    await page.getByTestId(pointName).click();
    await page.getByTestId(`delete-${pointName}`).click();
    await expect(page.getByTestId(pointName)).toBeHidden()

}