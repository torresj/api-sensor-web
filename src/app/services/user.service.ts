import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "../models/user";
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
}
