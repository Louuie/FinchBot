module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
      '^.+\\.mjs$': 'babel-jest',
    },
    moduleNameMapper: {
      '^@mui/material/(.*)$': '@mui/material',
    },
  };
  