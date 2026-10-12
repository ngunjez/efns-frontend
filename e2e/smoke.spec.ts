import { expect, test, type Page } from '@playwright/test';

test('a visitor sees the services and can start a booking', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Government services');
  await expect(page.getByText('eFNS Work Permit').first()).toBeVisible();
});

test('staff sign in with a code and land on their role home', async ({ page }) => {
  await page.goto('/staff/sign-in');
  await page.getByLabel('Work email').fill('grace.mwangi@nairobicbd.aaas.example');
  await page.getByLabel('Password').fill('any-password');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('group', { name: 'Authenticator code' }).locator('input').first().fill('4');
  await page.keyboard.type('82105');
  await page.getByRole('button', { name: 'Verify and sign in' }).click();
  await expect(page).toHaveURL(/\/desk\/service-point/);
  await expect(page.getByText('Next in my queue')).toBeVisible();
});

test('a role cannot open a screen outside its permissions', async ({ page }) => {
  await page.goto('/staff/sign-in?next=/admin/settings/roles');
  await page.getByLabel('Work email').fill('grace.mwangi@nairobicbd.aaas.example');
  await page.getByLabel('Password').fill('any-password');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('group', { name: 'Authenticator code' }).locator('input').first().fill('1');
  await page.keyboard.type('23456');
  await page.getByRole('button', { name: 'Verify and sign in' }).click();
  await expect(page.getByRole('heading', { name: 'You do not have access' })).toBeVisible();
});

const signIn = async (page: Page, email: string) => {
  await page.goto('/staff/sign-in');
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password').fill('any-password');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('group', { name: 'Authenticator code' }).locator('input').first().fill('1');
  await page.keyboard.type('23456');
  await page.getByRole('button', { name: 'Verify and sign in' }).click();
};

for (const [email, landing] of [
  ['njeri.mwangi@aaas.example', /\/admin\/network/],
  ['wanjiku.kamau@aaas.example', /\/desk\/floorboard/],
  ['mary.achieng@aaas.example', /\/desk\/appointments/],
  ['samuel.kiprop@aaas.example', /\/admin\/vault/],
] as const) {
  test(`${email.split('@')[0]} lands on their own home`, async ({ page }) => {
    await signIn(page, email);
    await expect(page).toHaveURL(landing);
  });
}

test('an unknown staff email is refused', async ({ page }) => {
  await page.goto('/staff/sign-in');
  await page.getByLabel('Work email').fill('nobody@aaas.example');
  await page.getByLabel('Password').fill('any-password');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
});
