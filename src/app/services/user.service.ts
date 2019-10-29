import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { User } from "../models/entities/user";
import { AppConfig } from "../app.config";
import { AppStore } from "../models/stores/appstore";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private store: AppStore
  ) {}

  public updateUser(userToUpdate: User) {
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
          return user;
        })
      );
  }
}
