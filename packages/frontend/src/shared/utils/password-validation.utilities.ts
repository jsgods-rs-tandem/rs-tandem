/** Matches any ASCII special character that is accepted in a password. */
export const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~-]/;

/** Full password strength pattern: ≥1 uppercase, ≥1 digit, ≥1 special character. */
export const PASSWORD_PATTERN_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~-]).*$/;
