import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/setup-env.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts', // skip NestJS modules
    '!src/main.ts', // skip bootstrap
  ],
  coverageDirectory: './coverage/backend',
  coverageReporters: ['lcov', 'text', 'html'],
  testEnvironment: 'node',
  maxWorkers: 1,
};

export default config;
