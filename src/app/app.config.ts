import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppConfig {
  readonly baseApiUrl: string = "https://easydom.es:8443/services/api/";
  readonly loginPath: string = "login";
}
