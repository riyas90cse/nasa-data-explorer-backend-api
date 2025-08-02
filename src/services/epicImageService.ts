import { APIError } from '../middlewares/errorMiddleware';
import { EPICImage } from '../types/nasa.types';
import { APIResponse } from '../types/api.types';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';
import { validateDateFormat } from '../utils/validation';
import { BaseService } from './baseService';

class EPICImageService extends BaseService {
  public async getEPICImages(date?: string): Promise<APIResponse<EPICImage[]>> {
    try {
      if (date && !validateDateFormat(date)) {
        throw new APIError(
          ERROR_MESSAGES.INVALID_DATE_FORMAT,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const endpoint = date 
        ? `/EPIC/api/natural/date/${date}`
        : '/EPIC/api/natural';

      const response = await this.client.get<EPICImage[]>(endpoint);

      const transformedData: EPICImage[] = response.data.map((item: any) => ({
        identifier: item.identifier,
        caption: item.caption,
        image: item.image,
        version: item.version,
        centroid_coordinates: item.centroid_coordinates,
        dscovr_j2000_position: item.dscovr_j2000_position,
        lunar_j2000_position: item.lunar_j2000_position,
        sun_j2000_position: item.sun_j2000_position,
        attitude_quaternions: item.attitude_quaternions,
        date: item.date,
        coords: {
          centroid_coordinates: item.centroid_coordinates,
        },
      }));

      return {
        success: true,
        data: transformedData,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Error fetching EPIC images',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new EPICImageService();