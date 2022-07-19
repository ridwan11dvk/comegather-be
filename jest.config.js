module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // coveragePathIgnorePatterns: ['<rootdir>/src/test/*.test.ts'],
  collectCoverageFrom: [
    './src/test/**/*.test.ts',
  ],
};
