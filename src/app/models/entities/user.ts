export interface User {
  id?: number;
  username: string;
  password: string;
  name?: string;
  lastName?: string;
  createAt?: Date;
  lastConnection?: Date;
  email?: string;
  phoneNumber?: string;
  role: Role;
  numLogins?: number;
  token?: string;
}

export enum Role {
  user = "USER",
  admin = "ADMIN",
  station = "STATION"
}
