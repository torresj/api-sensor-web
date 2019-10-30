export interface House {
  address: string;
  createAt: Date;
  description: string;
  id: number;
  position: Position;
}

export interface Position {
  id: number;
  latitude: number;
  longitude: number;
}
