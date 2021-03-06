import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";

import { User, Role } from "../models/entities/user";
import { AppConfig } from "../app.config";
import { AppStore } from "../models/stores/appstore";
import { House } from "../models/entities/house";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private store: AppStore
  ) {}

  public updateUserLogged$(userToUpdate: User) {
    const user = JSON.stringify(userToUpdate);
    return this.http
      .put<User>(
        this.appConfig.baseApiUrl + this.appConfig.userPath,
        userToUpdate
      )
      .pipe(
        map(userUpdated => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(userUpdated));
          this.store.setUser(userUpdated);
          return userUpdated;
        })
      );
  }

  public updateUser$(userToUpdate: User) {
    const user = JSON.stringify(userToUpdate);
    return this.http.put<User>(
      this.appConfig.baseApiUrl + this.appConfig.userPath,
      userToUpdate
    );
  }

  public createUser$(newUser: User) {
    const user = JSON.stringify(newUser);
    return this.http.post<User>(
      this.appConfig.baseApiUrl + this.appConfig.userPath,
      newUser
    );
  }

  public getUsers$(elements: number, page: number) {
    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.userPath, {
      params: new HttpParams()
        .set("elements", elements.toString())
        .set("page", page.toString())
    });
  }

  public getUsersWithFilters$(
    filter: string,
    role: string,
    elements: number,
    page: number
  ) {
    let httpParams = new HttpParams()
      .set("elements", elements.toString())
      .set("page", page.toString());

    if (filter !== undefined) {
      httpParams = httpParams.set("filter", filter);
    }

    if (role !== undefined) {
      httpParams = httpParams.set("role", role);
    }

    return this.http.get(this.appConfig.baseApiUrl + this.appConfig.userPath, {
      params: httpParams
    });
  }

  public getUser$(id: string) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.userPath + "/" + id
    );
  }

  public getUserHouses$(id: string) {
    return this.http.get(
      this.appConfig.baseApiUrl + this.appConfig.userPath + "/" + id + "/houses"
    );
  }

  public setUserHouses$(userId: string, houseIds: number[]) {
    return this.http.post<House[]>(
      this.appConfig.baseApiUrl +
        this.appConfig.userPath +
        "/" +
        userId +
        "/houses",
      houseIds
    );
  }

  public deleteUser$(id: string) {
    return this.http.delete(
      this.appConfig.baseApiUrl + this.appConfig.userPath + "/" + id
    );
  }
}
