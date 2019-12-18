import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfig } from "../app.config";

@Injectable({
  providedIn: "root"
})
export class SensortypeService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  public getTypes$(elements: number, page: number) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.SensorTypePath,
      {
        params: new HttpParams()
          .set("elements", elements.toString())
          .set("page", page.toString())
      }
    );
  }

  public getType$(id: string) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.SensorTypePath + "/" + id
    );
  }

  public getSensorTypeWithFilters$(
    filter: string,
    elements: number,
    page: number
  ) {
    let httpParams = new HttpParams()
      .set("elements", elements.toString())
      .set("page", page.toString());

    if (filter !== undefined) {
      httpParams = httpParams.set("filter", filter);
    }

    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.SensorTypePath,
      {
        params: httpParams
      }
    );
  }

  deleteType$(id: string) {
    return this.http.delete(
      this.appConfig.baseApiUrl + this.appConfig.SensorTypePath + "/" + id
    );
  }
}
