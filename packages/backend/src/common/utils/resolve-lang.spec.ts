import { resolveLang } from './resolve-lang.js';

describe('resolveLang', () => {
  it("returns 'ru' for exact 'ru'", () => {
    expect(resolveLang('ru')).toBe('ru');
  });

  it("returns 'ru' for 'ru-RU'", () => {
    expect(resolveLang('ru-RU')).toBe('ru');
  });

  it("returns 'ru' for 'ru-UA'", () => {
    expect(resolveLang('ru-UA')).toBe('ru');
  });

  it("returns 'en' for 'en'", () => {
    expect(resolveLang('en')).toBe('en');
  });

  it("returns 'en' for 'en-US'", () => {
    expect(resolveLang('en-US')).toBe('en');
  });

  it("returns 'en' for undefined", () => {
    expect(resolveLang(undefined)).toBe('en');
  });

  it("returns 'en' for empty string", () => {
    expect(resolveLang('')).toBe('en');
  });

  it("returns 'en' for unrecognised locale 'fr'", () => {
    expect(resolveLang('fr')).toBe('en');
  });

  it("returns 'en' for 'fr-FR'", () => {
    expect(resolveLang('fr-FR')).toBe('en');
  });

  it("returns 'ru' when header is a string array with 'ru' as first element", () => {
    expect(resolveLang(['ru', 'en'])).toBe('ru');
  });

  it("returns 'en' when header is an empty array", () => {
    expect(resolveLang([])).toBe('en');
  });
});
