export class House {
  address = "";
  createAt: Date;
  description = "";
  id: number;
  position: Position;
}

export interface Position {
  id: number;
  latitude: number;
  longitude: number;
}
