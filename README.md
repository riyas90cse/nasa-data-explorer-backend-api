# NASA Data Explorer Backend API

A comprehensive RESTful API for exploring NASA's open data, including Astronomy Picture of the Day (APOD), Near Earth Objects (NEO), Mars Rover photos, EPIC Earth images, and NASA's Image and Video Library.

## Features

- **Astronomy Picture of the Day (APOD)**: Get NASA's daily astronomy images with descriptions
- **Near Earth Objects (NEO)**: Track asteroids and comets that pass near Earth
- **Mars Rover Photos**: Access photos from NASA's Mars rovers (Curiosity, Opportunity, Spirit)
- **EPIC Earth Images**: View Earth Polychromatic Imaging Camera images
- **NASA Image Library Search**: Search NASA's vast collection of images, videos, and audio

## Tech Stack

- **Node.js & Express**: Fast, unopinionated web framework
- **TypeScript**: Type-safe JavaScript
- **Swagger/OpenAPI**: API documentation and testing
- **Jest**: Testing framework
- **Docker**: Containerization for easy deployment
- **Zod**: Runtime validation
- **Axios**: HTTP client for API requests

## API Documentation

API documentation is available at `/api-docs` when the server is running. The documentation is generated using Swagger and provides detailed information about all endpoints, parameters, and response formats.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- NASA API Key (optional, falls back to DEMO_KEY)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nasa-data-explorer-backend-api.git
   cd nasa-data-explorer-backend-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8000
   NODE_ENV=development
   NASA_API_KEY=your_nasa_api_key
   ```
   Note: You can obtain a NASA API key from [https://api.nasa.gov](https://api.nasa.gov)

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:8000` with API documentation available at `http://localhost:8000/api-docs`.

### Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t nasa-data-explorer-api .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 -e PORT=5000 -e NASA_API_KEY=your_nasa_api_key nasa-data-explorer-api
   ```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot-reloading
- `npm run build`: Build the TypeScript project
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting

## API Endpoints

### API Info
- `GET /api`: Get information about available NASA API endpoints

### Astronomy Picture of the Day (APOD)
- `GET /api/apod`: Get the Astronomy Picture of the Day
  - Query Parameters:
    - `date`: Date for APOD (YYYY-MM-DD), defaults to today

### Near Earth Objects (NEO)
- `GET /api/neo`: Get Near Earth Objects for a specified date range
  - Query Parameters:
    - `start_date`: Start date (YYYY-MM-DD) [required]
    - `end_date`: End date (YYYY-MM-DD) [required, max 7 days from start_date]

### Mars Rover Photos
- `GET /api/mars-rover/:rover/photos`: Get photos from Mars rovers
  - Path Parameters:
    - `rover`: Name of the rover (curiosity, opportunity, spirit)
  - Query Parameters:
    - `sol`: Martian sol (day) when photos were taken
    - `earth_date`: Earth date (YYYY-MM-DD)
    - `camera`: Camera type (FHAZ, RHAZ, MAST, CHEMCAM, MAHLI, MARDI, NAVCAM)
    - `page`: Page number for pagination

### EPIC Earth Images
- `GET /api/epic`: Get Earth Polychromatic Imaging Camera images
  - Query Parameters:
    - `date`: Date for EPIC images (YYYY-MM-DD), defaults to most recent

### NASA Image Library Search
- `GET /api/image-library/search`: Search NASA's Image and Video Library
  - Query Parameters:
    - `q`: Search query [required]
    - `media_type`: Type of media (image, video, audio)
    - `page`: Page number
    - `page_size`: Results per page (max 100)
    - `year_start`: Start year for filtering
    - `year_end`: End year for filtering

## Testing

The project uses Jest for testing. Tests are located in the `src/__tests__` directory.

To run tests:
```bash
npm test
```

## Environment Variables

- `PORT`: Port for the server (default: 8000)
- `NODE_ENV`: Environment (development, production)
- `NASA_API_KEY`: Your NASA API key (falls back to DEMO_KEY if not provided)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.