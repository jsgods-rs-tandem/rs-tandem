export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'no-descending-specificity': null,
    'no-empty-source': null,
    'declaration-empty-line-before': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['ng-deep'],
      },
    ],
  },
};
