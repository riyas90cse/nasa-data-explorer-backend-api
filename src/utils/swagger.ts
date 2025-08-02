import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI configuration options
 * Defines the API documentation structure, schemas, and endpoints
 */
const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NASA Data Explorer API',
      version: '1.0.0',
      description: 'A comprehensive API for exploring NASA data including APOD, Near Earth Objects, Mars Rover Photos, EPIC Earth Images, and NASA Image Library',
      contact: {
        name: 'NASA Data Explorer',
        url: 'https://api.nasa.gov/',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        APIResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                },
                stack: {
                  type: 'string',
                  description: 'Error stack trace (development only)',
                },
              },
            },
          },
        },
        APODData: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              description: 'Date of the APOD image',
            },
            title: {
              type: 'string',
              description: 'Title of the APOD image',
            },
            explanation: {
              type: 'string',
              description: 'Explanation of the APOD image',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'URL of the APOD image',
            },
            hdurl: {
              type: 'string',
              format: 'uri',
              description: 'High definition URL of the APOD image',
            },
            media_type: {
              type: 'string',
              enum: ['image', 'video'],
              description: 'Media type of the APOD content',
            },
            copyright: {
              type: 'string',
              description: 'Copyright information',
            },
          },
          required: ['date', 'title', 'explanation', 'url', 'media_type'],
        },
        MarsRoverPhoto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the photo',
            },
            sol: {
              type: 'integer',
              description: 'Martian sol (day) when the photo was taken',
            },
            camera: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                name: {
                  type: 'string',
                },
                rover_id: {
                  type: 'integer',
                },
                full_name: {
                  type: 'string',
                },
              },
            },
            img_src: {
              type: 'string',
              format: 'uri',
              description: 'URL of the Mars rover photo',
            },
            earth_date: {
              type: 'string',
              format: 'date',
              description: 'Earth date when the photo was taken',
            },
            rover: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                name: {
                  type: 'string',
                },
                landing_date: {
                  type: 'string',
                  format: 'date',
                },
                launch_date: {
                  type: 'string',
                  format: 'date',
                },
                status: {
                  type: 'string',
                },
              },
            },
          },
          required: ['id', 'sol', 'camera', 'img_src', 'earth_date', 'rover'],
        },
        EPICImage: {
          type: 'object',
          properties: {
            identifier: {
              type: 'string',
              description: 'Unique identifier for the EPIC image',
            },
            caption: {
              type: 'string',
              description: 'Caption for the EPIC image',
            },
            image: {
              type: 'string',
              description: 'Image filename',
            },
            version: {
              type: 'string',
              description: 'Image version',
            },
            centroid_coordinates: {
              type: 'object',
              properties: {
                lat: {
                  type: 'number',
                },
                lon: {
                  type: 'number',
                },
              },
            },
            dscovr_j2000_position: {
              type: 'object',
              properties: {
                x: {
                  type: 'number',
                },
                y: {
                  type: 'number',
                },
                z: {
                  type: 'number',
                },
              },
            },
            lunar_j2000_position: {
              type: 'object',
              properties: {
                x: {
                  type: 'number',
                },
                y: {
                  type: 'number',
                },
                z: {
                  type: 'number',
                },
              },
            },
            sun_j2000_position: {
              type: 'object',
              properties: {
                x: {
                  type: 'number',
                },
                y: {
                  type: 'number',
                },
                z: {
                  type: 'number',
                },
              },
            },
            attitude_quaternions: {
              type: 'object',
              properties: {
                q0: {
                  type: 'number',
                },
                q1: {
                  type: 'number',
                },
                q2: {
                  type: 'number',
                },
                q3: {
                  type: 'number',
                },
              },
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the image was taken',
            },
            coords: {
              type: 'object',
              properties: {
                centroid_coordinates: {
                  type: 'object',
                  properties: {
                    lat: {
                      type: 'number',
                    },
                    lon: {
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
          required: ['identifier', 'image', 'date'],
        },
        NASAImageLibraryItem: {
          type: 'object',
          properties: {
            href: {
              type: 'string',
              format: 'uri',
              description: 'Link to the image asset collection',
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  nasa_id: {
                    type: 'string',
                    description: 'NASA unique identifier',
                  },
                  title: {
                    type: 'string',
                    description: 'Title of the media',
                  },
                  description: {
                    type: 'string',
                    description: 'Description of the media',
                  },
                  media_type: {
                    type: 'string',
                    enum: ['image', 'video', 'audio'],
                    description: 'Type of media',
                  },
                  date_created: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date when the media was created',
                  },
                  center: {
                    type: 'string',
                    description: 'NASA center that created the media',
                  },
                  keywords: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    description: 'Keywords associated with the media',
                  },
                },
                required: ['nasa_id', 'title', 'media_type', 'date_created'],
              },
            },
            links: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  href: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL to the media file',
                  },
                  rel: {
                    type: 'string',
                    description: 'Relationship type',
                  },
                  render: {
                    type: 'string',
                    description: 'Render type',
                  },
                },
              },
            },
          },
          required: ['href', 'data'],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

/**
 * Generated Swagger/OpenAPI specification
 * Used by swagger-ui-express to render the API documentation
 */
export const specs = swaggerJsdoc(options);
