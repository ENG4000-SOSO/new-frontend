export interface OrderRequestType {
  image_name: string;
  mission_id: number;
  latitude: number;
  longitude: number;
  priority: number;
  image_start_time: string;
  image_end_time: string;
  delivery_time: string;
  size: number;
  image_type: string;
};

export interface OrderType extends OrderRequestType {
  id: number;
};
