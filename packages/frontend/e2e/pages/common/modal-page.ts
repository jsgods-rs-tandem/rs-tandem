import { Locator, Page } from '@playwright/test';

class ModalPage {
  modal: Locator;
  backdrop: Locator;
  title: Locator;
  closeButton: Locator;
  messages: Locator;
  actionButton: Locator;

  constructor(page: Page) {
    this.modal = page.getByTestId('modal');
    this.backdrop = page.getByTestId('modal-backdrop');
    this.title = page.getByTestId('modal-title');
    this.closeButton = page.getByTestId('modal-close-btn');
    this.messages = page.getByTestId('modal-message'); // Can be multiple for array of messages
    this.actionButton = page.getByTestId('modal-action-btn');
  }
}

export { ModalPage };
