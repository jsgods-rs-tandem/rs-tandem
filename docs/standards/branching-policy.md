# Git Branch Naming Convention

### Format:

> `prefix/component-name/feature-name`

### Examples:

```text
feat/ai/initialize
fix/login/auth-error
docs/api/endpoints-update
refactor/header/mobile-nav
chore/root/package-cleanup
```

### Rules:

1. **Lowercase and Hyphen-separated**: Stick to lowercase for branch names and use hyphens to separate words. 
2. **Alphanumeric Characters:** Use only alphanumeric characters (a-z, A-Z, 0–9) and hyphens. Avoid punctuation, spaces, underscores, or any non-alphanumeric character.
3. **No Continuous Hyphens:** Do not use double hyphens. `new--login` is prohibited.
4. **No Trailing Hyphens:** Do not end your branch name with a hyphen (e.g., `new-login-`).
5. **Descriptive:** The name should clearly reflect the work done on the branch.
