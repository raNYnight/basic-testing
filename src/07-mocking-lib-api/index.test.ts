import axios, { Axios } from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });
  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');
    const promise = throttledGetDataFromApi('posts/1');
    jest.advanceTimersByTime(THROTTLE_TIME);
    await promise;
    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
    expect(axiosCreateSpy).toHaveBeenCalledTimes(1);
  });

  test('should perform request to correct provided url', async () => {
    const axiosSpy = jest.spyOn(Axios.prototype, 'get');

    const promise = throttledGetDataFromApi('posts/2');
    jest.advanceTimersByTime(THROTTLE_TIME);
    await promise;
    expect(axiosSpy).toHaveBeenCalledWith('posts/2');
  });

  test('should return response data', async () => {
    const mockData = {
      userId: 1,
      id: 2,
      title: 'qui est esse',
      body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
    };
    jest.spyOn(Axios.prototype, 'get').mockResolvedValue({ data: mockData });
    const promise = throttledGetDataFromApi('posts/1');
    jest.advanceTimersByTime(THROTTLE_TIME);
    const data = await promise;
    expect(data).toEqual(mockData);
  });
});
