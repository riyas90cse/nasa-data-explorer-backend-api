import { APIError } from '../middlewares/errorMiddleware';
import {
  NEOResponse,
  NEODateData,
  EstimatedDiameter,
  CloseApproachData,
} from '../types/nasa.types';
import { APIResponse } from '../types/api.types';
import {
  NASA_API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';
import { validateDateFormat, getDaysDifference } from '../utils/validation';
import { BaseService } from './baseService';

interface NASAAPIResponse {
  near_earth_objects: Record<string, NASANEOObject[]>;
  element_count: number;
}

interface NASANEOObject {
  id: string;
  name: string;
  estimated_diameter: EstimatedDiameter;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
}

class NEOService extends BaseService {
  public async getNearEarthObjects(
    startDate: string,
    endDate: string
  ): Promise<APIResponse<NEOResponse>> {
    try {
      if (!validateDateFormat(startDate) || !validateDateFormat(endDate)) {
        throw new APIError(
          ERROR_MESSAGES.INVALID_DATE_FORMAT,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (getDaysDifference(startDate, endDate) > 7) {
        throw new APIError(
          ERROR_MESSAGES.DATE_RANGE_EXCEEDED,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const response = await this.client.get<NASAAPIResponse>(
        NASA_API_CONFIG.ENDPOINTS.NEO,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      const neoData = response.data.near_earth_objects;
      const processedData: NEODateData[] = Object.keys(neoData).map(date => ({
        date,
        count: neoData[date]!.length,
        objects: neoData[date]!.map(neo => ({
          id: neo.id,
          name: neo.name,
          estimated_diameter: neo.estimated_diameter,
          is_potentially_hazardous: neo.is_potentially_hazardous_asteroid,
          close_approach_data: neo.close_approach_data[0]!,
        })),
      }));

      return {
        success: true,
        data: {
          element_count: response.data.element_count,
          near_earth_objects: processedData,
        },
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        ERROR_MESSAGES.NEO_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new NEOService();