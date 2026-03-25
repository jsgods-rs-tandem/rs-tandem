import { test as base } from '@playwright/test';
import { SignInPage } from './pages/auth/sign-in-page';
import { SignUpPage } from './pages/auth/sign-up-page';
import { ModalPage } from './pages/common/modal-page';

interface MyFixtures {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  modalPage: ModalPage;
}

export const test = base.extend<MyFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  modalPage: async ({ page }, use) => {
    await use(new ModalPage(page));
  },
});

export { expect } from '@playwright/test';
