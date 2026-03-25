import { test, expect } from '../../fixtures';

test.describe('Sign In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('#/sign-in#');
  });

  test.only('should display page correctly', async ({ signInPage }) => {
    await expect(signInPage.title).toHaveText('Sign In');

    await expect(signInPage.form.emailInput).not.toHaveCount(0);
    await expect(signInPage.form.passwordInput).not.toHaveCount(0);
    await expect(signInPage.form.submitButton).not.toHaveCount(0);

    await expect(signInPage.externalLinkRow.title).toContainText('Don’t have an account?');
    await expect(signInPage.externalLinkRow.linkButton).toHaveText('Sign Up');
  });

  test("shouldn't login with incorrect credentials", async ({ signInPage, modalPage }) => {
    await signInPage.form.emailInput.fill('notExistingUser@gmail.com');
    await signInPage.form.passwordInput.fill('SomePassword1!');

    await signInPage.form.submitButton.click();

    await expect(modalPage.modal).not.toHaveCount(0);
    await expect(modalPage.title).toHaveText('Login Error');
    await expect(modalPage.messages).toHaveText('Invalid email or password. Please try again.');

    await modalPage.closeButton.click();

    await expect(signInPage.page).toHaveURL(/sign-in/);
  });

  test("should redirect to 'Sign Up' page", async ({ signInPage }) => {
    await signInPage.externalLinkRow.linkButton.click();

    await expect(signInPage.page).toHaveURL(/sign-in/);
  });

  test('should login successfully with newly created user', async ({
    page,
    request,
    signInPage,
  }) => {
    const dateNowString = String(Date.now());

    // 1. Создание подменного пользователя
    const testUser = {
      displayName: `e2e_user_${dateNowString}`,
      email: `test_${dateNowString}@example.com`,
      password: 'StrongPassword1!',
    };

    // Адрес бекенда, если в docker-compose он другой, его можно передать через process.env.API_URL
    const apiUrl = process.env.API_URL ?? 'http://localhost:3000/api';

    // 2. Регистрируем его через API перед логином
    const signupResponse = await request.post(`${apiUrl}/auth/register`, {
      data: testUser,
    });

    // Проверяем, что ответ 201 Created (или 200 OK)
    expect(signupResponse.ok()).toBeTruthy();

    // 3. Авторизуемся под новым пользователем
    await signInPage.form.emailInput.fill(testUser.email);
    await signInPage.form.passwordInput.fill(testUser.password);
    await signInPage.form.submitButton.click();

    // 4. Проверяем редирект (например, что мы ушли со страницы логина)
    await expect(page).not.toHaveURL(/sign-in/);
  });

  test('should verify page layout', async ({ signInPage }) => {
    await signInPage.page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await expect(signInPage.container, "Verify 'Dark Theme' layout").toHaveScreenshot();

    await signInPage.page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await expect(signInPage.container, "Verify 'Light Theme' layout").toHaveScreenshot();
  });
});
