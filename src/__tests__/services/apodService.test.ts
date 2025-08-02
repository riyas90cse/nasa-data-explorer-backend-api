import axios from 'axios';
import { APIError } from '../../middlewares/errorMiddleware';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosInstance = {
  get: jest.fn(),
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

import apodService from '../../services/apodService';

describe('APODService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance.get.mockClear();
  });

  describe('getAPOD', () => {
    it('should return APOD data successfully', async () => {
      const mockAPODData = {
        date: '2024-01-01',
        title: 'Test APOD',
        explanation: 'Test explanation',
        url: 'https://example.com/image.jpg',
        hdurl: 'https://example.com/hd-image.jpg',
        media_type: 'image' as const,
        copyright: 'Test Copyright',
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockAPODData });

      const result = await apodService.getAPOD('2024-01-01');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        date: '2024-01-01',
        title: 'Test APOD',
        explanation: 'Test explanation',
        url: 'https://example.com/image.jpg',
        hdurl: 'https://example.com/hd-image.jpg',
        media_type: 'image',
        copyright: 'Test Copyright',
      });
    });

    it('should throw APIError for invalid date format', async () => {
      await expect(apodService.getAPOD('invalid-date')).rejects.toThrow(
        APIError
      );
    });

    it('should work without date parameter', async () => {
      const mockAPODData = {
        date: '2024-01-01',
        title: 'Test APOD',
        explanation: 'Test explanation',
        url: 'https://example.com/image.jpg',
        media_type: 'image' as const,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockAPODData });

      const result = await apodService.getAPOD();

      expect(result.success).toBe(true);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/planetary/apod', {
        params: {},
      });
    });
  });
});