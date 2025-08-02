// <root>/jest.config.cjs
module.exports = {
  projects: [
      '<rootDir>/backend/jest.config.ts',
      '<rootDir>/frontend/jest.config.js'
    ],
    collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.*',
    '!src/**/index.{ts,tsx}',
  ],
  coverageDirectory: './coverage/frontend',
  coverageReporters: ['lcov', 'text', 'html'],
};