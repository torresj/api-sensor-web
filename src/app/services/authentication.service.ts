import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { User } from "../models/user";
import { AppConfig } from "../app.config";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public error: string;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
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
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
