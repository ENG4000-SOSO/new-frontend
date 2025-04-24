export interface ScheduleRequestType {
  id: string;
  mission_id: number;
  created_at?: string;
  updated_at?: string;
  input_object_key?: string;
  output_object_key?: string;
  status?: string;
};

export interface GenerateScheduleRequestType {
  mission_id: number;
  satellite_ids: number[];
  ground_station_ids: number[];
  image_request_ids: number[];
};

export interface GenerateScheduleResponseType {
  job_id: string;
};

export interface TwoLineElement {
  name: string;
  line1: string;
  line2: string;
};

export interface Job {
  latitude: number;
  longitude: number;
  priority: number;
  start: string;
  end: string;
  delivery: string;
  size: number;
};

export interface GroundStation {
  latitude: number;
  longitude: number;
  height: number;
  mask: number;
  uplink_rate: number;
  downlink_rate: number;
};

export interface OutageRequest {
  name: string;
  satellite_name: string;
  start: string;
  end: string;
};

export interface GroundStationOutageRequest {
  name: string;
  ground_station: GroundStation;
  start: string;
  end: string;
};

export interface ScheduleParameters {
  input_hash?: string;
  two_line_elements: TwoLineElement[];
  jobs: Job[];
  ground_stations: GroundStation[];
  outage_requests: OutageRequest[];
  ground_station_outage_requests: GroundStationOutageRequest[];
};

export interface PlannedOrder {
  job: Job;
  satellite_name: string;
  ground_station_name: string;
  job_begin: string;
  job_end: string;
  downlink_begin: string;
  downlink_end: string;
};

export interface ScheduleOutput {
  input_hash: string;
  impossible_orders: Job[];
  impossible_orders_from_outages: Job[];
  impossible_orders_from_ground_stations: Job[];
  undownlinkable_orders: Job[];
  rejected_orders: Job[];
  planned_orders: { [key: string]: PlannedOrder[] };
};

export interface SchedulingInputOutputData {
  params_hash: string;
  params: ScheduleParameters;
  output: ScheduleOutput;
};
