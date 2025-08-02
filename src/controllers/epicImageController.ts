import { NextFunction } from 'express';
import { z } from 'zod';
import epicImageService from '../services/epicImageService';
import { APIError } from '../middlewares/errorMiddleware';
import {
    TypedRequest,
    TypedResponse
} from '../types/express.types';
import { APIResponse } from '../types/api.types';
import {
    EPICImage,
} from '../types/nasa.types';
import {
    epicQuerySchema,
} from '../utils/validation';
import { HTTP_STATUS } from '../utils/constants';

class EpicImageController {
    public async getEPICImages(
        req: TypedRequest,
        res: TypedResponse<APIResponse<EPICImage[]>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const validatedQuery = epicQuerySchema.parse(req.query);
            const result = await epicImageService.getEPICImages(validatedQuery.date);
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

export default new EpicImageController();
