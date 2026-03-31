import { Locator, Page } from '@playwright/test';

interface SignUpForm {
  usernameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
}

interface ExternalLinkRow {
  title: Locator;
  linkButton: Locator;
}

class SignUpPage {
  page: Page;
  container: Locator;
  title: Locator;
  form: SignUpForm;
  externalLinkRow: ExternalLinkRow;

  constructor(page: Page) {
    this.page = page;

    this.container = page.getByTestId('auth-page-container');

    this.form = {
      usernameInput: page.getByLabel('Username'),
      emailInput: page.getByLabel('Email'),
      passwordInput: page.getByTestId('password-input'),
      submitButton: page.getByTestId('submit-btn'),
    };

    this.title = page.getByRole('heading');

    this.externalLinkRow = {
      title: page.getByTestId('external-link-row__title'),
      linkButton: page.getByTestId('external-link-row__link-button'),
    };
  }
}

export { SignUpPage };
