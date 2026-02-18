# Git Branch Naming Convention

### Format:

> `prefix/component-name/feature-name`

### Prefix Reference

| Prefix       | Description                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| **feat**     | A new feature                                                                                                   |
| **fix**      | A bug fix                                                                                                       |
| **docs**     | Documentation-only changes                                                                                      |
| **refactor** | A code change that neither fixes a bug nor adds a feature                                                       |
| **style**    | Changes that do not affect the meaning of the code (formatting, white-space, missing semicolons, etc.)          |
| **test**     | Adding missing tests or correcting existing tests                                                               |
| **chore**    | Maintenance tasks that do not affect application logic (build config, dependencies, tooling, CI/CD, repo setup) |
| **revert**   | Reverts a previous commit                                                                                       |

---

### Examples:

```text
feat/ai/initialize
fix/login/auth-error
docs/api/endpoints-update
refactor/header/mobile-nav
style/global/prettier-formatting
test/auth/login-flow
chore/root/update-eslint-config
revert/auth/remove-oauth-support
```

### Rules:

1. **Lowercase and Hyphen-separated**: Stick to lowercase for branch names and use hyphens to separate words. 
2. **Alphanumeric Characters:** Use only alphanumeric characters (a-z, A-Z, 0–9) and hyphens. Avoid punctuation, spaces, underscores, or any non-alphanumeric character.
3. **No Continuous Hyphens:** Do not use double hyphens. `new--login` is prohibited.
4. **No Trailing Hyphens:** Do not end your branch name with a hyphen (e.g., `new-login-`).
5. **Descriptive:** The name should clearly reflect the work done on the branch.
