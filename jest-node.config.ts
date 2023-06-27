import type { JestConfigWithTsJest } from 'ts-jest';

const nodeConfig: JestConfigWithTsJest = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/src/client/',
    '/src/pages/',
  ],
  displayName: 'node',
  testEnvironment: 'node',
  testMatch: ['**/server/**/*.spec.[jt]s'],
};

export default nodeConfig;
