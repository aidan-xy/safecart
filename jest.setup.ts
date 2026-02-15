import '@testing-library/jest-dom';
// Mock the Chrome API for testing
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
    },
    lastError: undefined,
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
  },
} as any;