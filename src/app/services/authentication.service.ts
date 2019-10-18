import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { User } from "../models/user";
import { AppConfig } from "../app.config";
import { AppStore } from "../models/stores/appstore";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public error: string;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private store: AppStore
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.error = "";
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(this.appConfig.baseApiUrl + this.appConfig.loginPath, {
        username,
        password
      })
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  getUserData() {
    return this.http
      .get<any>(this.appConfig.baseApiUrl + this.appConfig.userLoggedPath, {})
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          (user as User).token = this.currentUserValue.token;
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.store.setUser(user);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.store.user = null;
    this.currentUserSubject.next(null);
  }
}
