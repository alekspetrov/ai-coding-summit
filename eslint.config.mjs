// eslint-config-next 16 ships native flat-config arrays, so we spread them
// directly. (The old FlatCompat bridge crashes with a circular-structure error
// under ESLint 10.)
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // eslint-plugin-react's `version: 'detect'` path calls the removed
    // context.getFilename() API and crashes under ESLint 10. Pin it.
    settings: { react: { version: '19.2' } },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**'],
  },
];

export default eslintConfig;
