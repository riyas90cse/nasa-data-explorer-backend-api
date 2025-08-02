import { NextFunction } from 'express';
import { z } from 'zod';
import neoService from '../services/neoService';
import { APIError } from '../middlewares/errorMiddleware';
import {
  TypedRequest,
  TypedResponse,
  NEOQuery
} from '../types/express.types';
import { APIResponse } from '../types/api.types';
import {
  NEOResponse
} from '../types/nasa.types';
import {
  neoQuerySchema
} from '../utils/validation';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants';

class NEOController {
  public async getNearEarthObjects(
    req: TypedRequest<NEOQuery>,
    res: TypedResponse<APIResponse<NEOResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.query.start_date || !req.query.end_date) {
        throw new APIError(
          ERROR_MESSAGES.REQUIRED_PARAMETERS,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const validatedQuery = neoQuerySchema.parse(req.query);
      const result = await neoService.getNearEarthObjects(
        validatedQuery.start_date,
        validatedQuery.end_date
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

export default new NEOController();