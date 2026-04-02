import { Locator, Page } from '@playwright/test';

interface SignInForm {
  emailInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
}

interface ExternalLinkRow {
  title: Locator;
  linkButton: Locator;
}

class SignInPage {
  page: Page;
  container: Locator;
  title: Locator;
  form: SignInForm;
  externalLinkRow: ExternalLinkRow;

  constructor(page: Page) {
    this.page = page;

    this.container = page.getByTestId('auth-page-container');

    this.form = {
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

export { SignInPage };
