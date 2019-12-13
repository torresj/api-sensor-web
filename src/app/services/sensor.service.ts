import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SensorService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  public getAllSensors$() {
    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.sensorAll);
  }
}
