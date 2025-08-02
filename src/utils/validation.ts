import { z } from 'zod';

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine(
    dateString => {
      const date = new Date(dateString);
      return (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString);
    },
    { message: 'Invalid date' }
  );

export const apodQuerySchema = z.object({
  date: dateSchema.optional(),
});

export const neoQuerySchema = z
  .object({
    start_date: dateSchema,
    end_date: dateSchema,
  })
  .refine(
    data => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    },
    {
      message: 'Date range cannot exceed 7 days',
      path: ['end_date'],
    }
  );

export const validateDateFormat = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString);
};

export const getDaysDifference = (
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const marsRoverQuerySchema = z.object({
  sol: z.string().regex(/^\d+$/, 'Sol must be a positive integer').optional(),
  earth_date: dateSchema.optional(),
  camera: z.enum(['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM']).optional(),
  page: z.string().regex(/^\d+$/, 'Page must be a positive integer').optional(),
});

export const epicQuerySchema = z.object({
  date: dateSchema.optional(),
});

export const imageLibraryQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  media_type: z.enum(['image', 'video', 'audio']).optional(),
  page: z.string().regex(/^\d+$/, 'Page must be a positive integer').optional(),
  page_size: z.string().regex(/^\d+$/, 'Page size must be a positive integer').optional(),
  year_start: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number').optional(),
  year_end: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number').optional(),
});
