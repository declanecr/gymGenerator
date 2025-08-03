// <root>/jest.config.cjs
module.exports = {
  projects: [
      '<rootDir>/backend/jest.config.ts',
      '<rootDir>/frontend/jest.config.js'
    ],
    coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
};