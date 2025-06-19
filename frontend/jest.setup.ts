/// <reference types="jest" />
// jest.setup.ts
// (only needed if you later want DOM matchers like toBeInTheDocument)
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// Clean up once the tests are done.
afterAll(() => server.close());