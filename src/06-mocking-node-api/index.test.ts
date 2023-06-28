// Uncomment the code below and write your tests
import {
  readFileAsynchronously,
  // doStuffByTimeout,
  // doStuffByInterval,
} from '.';

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    // Write your test here
  });

  test('should call callback only after timeout', () => {
    // Write your test here
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    // Write your test here
  });

  test('should call callback multiple times after multiple intervals', () => {
    // Write your test here
  });
});

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

const existsSyncMock = jest.mocked(existsSync);
const joinMock = jest.mocked(join);
const readFileMock = jest.mocked(readFile);

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    const testPathToFile = 'testPathToFile';

    joinMock.mockImplementation((...args) => args.join('||'));
    existsSyncMock.mockReturnValue(false);

    await readFileAsynchronously(testPathToFile);

    expect(joinMock).toBeCalledWith(expect.any(String), testPathToFile);
  });

  test('should return null if file does not exist', async () => {
    existsSyncMock.mockReturnValue(false);

    const result = await readFileAsynchronously('testPathToFile');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const testContent = JSON.stringify({ test: 'buffer' });

    existsSyncMock.mockReturnValue(true);
    readFileMock.mockReturnValue(Promise.resolve(Buffer.from(testContent)));

    const fileContent = await readFileAsynchronously('testPathToFile');

    expect(fileContent).toBe(testContent);
  });
});
