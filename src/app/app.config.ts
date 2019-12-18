import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppConfig {
  readonly baseApiUrl: string = "https://easydom.es:8443/services/api/";
  readonly loginPath: string = "login";
  readonly userLoggedPath: string = "v1/users/logged";
  readonly userPath: string = "v1/users";
  readonly housePath: string = "v1/houses";
  readonly SensorTypePath: string = "v1/sensortypes";
  readonly SensorPath: string = "v1/sensors";
  readonly houseAllPath: string = "v1/houses/all";
  readonly sensorAll: string = "v1/sensors/all";
}
