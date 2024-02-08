// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

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
    const testCallback = () => void 0;
    const testTimeout = 20000;

    const setTimeoutMock = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(testCallback, testTimeout);

    expect(setTimeoutMock).toHaveBeenCalledTimes(1);
    expect(setTimeoutMock).toBeCalledWith(testCallback, testTimeout);
  });

  test('should call callback only after timeout', () => {
    const testCallback = jest.fn();
    const testTimeout = 20000;

    doStuffByTimeout(testCallback, testTimeout);

    expect(testCallback).not.toBeCalled();

    jest.runAllTimers();

    expect(testCallback).toHaveBeenCalledTimes(1);
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
    const testCallback = () => void 0;
    const testInterval = 20000;

    const setTimeoutMock = jest.spyOn(global, 'setInterval');

    doStuffByInterval(testCallback, testInterval);

    expect(setTimeoutMock).toHaveBeenCalledTimes(1);
    expect(setTimeoutMock).toBeCalledWith(testCallback, testInterval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const testCallback = jest.fn();
    const testInterval = 20000;

    doStuffByInterval(testCallback, testInterval);

    expect(testCallback).not.toBeCalled();

    jest.runOnlyPendingTimers();
    expect(testCallback).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(testCallback).toHaveBeenCalledTimes(2);
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

    expect(joinMock).toHaveBeenCalledTimes(1);
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
