import { requestRandomNicknames } from "./nicknameAPI";
import '@testing-library/jest-dom';

global.fetch = jest.fn();
global.alert = jest.fn();
global.console.error = jest.fn();

describe('requestRandomNicknames should output nickname array correctly', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('When API call is successful', async () => {
    const mockResponse = {
      success: true,
      contents: {
        names: ['Zorg', 'Blip', 'Xan']
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse)
    });

    const result = await requestRandomNicknames();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expect.arrayContaining(mockResponse.contents.names));
  });

  test('When API call fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ success: false })
    });

    const result = await requestRandomNicknames();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  // output-shuffling functionality not tested as it is both non-deterministic and trivial
});
