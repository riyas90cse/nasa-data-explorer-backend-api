import { APIError } from '../middlewares/errorMiddleware';
import { MarsRoverPhotosResponse } from '../types/nasa.types';
import { APIResponse } from '../types/api.types';
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
} from '../utils/constants';
import { validateDateFormat } from '../utils/validation';
import { BaseService } from './baseService';

class MarsRoverService extends BaseService {
  public async getMarsRoverPhotos(
    rover: string,
    sol?: number,
    earthDate?: string,
    camera?: string,
    page: number = 1
  ): Promise<APIResponse<MarsRoverPhotosResponse>> {
    try {
      const validRovers = ['curiosity', 'opportunity', 'spirit'];
      if (!validRovers.includes(rover.toLowerCase())) {
        throw new APIError(
          'Invalid rover name. Must be one of: curiosity, opportunity, spirit',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (earthDate && !validateDateFormat(earthDate)) {
        throw new APIError(
          ERROR_MESSAGES.INVALID_DATE_FORMAT,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      if (sol !== undefined && sol < 0) {
        throw new APIError(
          'Sol must be a non-negative integer',
          HTTP_STATUS.BAD_REQUEST
        );
      }
      // Enhancement: make all params optional except rover.
      // If neither sol nor earth_date provided, default to latest available earth_date from rover manifest
      if (sol === undefined && !earthDate) {
        const manifestResp = await this.client.get<{ photo_manifest: { max_date: string } }>(
          `/mars-photos/api/v1/manifests/${rover.toLowerCase()}`
        );
        earthDate = manifestResp.data.photo_manifest.max_date;
      }

      const params: Record<string, string | number> = {
        page,
      };

      if (sol !== undefined) {
        params.sol = sol;
      }
      if (earthDate) {
        params.earth_date = earthDate;
      }
      if (camera) {
        params.camera = camera;
      }

      const response = await this.client.get<MarsRoverPhotosResponse>(
        `/mars-photos/api/v1/rovers/${rover.toLowerCase()}/photos`,
        { params }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Error fetching Mars Rover photos',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new MarsRoverService();