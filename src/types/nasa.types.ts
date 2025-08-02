/**
 * Response structure for Astronomy Picture of the Day (APOD) data
 */
export interface APODResponse {
  /** Date of the APOD image in YYYY-MM-DD format */
  date: string;
  /** Title of the APOD image */
  title: string;
  /** Detailed explanation of the APOD image */
  explanation: string;
  /** URL of the APOD image or video */
  url: string;
  /** High definition URL of the APOD image (if available) */
  hdurl?: string | undefined;
  /** Type of media (image or video) */
  media_type: 'image' | 'video';
  /** Copyright information (if available) */
  copyright?: string | undefined;
}

/**
 * Estimated diameter information for Near Earth Objects
 * Includes measurements in different units
 */
export interface EstimatedDiameter {
  /** Diameter estimates in kilometers */
  kilometers: {
    /** Minimum estimated diameter in kilometers */
    estimated_diameter_min: number;
    /** Maximum estimated diameter in kilometers */
    estimated_diameter_max: number;
  };
  /** Diameter estimates in meters */
  meters: {
    /** Minimum estimated diameter in meters */
    estimated_diameter_min: number;
    /** Maximum estimated diameter in meters */
    estimated_diameter_max: number;
  };
  /** Diameter estimates in miles */
  miles: {
    /** Minimum estimated diameter in miles */
    estimated_diameter_min: number;
    /** Maximum estimated diameter in miles */
    estimated_diameter_max: number;
  };
  /** Diameter estimates in feet */
  feet: {
    /** Minimum estimated diameter in feet */
    estimated_diameter_min: number;
    /** Maximum estimated diameter in feet */
    estimated_diameter_max: number;
  };
}

/**
 * Close approach data for Near Earth Objects
 * Contains information about when and how close an object passes Earth
 */
export interface CloseApproachData {
  /** Date of close approach in YYYY-MM-DD format */
  close_approach_date: string;
  /** Full date and time of close approach */
  close_approach_date_full: string;
  /** Epoch date of close approach (milliseconds since 1970-01-01) */
  epoch_date_close_approach: number;
  /** Relative velocity information */
  relative_velocity: {
    /** Velocity in kilometers per second */
    kilometers_per_second: string;
    /** Velocity in kilometers per hour */
    kilometers_per_hour: string;
    /** Velocity in miles per hour */
    miles_per_hour: string;
  };
  /** Miss distance information */
  miss_distance: {
    /** Miss distance in astronomical units */
    astronomical: string;
    /** Miss distance in lunar distances */
    lunar: string;
    /** Miss distance in kilometers */
    kilometers: string;
    /** Miss distance in miles */
    miles: string;
  };
  /** Celestial body the object is orbiting */
  orbiting_body: string;
}

/**
 * Near Earth Object data structure
 * Represents an asteroid or comet that passes near Earth
 */
export interface NearEarthObject {
  /** Unique identifier for the object */
  id: string;
  /** Name of the near earth object */
  name: string;
  /** Estimated diameter information in various units */
  estimated_diameter: EstimatedDiameter;
  /** Whether the object is classified as potentially hazardous */
  is_potentially_hazardous: boolean;
  /** Information about the object's close approach to Earth */
  close_approach_data: CloseApproachData;
}

/**
 * Near Earth Objects data grouped by date
 */
export interface NEODateData {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Number of objects for this date */
  count: number;
  /** Array of Near Earth Objects for this date */
  objects: NearEarthObject[];
}

/**
 * Response structure for Near Earth Objects API
 */
export interface NEOResponse {
  /** Total count of Near Earth Objects in the response */
  element_count: number;
  /** Near Earth Objects data grouped by date */
  near_earth_objects: NEODateData[];
}

/**
 * Mars Rover camera information
 */
export interface MarsRoverCamera {
  /** Unique identifier for the camera */
  id: number;
  /** Short name of the camera */
  name: string;
  /** ID of the rover this camera belongs to */
  rover_id: number;
  /** Full descriptive name of the camera */
  full_name: string;
}

/**
 * Mars Rover information
 */
export interface MarsRover {
  /** Unique identifier for the rover */
  id: number;
  /** Name of the rover (Curiosity, Opportunity, Spirit) */
  name: string;
  /** Date when the rover landed on Mars in YYYY-MM-DD format */
  landing_date: string;
  /** Date when the rover was launched from Earth in YYYY-MM-DD format */
  launch_date: string;
  /** Current status of the rover (active, complete, etc.) */
  status: string;
  /** Maximum sol (Martian day) reached by the rover */
  max_sol: number;
  /** Maximum Earth date reached by the rover in YYYY-MM-DD format */
  max_date: string;
  /** Total number of photos taken by the rover */
  total_photos: number;
  /** Array of cameras on the rover */
  cameras: MarsRoverCamera[];
}

/**
 * Mars Rover photo information
 */
export interface MarsRoverPhoto {
  /** Unique identifier for the photo */
  id: number;
  /** Martian sol (day) when the photo was taken */
  sol: number;
  /** Camera that took the photo */
  camera: MarsRoverCamera;
  /** URL of the photo image */
  img_src: string;
  /** Earth date when the photo was taken in YYYY-MM-DD format */
  earth_date: string;
  /** Information about the rover that took the photo */
  rover: MarsRover;
}

/**
 * Response structure for Mars Rover Photos API
 */
export interface MarsRoverPhotosResponse {
  /** Array of Mars Rover photos */
  photos: MarsRoverPhoto[];
}

/**
 * Geographic coordinates (latitude and longitude)
 */
export interface EPICCoordinates {
  /** Latitude in degrees */
  lat: number;
  /** Longitude in degrees */
  lon: number;
}

/**
 * 3D position coordinates in space
 */
export interface EPICPosition {
  /** X-coordinate */
  x: number;
  /** Y-coordinate */
  y: number;
  /** Z-coordinate */
  z: number;
}

/**
 * Quaternion values representing attitude/orientation
 */
export interface EPICQuaternions {
  /** First quaternion component */
  q0: number;
  /** Second quaternion component */
  q1: number;
  /** Third quaternion component */
  q2: number;
  /** Fourth quaternion component */
  q3: number;
}

/**
 * Earth Polychromatic Imaging Camera (EPIC) image data
 * Contains information about images of Earth taken from space
 */
export interface EPICImage {
  /** Unique identifier for the image */
  identifier: string;
  /** Caption describing the image */
  caption: string;
  /** Image filename */
  image: string;
  /** Version of the image */
  version: string;
  /** Geographic coordinates of the image centroid */
  centroid_coordinates: EPICCoordinates;
  /** Position of the DSCOVR satellite in J2000 reference frame */
  dscovr_j2000_position: EPICPosition;
  /** Position of the Moon in J2000 reference frame */
  lunar_j2000_position: EPICPosition;
  /** Position of the Sun in J2000 reference frame */
  sun_j2000_position: EPICPosition;
  /** Attitude quaternions representing satellite orientation */
  attitude_quaternions: EPICQuaternions;
  /** Date and time when the image was taken */
  date: string;
  /** Additional coordinate information */
  coords: {
    /** Geographic coordinates of the image centroid */
    centroid_coordinates: EPICCoordinates;
  };
}

/**
 * NASA Image and Video Library metadata for a media item
 */
export interface NASAImageLibraryData {
  /** NASA unique identifier for the media item */
  nasa_id: string;
  /** Title of the media item */
  title: string;
  /** Description of the media item */
  description: string;
  /** Type of media (image, video, or audio) */
  media_type: 'image' | 'video' | 'audio';
  /** Date when the media was created */
  date_created: string;
  /** NASA center that created the media */
  center: string;
  /** Keywords associated with the media */
  keywords?: string[];
  /** Accessibility description (Section 508 compliant) */
  description_508?: string;
  /** Secondary creator information */
  secondary_creator?: string;
  /** Photographer name */
  photographer?: string;
}

/**
 * Link information for NASA Image Library items
 */
export interface NASAImageLibraryLink {
  /** URL of the link */
  href: string;
  /** Relationship type of the link */
  rel: string;
  /** Rendering information */
  render?: string;
}

/**
 * NASA Image Library item containing metadata and links
 */
export interface NASAImageLibraryItem {
  /** URL to the item's asset collection */
  href: string;
  /** Array of metadata for the item */
  data: NASAImageLibraryData[];
  /** Array of links to related resources */
  links?: NASAImageLibraryLink[];
}

/**
 * NASA Image Library collection containing search results
 */
export interface NASAImageLibraryCollection {
  /** API version */
  version: string;
  /** URL of the collection */
  href: string;
  /** Array of items in the collection */
  items: NASAImageLibraryItem[];
  /** Metadata about the collection */
  metadata: {
    /** Total number of results matching the search */
    total_hits: number;
  };
  /** Navigation links for pagination */
  links?: Array<{
    /** Relationship type of the link */
    rel: string;
    /** Text prompt for the link */
    prompt: string;
    /** URL of the link */
    href: string;
  }>;
}

/**
 * Response structure for NASA Image Library API
 */
export interface NASAImageLibraryResponse {
  /** Collection of search results */
  collection: NASAImageLibraryCollection;
}
