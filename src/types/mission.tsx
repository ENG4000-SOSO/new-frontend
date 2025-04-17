export interface MissionRequestType {
  mission_name: string
  mission_start: string
  mission_end: string
};

export interface MissionType extends MissionRequestType {
  id: number;
};
