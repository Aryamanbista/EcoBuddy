export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // --- THIS IS THE FIX ---
  // A list of paths Jest should NOT look for tests in.
  // We are telling it to ignore the Selenium/Mocha test folder.
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/test/'
  ],
  
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};