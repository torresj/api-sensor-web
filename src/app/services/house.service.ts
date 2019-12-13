import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfig } from "../app.config";
import { House } from "../models/entities/house";

@Injectable({
  providedIn: "root"
})
export class HouseService {
  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  public getAllHouses$() {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.houseAllPath
    );
  }

  public getHouses$(elements: number, page: number) {
    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.housePath, {
      params: new HttpParams()
        .set("elements", elements.toString())
        .set("page", page.toString())
    });
  }

  public getHousesWithFilters$(filter: string, elements: number, page: number) {
    let httpParams = new HttpParams()
      .set("elements", elements.toString())
      .set("page", page.toString());

    if (filter !== undefined) {
      httpParams = httpParams.set("filter", filter);
    }

    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.housePath, {
      params: httpParams
    });
  }

  public createHouse$(newHouse: House) {
    const house = JSON.stringify(newHouse);
    return this.http.post<House>(
      this.appConfig.baseApiUrl + this.appConfig.housePath,
      house
    );
  }

  public deleteHouse$(id: string) {
    return this.http.delete(
      this.appConfig.baseApiUrl + this.appConfig.housePath + "/" + id
    );
  }

  public getHouse$(id: string) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.housePath + "/" + id
    );
  }

  public getUsersHouse$(id: string) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.housePath + "/" + id + "/users"
    );
  }

  public getSensorsHouse$(id: string) {
    return this.http.get(
      this.appConfig.baseApiUrl +
        this.appConfig.housePath +
        "/" +
        id +
        "/sensors"
    );
  }

  public updateHouse$(houseToUpdate: House) {
    const house = JSON.stringify(houseToUpdate);
    return this.http.put<House>(
      this.appConfig.baseApiUrl + this.appConfig.housePath,
      houseToUpdate
    );
  }
}
