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

  public getSensors$(
    elements: number,
    page: number,
    filter?: string,
    typeId?: number
  ) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("elements", elements.toString());
    httpParams = httpParams.set("page", page.toString());
    if (filter && filter !== "") {
      httpParams = httpParams.set("filter", filter);
    }
    if (typeId) {
      httpParams = httpParams.set("sensorTypeId", typeId.toString());
    }
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.SensorPath,
      {
        params: httpParams
      }
    );
  }

  public getSensorsWithSensorType$(sensorType: string) {
    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.sensorAll, {
      params: new HttpParams().set("sensorTypeId", sensorType)
    });
  }

  public deleteSensor$(id: string) {
    return this.http.delete(
      this.appConfig.baseApiUrl + this.appConfig.SensorPath + "/" + id
    );
  }
}
