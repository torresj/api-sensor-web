import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../app.config";

@Injectable({
  providedIn: "root"
})
export class HouseService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  public getAllHouses() {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.houseAllPath
    );
  }
}
