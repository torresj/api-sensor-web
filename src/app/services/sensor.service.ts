import { Injectable } from "@angular/core";
import { AppConfig } from "../app.config";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SensorService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  public getAllSensors$() {
    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.sensorAll);
  }

  public getSensors$(elements: number, page: number) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.SensorPath,
      {
        params: new HttpParams()
          .set("elements", elements.toString())
          .set("page", page.toString())
      }
    );
  }

  public getSensorsWithSensorType$(sensorType: string) {
    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.sensorAll, {
      params: new HttpParams().set("sensorTypeId", sensorType)
    });
  }
}
