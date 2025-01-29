import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';
import { beforeAll, afterAll } from '@jest/globals';

// Configure test database path
const TEST_DB_PATH = join(process.cwd(), 'services', 'service-b', 'test.sqlite');

// Clean up test database before each test suite
beforeAll(() => {
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
});

// Clean up after all tests complete
afterAll(() => {
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
});

// Set test environment variable
process.env.NODE_ENV = 'test';