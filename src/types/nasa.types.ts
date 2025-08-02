export interface APODResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string | undefined;
  media_type: 'image' | 'video';
  copyright?: string | undefined;
}

export interface EstimatedDiameter {
  kilometers: {
    estimated_diameter_min: number;
    estimated_diameter_max: number;
  };
  meters: {
    estimated_diameter_min: number;
    estimated_diameter_max: number;
  };
  miles: {
    estimated_diameter_min: number;
    estimated_diameter_max: number;
  };
  feet: {
    estimated_diameter_min: number;
    estimated_diameter_max: number;
  };
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface NearEarthObject {
  id: string;
  name: string;
  estimated_diameter: EstimatedDiameter;
  is_potentially_hazardous: boolean;
  close_approach_data: CloseApproachData;
}

export interface NEODateData {
  date: string;
  count: number;
  objects: NearEarthObject[];
}

export interface NEOResponse {
  element_count: number;
  near_earth_objects: NEODateData[];
}

export interface MarsRoverCamera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface MarsRover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: MarsRoverCamera[];
}

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: MarsRoverCamera;
  img_src: string;
  earth_date: string;
  rover: MarsRover;
}

export interface MarsRoverPhotosResponse {
  photos: MarsRoverPhoto[];
}

export interface EPICCoordinates {
  lat: number;
  lon: number;
}

export interface EPICPosition {
  x: number;
  y: number;
  z: number;
}

export interface EPICQuaternions {
  q0: number;
  q1: number;
  q2: number;
  q3: number;
}

export interface EPICImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  centroid_coordinates: EPICCoordinates;
  dscovr_j2000_position: EPICPosition;
  lunar_j2000_position: EPICPosition;
  sun_j2000_position: EPICPosition;
  attitude_quaternions: EPICQuaternions;
  date: string;
  coords: {
    centroid_coordinates: EPICCoordinates;
  };
}

export interface NASAImageLibraryData {
  nasa_id: string;
  title: string;
  description: string;
  media_type: 'image' | 'video' | 'audio';
  date_created: string;
  center: string;
  keywords?: string[];
  description_508?: string;
  secondary_creator?: string;
  photographer?: string;
}

export interface NASAImageLibraryLink {
  href: string;
  rel: string;
  render?: string;
}

export interface NASAImageLibraryItem {
  href: string;
  data: NASAImageLibraryData[];
  links?: NASAImageLibraryLink[];
}

export interface NASAImageLibraryCollection {
  version: string;
  href: string;
  items: NASAImageLibraryItem[];
  metadata: {
    total_hits: number;
  };
  links?: Array<{
    rel: string;
    prompt: string;
    href: string;
  }>;
}

export interface NASAImageLibraryResponse {
  collection: NASAImageLibraryCollection;
}
