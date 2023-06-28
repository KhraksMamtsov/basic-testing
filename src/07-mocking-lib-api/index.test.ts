import { throttledGetDataFromApi } from './index';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = jest.mocked(axios);

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');

  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const getMock = jest.fn(async () => ({}));
    mockedAxios.create.mockReturnValue({ get: getMock } as never);

    await throttledGetDataFromApi('testRelativePath');

    expect(mockedAxios.create).toBeCalledTimes(1);
    expect(mockedAxios.create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const testRelativePath = 'testRelativePath';
    const getMock = jest.fn(async () => ({}));
    mockedAxios.create.mockReturnValue({ get: getMock } as never);

    await throttledGetDataFromApi(testRelativePath);

    expect(getMock).toBeCalledTimes(1);
    expect(getMock).toBeCalledWith(testRelativePath);
  });

  test('should return response data', async () => {
    const testData = 'testData';
    const getMock = jest.fn(async () => ({ data: testData }));
    mockedAxios.create.mockReturnValue({ get: getMock } as never);

    const responseData = await throttledGetDataFromApi('testRelativePath');
    expect(responseData).toBe(testData);
  });
});
