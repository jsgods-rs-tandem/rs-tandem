export default {
  errorMsg:
    '❌ Invalid branch name! Please use the format: type/component/task\nExample: feat/frontend/login-form',
  pattern: /^(feat|fix|chore|refactor|revert|docs|style|test)\/[a-z0-9-]+\/[a-z0-9-]+$/,
};
