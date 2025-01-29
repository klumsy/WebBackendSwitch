import { join } from 'path';
import { unlinkSync, existsSync, mkdirSync } from 'fs';
import { beforeAll, afterAll } from '@jest/globals';

// Configure test database path and directory
const TEST_DB_DIR = join(process.cwd(), 'services', 'service-b');
const TEST_DB_PATH = join(TEST_DB_DIR, 'test.sqlite');

// Clean up test database before each test suite
beforeAll(() => {
  // Ensure the test directory exists
  if (!existsSync(TEST_DB_DIR)) {
    mkdirSync(TEST_DB_DIR, { recursive: true });
  }

  // Clean up existing test database
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