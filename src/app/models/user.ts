export class User {
  id: number;
  username: string;
  password: string;
  name: string;
  lastName: string;
  createAt: string;
  lastConnection: string;
  email: string;
  phoneNumber: string;
  role: Role;
  token: string;
}

export enum Role {
  USER,
  ADMIN,
  STATION
}
