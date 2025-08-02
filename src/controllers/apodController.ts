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

/**
 * Controller for handling Astronomy Picture of the Day (APOD) related requests
 */
class ApodController {
    /**
     * Retrieves the Astronomy Picture of the Day from NASA's API
     * 
     * @param req - Express request object with optional date query parameter
     * @param res - Express response object
     * @param next - Express next function for error handling
     */
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
