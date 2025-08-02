import { NextFunction } from 'express';
import { z } from 'zod';
import apodService from '../services/apodService';
import { APIError } from '../middlewares/errorMiddleware';
import {
    TypedRequest,
    TypedResponse,
    APODQuery
} from '../types/express.types';
import { APIResponse } from '../types/api.types';
import {
    APODResponse,
} from '../types/nasa.types';
import {
    apodQuerySchema,
} from '../utils/validation';
import { HTTP_STATUS } from '../utils/constants';

class ApodController {
    public async getAPOD(
        req: TypedRequest<APODQuery>,
        res: TypedResponse<APIResponse<APODResponse>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const validatedQuery = apodQuerySchema.parse(req.query);
            const result = await apodService.getAPOD(validatedQuery.date);
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

export default new ApodController();
