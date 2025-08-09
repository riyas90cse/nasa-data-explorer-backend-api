# NASA Data Explorer Backend API

A comprehensive RESTful API for exploring NASA's open data, including Astronomy Picture of the Day (APOD), Near Earth Objects (NEO), Mars Rover photos, EPIC Earth images, and NASA's Image and Video Library.

## Quick start

```bash
git clone https://github.com/yourusername/nasa-data-explorer-backend-api.git
cd nasa-data-explorer-backend-api
cp .env.example .env && npm install
npm run dev
```

API: http://localhost:8000  |  Docs: http://localhost:8000/api-docs

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
- npm
- Docker (optional, for running via containers)
- NASA API Key (optional, the app falls back to DEMO_KEY for non-critical usage)

### Installation (local without Docker)

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

The server will start at `http://localhost:8000` with API documentation at `http://localhost:8000/api-docs`.

### Environment setup

If you're starting fresh, copy the example environment file and fill in values as needed:

```bash
cp .env.example .env
# Edit .env and set NASA_API_KEY (and FRONTEND_ORIGIN for production)
```

Then proceed with either the local dev flow above or the Docker flows below.

### Run with Docker

This repo includes a multi-stage Dockerfile and a docker-compose.yml configured for both development and production.

#### Development (with live reload)

Uses the `api-dev` service (compose profile `dev`) which runs `npm run dev` and mounts your local code into the container.

```bash
# Set your NASA key (optional) and allowed frontend origins
export NASA_API_KEY=your_nasa_api_key
export FRONTEND_ORIGIN=http://localhost:3000

# Start the dev stack (node + hot reload)
docker compose --profile dev up -d --build

# View logs
docker compose --profile dev logs -f

# Stop
docker compose --profile dev down
```

The API will be available at http://localhost:8000. Swagger UI: http://localhost:8000/api-docs

#### Production (single service)

Uses the `api` service which builds the production image, installs only production deps, and runs `node dist/index.js` as a non-root user. A container healthcheck is configured to probe `/health`.

```bash
# Set secrets and frontend origins as needed (you can also inject via your CI/CD)
export NASA_API_KEY=your_nasa_api_key
export FRONTEND_ORIGIN=https://your-frontend.example.com

# Build and start
docker compose up -d --build

# Check status & logs
docker compose ps
docker compose logs -f

# Stop
docker compose down
```

Notes:
- The app listens on port `8000`. Compose maps `8000:8000` by default.
- `FRONTEND_ORIGIN` can be a comma-separated list, e.g. `https://app.example.com,https://admin.example.com`.
- By default, production CORS is disabled if `FRONTEND_ORIGIN` is not set (no wildcard allowed). Set it to the exact origins you need.

## Deployment: Fly.io

Deploy the API globally using Fly.io with the existing multi-stage Dockerfile.

> Using the provided files
> - Copy `fly.toml.example` to `fly.toml` and set `app` and `primary_region`.
> - Optional manual deploy via GitHub Actions: use `.github/workflows/fly-deploy.yml` (workflow_dispatch). Set `FLY_API_TOKEN` in GitHub repo Settings → Secrets and variables → Actions.

### Prerequisites
- Fly CLI: `brew install flyctl` (macOS) or see https://fly.io/docs/hands-on/install-flyctl/
- Fly account: `flyctl auth signup` (or `flyctl auth login`)
- Git repository pushed to a remote (recommended)

### 1) App initialization
```bash
# From the project root
flyctl launch
```
When prompted:
- Use existing Dockerfile: Yes
- App name: accept or set a unique name
- Organization/Region: choose your preference
- Internal port: 8000
- Create a Postgres DB: No
- Deploy now: No (we’ll set secrets first)

This generates a `fly.toml`. Confirm it includes:
- `internal_port = 8000`
- Health check hitting `/health` (you can add later if needed)

### 2) Configure secrets
```bash
flyctl secrets set \
  NASA_API_KEY=your_real_key \
  FRONTEND_ORIGIN=https://your-frontend.example.com
```
Notes:
- `FRONTEND_ORIGIN` can be a comma-separated list for multiple origins.
- `NODE_ENV` defaults to production in container; you don’t need to set it.

### 3) Deploy
```bash
flyctl deploy
```
Fly will build using the Dockerfile’s production stage and release the app.

### 4) Verify
```bash
flyctl status
flyctl logs
```
Open the assigned URL from `flyctl status` (e.g. `https://<app>.fly.dev`).
- API root: `https://<app>.fly.dev/`
- Health: `https://<app>.fly.dev/health`
- Swagger: `https://<app>.fly.dev/api-docs`

### 5) Scale (optional)
```bash
# Scale to 0.25 CPU and 256MB RAM
flyctl scale vm shared-cpu-1x --memory 256

# Add an additional region instance
flyctl scale count 2
```

### 6) Custom domain & TLS (optional)
```bash
flyctl certs create api.example.com
# Follow DNS instructions; Fly provisions TLS automatically
```

### Common commands
```bash
flyctl deploy                 # Build & release
flyctl logs -a <app>          # Stream logs
flyctl status -a <app>        # App status
flyctl open -a <app>          # Open app URL
flyctl secrets set KEY=VAL    # Set/rotate secrets
flyctl apps destroy <app>     # Remove app
```

Troubleshooting
- 502/healthcheck failing: ensure the service listens on port 8000 and `/health` responds 200.
- CORS blocked: set FRONTEND_ORIGIN to your exact frontend origin(s) (scheme + host + optional port).
- NASA rate limits: use your own key (avoid DEMO_KEY in production).

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

The project uses Jest. Tests live in `src/__tests__`.

- Local:
  ```bash
  npm test
  ```

- With Docker (using the dev image which includes dev dependencies):
  ```bash
  # One-off test run in a container (no need to start the stack)
  docker compose --profile dev run --rm api-dev npm test
  ```

## Environment Variables

- `PORT`: Port for the server (default: 8000)
- `NODE_ENV`: Environment (development, production)
- `NASA_API_KEY`: Your NASA API key (falls back to DEMO_KEY if not provided)
- `FRONTEND_ORIGIN`: Comma-separated list of allowed origins for CORS in production (e.g. `https://app.example.com,https://admin.example.com`). If not provided in production, CORS is disabled.

## Healthcheck

The server exposes `GET /health`. The production container includes a healthcheck that calls this endpoint periodically.

## Troubleshooting

- Port already in use: Change the host port mapping in `docker-compose.yml` (e.g. `"8080:8000"`).
- CORS errors in production: Ensure `FRONTEND_ORIGIN` is set to the exact origin(s) of your frontend (scheme + host + optional port).
- NASA API quota errors: Request your own API key at https://api.nasa.gov and set `NASA_API_KEY`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.