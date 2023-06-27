import type { JestConfigWithTsJest } from 'ts-jest';

const nextConfig: JestConfigWithTsJest = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.next-jest.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],
  displayName: 'dom',
  testEnvironment: 'jsdom',
  testMatch: ['**/src/?(client|pages)/**/*.spec.[jt]s?(x)'],
};

export default nextConfig;
