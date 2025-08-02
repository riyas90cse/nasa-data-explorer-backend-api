import { NextFunction } from 'express';
import { z } from 'zod';
import marsRoverService from '../services/marsRoverService';
import { APIError } from '../middlewares/errorMiddleware';
import {
  TypedRequest,
  TypedResponse
} from '../types/express.types';
import { APIResponse } from '../types/api.types';
import {
  MarsRoverPhotosResponse
} from '../types/nasa.types';
import {
  marsRoverQuerySchema
} from '../utils/validation';
import { HTTP_STATUS } from '../utils/constants';

class MarsRoverController {
  public async getMarsRoverPhotos(
    req: TypedRequest,
    res: TypedResponse<APIResponse<MarsRoverPhotosResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { rover } = req.params;
      if (!rover) {
        throw new APIError('Rover parameter is required', HTTP_STATUS.BAD_REQUEST);
      }
      
      const validatedQuery = marsRoverQuerySchema.parse(req.query);
      
      const result = await marsRoverService.getMarsRoverPhotos(
        rover,
        validatedQuery.sol ? parseInt(validatedQuery.sol) : undefined,
        validatedQuery.earth_date,
        validatedQuery.camera,
        validatedQuery.page ? parseInt(validatedQuery.page) : 1
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

export default new MarsRoverController();