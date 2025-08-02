import axios from 'axios';
import { APIError } from '../middlewares/errorMiddleware';
import { NASAImageLibraryResponse } from '../types/nasa.types';
import { APIResponse } from '../types/api.types';
import { HTTP_STATUS } from '../utils/constants';
import { BaseService } from './baseService';

class ImageLibraryService extends BaseService {
  public async searchNASAImageLibrary(
    query: string,
    mediaType?: string,
    page: number = 1,
    pageSize: number = 100,
    yearStart?: string,
    yearEnd?: string
  ): Promise<APIResponse<NASAImageLibraryResponse>> {
    try {
      if (!query || query.trim().length === 0) {
        throw new APIError(
          'Search query is required',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const params: Record<string, string | number> = {
        q: query.trim(),
        page,
        page_size: Math.min(pageSize, 100), // NASA API limits to 100
      };

      if (mediaType) {
        params.media_type = mediaType;
      }
      if (yearStart) {
        params.year_start = yearStart;
      }
      if (yearEnd) {
        params.year_end = yearEnd;
      }

      const imageLibraryResponse = await axios.get<NASAImageLibraryResponse>(
        'https://images-api.nasa.gov/search',
        { params }
      );

      return {
        success: true,
        data: imageLibraryResponse.data,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Error searching NASA Image Library',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new ImageLibraryService();