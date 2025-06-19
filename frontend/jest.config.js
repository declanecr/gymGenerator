// frontend/jest.config.js
export default {
  preset: 'ts-jest',                // use ts-jest to transform .ts/.tsx
  testEnvironment: 'jest-fixed-jsdom',         // so you can test React components too
  roots: ['<rootDir>/src'],         // look for tests under src/
  testMatch: [                      // your test file patterns
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
  moduleNameMapper: {               // if you use path-aliases like "@/…"
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
