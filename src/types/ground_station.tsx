export interface GroundStationRequestType {
  ground_station_name: string;
  latitude: string;
  longitude: string;
  elevation: number;
  uplink_rate: number;
  downlink_rate: number;
  send_mask: number;
  receive_mask: number;
  under_outage?: boolean;
};

export interface GroundStationType extends GroundStationRequestType {
  id: number;
};
