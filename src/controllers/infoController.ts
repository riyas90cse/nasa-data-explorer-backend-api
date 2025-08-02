import {
  TypedRequest,
  TypedResponse
} from '../types/express.types';
import { APIResponse, APIInfo } from '../types/api.types';
import { HTTP_STATUS } from '../utils/constants';

class InfoController {
  public async getAPIInfo(
    req: TypedRequest,
    res: TypedResponse<APIResponse<APIInfo>>
  ): Promise<void> {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        name: 'NASA Data Explorer API',
        version: '1.0.0',
        description: 'Proxy API for NASA Open Data',
        endpoints: {
          apod: {
            path: '/api/apod',
            method: 'GET',
            description: 'Get Astronomy Picture of the Day',
            parameters: {
              date: 'Optional date in YYYY-MM-DD format',
            },
          },
          neo: {
            path: '/api/neo',
            method: 'GET',
            description: 'Get Near Earth Objects data',
            parameters: {
              start_date: 'Required start date in YYYY-MM-DD format',
              end_date:
                'Required end date in YYYY-MM-DD format (max 7 days range)',
            },
          },
          marsRover: {
            path: '/api/mars-rover/{rover}/photos',
            method: 'GET',
            description: 'Get Mars Rover photos',
            parameters: {
              rover: 'Required rover name (curiosity, opportunity, spirit)',
              sol: 'Optional Martian sol (day)',
              earth_date: 'Optional Earth date in YYYY-MM-DD format',
              camera: 'Optional camera name',
              page: 'Optional page number for pagination',
            },
          },
          epic: {
            path: '/api/epic',
            method: 'GET',
            description: 'Get EPIC Earth images',
            parameters: {
              date: 'Optional date in YYYY-MM-DD format',
            },
          },
          imageLibrary: {
            path: '/api/image-library/search',
            method: 'GET',
            description: 'Search NASA Image and Video Library',
            parameters: {
              q: 'Required search query',
              media_type: 'Optional media type (image, video, audio)',
              page: 'Optional page number',
              page_size: 'Optional page size (max 100)',
              year_start: 'Optional start year',
              year_end: 'Optional end year',
            },
          },
        },
      },
    });
  }
}

export default new InfoController();