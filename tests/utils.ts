import { expect, type Locator, type Page } from '@playwright/test';
import type { NewPoint } from '../src/types/recipe';

/**
 * drag locator from center of element to center of target locator element
 * @param locatorToDrag - Locator to drag
 * @param locatorDragTarget - Locator to drag to
 */
async function dragAndDrop(page: Page, locatorToDrag: Locator, locatorDragTarget: Locator) {
	const toDragBox = await locatorToDrag.boundingBox();
	const dragTargetBox = await locatorDragTarget.boundingBox();

	await page.mouse.move(toDragBox!.x + toDragBox!.width / 2, toDragBox!.y + toDragBox!.height / 2);
	await page.mouse.down();
	await page.mouse.move(
		dragTargetBox!.x + dragTargetBox!.width / 2,
		dragTargetBox!.y + dragTargetBox!.height / 2
	);
	await page.mouse.up();
}

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

export async function editAxes(
	page: Page,
	currentName: string,
	axisNames: { x: string; y: string }
) {
	await page.getByTestId(`settings`).click();
	await page.getByTestId(`xaxis-name`).click();
	await page.getByTestId(`xaxis-name`).fill(axisNames.x);
	await page.getByTestId(`yaxis-name`).click();
	await page.getByTestId(`yaxis-name`).fill(axisNames.y);
	await page.getByRole('button', { name: 'OK' }).click();

	await expect(page.getByTestId('x-axis')).toHaveText(axisNames.x);
	await expect(page.getByTestId('y-axis')).toHaveText(axisNames.y);
}

export async function createPoint(page: Page, title: string, details: string) {
	await page.getByTestId('add-ferment').click();
	await page.getByLabel('Title').click();
	await page.getByLabel('Title').fill(title);
	await page.getByLabel('Details').click();
	await page.getByLabel('Details').fill(details);
	await page.getByTestId('add-date').click();
	await page.getByTestId('title-0').click();
	await page.getByTestId('title-0').fill('start');
	await page.getByTestId('date-0').fill('2023-03-25');
	await page.getByRole('button', { name: 'OK' }).click();
	await expect(page.getByTestId(`jar-${title}`)).toBeVisible();
}

export async function editPointName(page: Page, pointName: string, newName: string) {
	await page.getByTestId(`jar-${pointName}`).click();
	await page.getByLabel('Title').click();
	await page.getByLabel('Title').fill(newName);
	await page.getByRole('button', { name: 'OK' }).click();
	await expect(page.getByTestId(`text-${newName}`)).toBeVisible();
}

export async function gradePoint(page: Page, pointName: string) {
	const jar = await page.getByTestId(`jar-${pointName}`);
	const graph = await page.getByTestId('graph');
	// couldn't get jar.dragTo work so using a custom one
	dragAndDrop(page, jar, graph);

	await expect(page.getByTestId(pointName)).toBeVisible();
}

export async function deletePoint(page: Page, pointName: string) {
	await page.getByTestId(pointName).click();
	await page.getByTestId(`delete-${pointName}`).click();
	await page.getByRole('button', { name: 'OK' }).click();
	await expect(page.getByTestId(pointName)).toBeHidden();
}
