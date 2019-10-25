export class User {
  id: number;
  username = "";
  password = "";
  name = "";
  lastName = "";
  createAt = "";
  lastConnection = "";
  email = "";
  phoneNumber = "";
  role: Role;
  token = "";
}

export enum Role {
  user = "USER",
  admin = "ADMIN",
  station = "STATION"
}
