const config = {
  '*.{js,mjs,jsx,ts,tsx}': ['eslint --fix --max-warnings 0 --no-warn-ignored'],

  '*.scss': ['stylelint --fix'],

  '*': ['prettier --write --ignore-unknown'],
};

export default config;
