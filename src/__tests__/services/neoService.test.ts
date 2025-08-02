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

import neoService from '../../services/neoService';

describe('NEOService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance.get.mockClear();
  });

  describe('getNearEarthObjects', () => {
    it('should return NEO data successfully', async () => {
      const mockNEOData = {
        element_count: 2,
        near_earth_objects: {
          '2024-01-01': [
            {
              id: '123',
              name: 'Test Asteroid',
              estimated_diameter: {},
              is_potentially_hazardous_asteroid: false,
              close_approach_data: [{}],
            },
          ],
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockNEOData });

      const result = await neoService.getNearEarthObjects(
        '2024-01-01',
        '2024-01-02'
      );

      expect(result.success).toBe(true);
      expect(result.data?.element_count).toBe(2);
      expect(result.data?.near_earth_objects).toHaveLength(1);
    });

    it('should throw APIError for invalid date format', async () => {
      await expect(
        neoService.getNearEarthObjects('invalid-date', '2024-01-02')
      ).rejects.toThrow(APIError);
    });

    it('should throw APIError for date range exceeding 7 days', async () => {
      await expect(
        neoService.getNearEarthObjects('2024-01-01', '2024-01-10')
      ).rejects.toThrow(APIError);
    });
  });
});