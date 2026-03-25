import { test, expect } from '../../fixtures';

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/sign-up#');
  });

  test('should display page correctly', async ({ signUpPage }) => {
    await expect(signUpPage.title).toHaveText('Sign Up');

    await expect(signUpPage.form.usernameInput).not.toHaveCount(0);
    await expect(signUpPage.form.emailInput).not.toHaveCount(0);
    await expect(signUpPage.form.passwordInput).not.toHaveCount(0);
    await expect(signUpPage.form.submitButton).not.toHaveCount(0);

    await expect(signUpPage.externalLinkRow.title).toContainText('Already have an account?');
    await expect(signUpPage.externalLinkRow.linkButton).toHaveText('Sign In');
  });

  test('should show modal on registration error (duplicate email)', async ({
    signUpPage,
    modalPage,
    request,
    apiURL,
  }) => {
    const dateNowString = String(Date.now());

    const testUser = {
      displayName: `e2e_dup_${dateNowString}`,
      email: `dup_${dateNowString}@example.com`,
      password: 'StrongPassword1!',
    };

    // Создаем пользователя через API, чтобы email был занят
    const response = await request.post(`${apiURL}/auth/register`, { data: testUser });
    expect(response.ok()).toBeTruthy();

    // Пытаемся зарегистрироваться с тем же email через UI
    await signUpPage.form.usernameInput.fill('another_user');
    await signUpPage.form.emailInput.fill(testUser.email);
    await signUpPage.form.passwordInput.fill(testUser.password);
    await signUpPage.form.submitButton.click();

    await expect(modalPage.modal).toBeVisible();
    await expect(modalPage.title).toHaveText('Registration Error');
  });

  test("should redirect to 'Sign In' page", async ({ signUpPage }) => {
    await signUpPage.externalLinkRow.linkButton.click();

    await expect(signUpPage.page).toHaveURL(/sign-in/);
  });

  test('should register successfully', async ({ signUpPage }) => {
    const timestamp = String(Date.now());

    await signUpPage.form.usernameInput.fill(`e2e_user_${timestamp}`);
    await signUpPage.form.emailInput.fill(`signup_${timestamp}@example.com`);
    await signUpPage.form.passwordInput.fill('StrongPassword1!');
    await signUpPage.form.submitButton.click();

    // После успешной регистрации происходит редирект на страницу логина
    await expect(signUpPage.page).toHaveURL(/sign-in/);
  });

  test('should verify page layout', async ({ signUpPage }) => {
    await signUpPage.page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await expect(signUpPage.container, "Verify 'Dark Theme' layout").toHaveScreenshot();

    await signUpPage.form.submitButton.click();

    await signUpPage.page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await signUpPage.form.submitButton.click();

    await expect(signUpPage.container, "Verify 'Light Theme' layout").toHaveScreenshot();
  });
});
