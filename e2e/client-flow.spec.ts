import { expect, test } from '@playwright/test';

test('a new client signs up, signs in, sees nothing submitted, then books', async ({ page }) => {
  await page.goto('/create-account');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('National ID number').fill('12345678');
  await page.getByLabel('First name').fill('Amina');
  await page.getByLabel('Last name').fill('Yusuf');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Mobile number').fill('0712 345 678');
  await page.getByLabel('Email').fill('amina@mail.example');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('group', { name: 'SMS code' }).locator('input').first().fill('1');
  await page.keyboard.type('23456');
  await page.getByRole('button', { name: 'Confirm and finish' }).click();

  await expect(page).toHaveURL(/\/sign-in\?created=1/);
  await expect(page.getByText('Your account is ready')).toBeVisible();
  await page.getByLabel('Phone or email').fill('amina@mail.example');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Sign in' }).last().click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/my-application');
  await expect(page.getByRole('heading', { name: 'No application submitted yet' })).toBeVisible();

  await page.getByRole('link', { name: 'Book an appointment' }).click();
  await page.getByLabel('Service').click();
  await page.getByRole('option', { name: 'Passport' }).click();
  await page.getByLabel('Hub').click();
  await page.getByRole('option', { name: 'Nairobi CBD Hub' }).click();
  await page.getByRole('radio').and(page.locator(':not([disabled])')).first().click();
  await page.getByRole('button', { name: 'Book appointment' }).click();
  await expect(page.getByRole('heading', { name: 'Your appointment is booked' })).toBeVisible();

  await page.getByRole('link', { name: 'Done' }).click();
  await expect(page.getByText('Your appointment')).toBeVisible();
});

test('the site can switch language and theme', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Government services');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Language' }).filter({ visible: true }).click();
  await page.getByRole('menuitemradio', { name: 'Français' }).click();
  if (isMobile) await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Les services publics');
  await page.getByRole('button', { name: 'Basculer entre le thème clair et sombre' }).click();
  await expect(page.locator('html')).toHaveClass(/dark|light/);
});
