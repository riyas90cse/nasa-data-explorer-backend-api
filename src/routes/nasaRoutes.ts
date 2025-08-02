import { Router } from 'express';
import apodController from '../controllers/apodController';
import epicImageController from '../controllers/epicImageController';
import marsRoverController from '../controllers/marsRoverController';
import neoController from '../controllers/neoController';
import imageLibraryController from '../controllers/imageLibraryController';
import infoController from '../controllers/infoController';

const router = Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API information
 *     description: Retrieve information about available NASA API endpoints
 *     tags: [API Info]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 */
router.get('/', infoController.getAPIInfo);

/**
 * @swagger
 * /api/apod:
 *   get:
 *     summary: Get Astronomy Picture of the Day
 *     description: Retrieve NASA's Astronomy Picture of the Day
 *     tags: [APOD]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for APOD (YYYY-MM-DD). If not provided, returns today's APOD
 *     responses:
 *       200:
 *         description: APOD data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/APODData'
 *       400:
 *         description: Bad request - invalid date format
 *       500:
 *         description: Internal server error
 */
router.get('/apod', apodController.getAPOD);

/**
 * @swagger
 * /api/neo:
 *   get:
 *     summary: Get Near Earth Objects
 *     description: Retrieve Near Earth Objects for a specified date range
 *     tags: [NEO]
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for NEO search (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for NEO search (YYYY-MM-DD). Maximum 7 days from start_date
 *     responses:
 *       200:
 *         description: NEO data retrieved successfully
 *       400:
 *         description: Bad request - invalid parameters or date range exceeds 7 days
 *       500:
 *         description: Internal server error
 */
router.get('/neo', neoController.getNearEarthObjects);

/**
 * @swagger
 * /api/mars-rover/{rover}/photos:
 *   get:
 *     summary: Get Mars Rover photos
 *     description: Retrieve photos taken by Mars rovers (Curiosity, Opportunity, Spirit)
 *     tags: [Mars Rover]
 *     parameters:
 *       - in: path
 *         name: rover
 *         required: true
 *         schema:
 *           type: string
 *           enum: [curiosity, opportunity, spirit]
 *         description: Name of the Mars rover
 *       - in: query
 *         name: sol
 *         schema:
 *           type: string
 *         description: Martian sol (day) when the photo was taken
 *       - in: query
 *         name: earth_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Earth date when the photo was taken (YYYY-MM-DD)
 *       - in: query
 *         name: camera
 *         schema:
 *           type: string
 *           enum: [FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM]
 *         description: Camera used to take the photo
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Mars Rover photos retrieved successfully
 *       400:
 *         description: Bad request - invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get('/mars-rover/:rover/photos', marsRoverController.getMarsRoverPhotos);

/**
 * @swagger
 * /api/epic:
 *   get:
 *     summary: Get EPIC Earth images
 *     description: Retrieve Earth Polychromatic Imaging Camera (EPIC) images
 *     tags: [EPIC]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for EPIC images (YYYY-MM-DD). If not provided, returns most recent images
 *     responses:
 *       200:
 *         description: EPIC images retrieved successfully
 *       400:
 *         description: Bad request - invalid date format
 *       500:
 *         description: Internal server error
 */
router.get('/epic', epicImageController.getEPICImages);

/**
 * @swagger
 * /api/image-library/search:
 *   get:
 *     summary: Search NASA Image and Video Library
 *     description: Search for images, videos, and audio from NASA's media library
 *     tags: [Image Library]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: media_type
 *         schema:
 *           type: string
 *           enum: [image, video, audio]
 *         description: Type of media to search for
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: string
 *         description: Number of results per page (max 100)
 *       - in: query
 *         name: year_start
 *         schema:
 *           type: string
 *         description: Start year for filtering results
 *       - in: query
 *         name: year_end
 *         schema:
 *           type: string
 *         description: End year for filtering results
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Bad request - invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get('/image-library/search', imageLibraryController.searchNASAImageLibrary);

export default router;
