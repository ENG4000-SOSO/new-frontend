export interface SatelliteRequestType {
  tle_line1: string;
  tle_line2: string;
  satellite_name: string;
  storage_capacity?: number;
  power_capacity?: number;
  fov_max?: number;
  fov_min?: number;
  is_illuminated?: boolean;
  under_outage?: boolean;
};

export interface SatelliteType extends SatelliteRequestType {
  id: number;
};
