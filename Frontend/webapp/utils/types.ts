export enum ChartType {
  LINE = 'Line',
  AREA = 'Area',
  TEMPERATURE = 'Temperature',
  HUMIDITY = 'Humidity',
  LIST = 'List',
}

export interface ChartData {
  id: string;
  name: string;
  description: string;
  type: ChartType;
  data: { time: number; value: number }[];
  sensor_id: string;
  // updateData?: (newData: { time: number; value: number }) => void
}

export enum SensorType {
  TEMP = 'Temperature',
  HUMID = 'Humidity',
  CAM = 'Camera',
  MOTION = 'Motion',
  SOUND = 'Sound',
  OTHER = 'Other',
}

export interface Sensor {
  id: string;
  central_id: number;
  name: string;
  description: string;
  type: SensorType;
}

export interface CentralConfig {
  flows: string;
  description: string;
  name: string;
  created_at: string;
}

export interface Central {
  id: number;
  name: string;
  url: string;
  sensor: Sensor[];
  description: string;
  central_config: CentralConfig[];
}

export interface Room {
  id: number;
  name: string;
  central: Central[];
  description: string;
}
