module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    "jsx": "babel-jest"
  },
  moduleNameMapper: {
    "^react$": require.resolve("react"),
    "^react-dom$": require.resolve("react-dom")
  },
};

