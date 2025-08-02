import { NextFunction } from 'express';
import { z } from 'zod';
import imageLibraryService from '../services/imageLibraryService';
import { APIError } from '../middlewares/errorMiddleware';
import {
  TypedRequest,
  TypedResponse
} from '../types/express.types';
import { APIResponse } from '../types/api.types';
import {
  NASAImageLibraryResponse
} from '../types/nasa.types';
import {
  imageLibraryQuerySchema
} from '../utils/validation';
import { HTTP_STATUS } from '../utils/constants';

class ImageLibraryController {
  public async searchNASAImageLibrary(
    req: TypedRequest,
    res: TypedResponse<APIResponse<NASAImageLibraryResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedQuery = imageLibraryQuerySchema.parse(req.query);
      
      const result = await imageLibraryService.searchNASAImageLibrary(
        validatedQuery.q,
        validatedQuery.media_type,
        validatedQuery.page ? parseInt(validatedQuery.page) : 1,
        validatedQuery.page_size ? parseInt(validatedQuery.page_size) : 100,
        validatedQuery.year_start,
        validatedQuery.year_end
      );
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(
          new APIError(
            error.errors[0]?.message || 'Validation error',
            HTTP_STATUS.BAD_REQUEST
          )
        );
      } else {
        next(error);
      }
    }
  }
}

export default new ImageLibraryController();