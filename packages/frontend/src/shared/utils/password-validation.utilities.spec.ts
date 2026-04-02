import { describe, expect, it } from 'vitest';
import {
  PASSWORD_PATTERN_REGEX,
  PASSWORD_SPECIAL_CHAR_REGEX,
} from './password-validation.utilities';

describe('PASSWORD_SPECIAL_CHAR_REGEX', () => {
  it.each([
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '+',
    '=',
    '[',
    ']',
    '{',
    '}',
    ';',
    ':',
    "'",
    '"',
    '\\',
    '|',
    ',',
    '.',
    '<',
    '>',
    '/',
    '?',
    '`',
    '~',
    '-',
  ])('matches special character "%s"', (char) => {
    expect(PASSWORD_SPECIAL_CHAR_REGEX.test(char)).toBe(true);
  });

  it.each(['a', 'Z', '5', ' '])('does not match regular character "%s"', (char) => {
    expect(PASSWORD_SPECIAL_CHAR_REGEX.test(char)).toBe(false);
  });

  it('does not match Cyrillic characters', () => {
    expect(PASSWORD_SPECIAL_CHAR_REGEX.test('а')).toBe(false);
    expect(PASSWORD_SPECIAL_CHAR_REGEX.test('Я')).toBe(false);
    expect(PASSWORD_SPECIAL_CHAR_REGEX.test('ё')).toBe(false);
  });
});

describe('PASSWORD_PATTERN_REGEX', () => {
  describe('valid passwords', () => {
    it.each(['Password1!', 'Str0ng#Pass', 'Hello123@World', 'MyP@ssw0rd', 'Abcdefg1$'])(
      'accepts "%s"',
      (password) => {
        expect(PASSWORD_PATTERN_REGEX.test(password)).toBe(true);
      },
    );
  });

  describe('invalid passwords', () => {
    it('rejects password without uppercase letter', () => {
      expect(PASSWORD_PATTERN_REGEX.test('password1!')).toBe(false);
    });

    it('rejects password without digit', () => {
      expect(PASSWORD_PATTERN_REGEX.test('Password!')).toBe(false);
    });

    it('rejects password without special character', () => {
      expect(PASSWORD_PATTERN_REGEX.test('Password1')).toBe(false);
    });

    it('rejects password with only Cyrillic and digits (no ASCII special char)', () => {
      expect(PASSWORD_PATTERN_REGEX.test('Пароль123')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(PASSWORD_PATTERN_REGEX.test('')).toBe(false);
    });
  });
});
