import { APIError } from '../middlewares/errorMiddleware';
import { APODResponse } from '../types/nasa.types';
import { APIResponse } from '../types/api.types';
import {
  NASA_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';
import { validateDateFormat } from '../utils/validation';
import { BaseService } from './baseService';

/**
 * Service for handling Astronomy Picture of the Day (APOD) data from NASA API
 */
class APODService extends BaseService {
  /**
   * Fetches the Astronomy Picture of the Day from NASA API
   * 
   * @param date - Optional date in YYYY-MM-DD format. If not provided, returns today's APOD
   * @returns Promise with the APOD data wrapped in an API response object
   * @throws APIError if a date format is invalid or if there's an error fetching the data
   */
  public async getAPOD(date?: string): Promise<APIResponse<APODResponse>> {
    try {
      const params: Record<string, string> = {};
      if (date) {
        if (!validateDateFormat(date)) {
          throw new APIError(
            ERROR_MESSAGES.INVALID_DATE_FORMAT,
            HTTP_STATUS.BAD_REQUEST
          );
        }
        params.date = date;
      }

      const response = await this.client.get<APODResponse>(
        NASA_API_CONFIG.ENDPOINTS.APOD,
        { params }
      );

      return {
        success: true,
        data: {
          date: response.data.date,
          title: response.data.title,
          explanation: response.data.explanation,
          url: response.data.url,
          hdurl: response.data.hdurl,
          media_type: response.data.media_type,
          copyright: response.data.copyright || undefined,
        },
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        ERROR_MESSAGES.APOD_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new APODService();