import { Injectable } from "@angular/core";
import { action, observable } from "mobx";
import { User } from "../entities/user";
import { House } from "../entities/house";

@Injectable({ providedIn: "root" })
export class AppStore {
  @observable toolbarPage = "";
  @observable user: User;
  @observable loading = false;
  @observable error = "";

  @action setToolbarPage(newPage: string) {
    this.toolbarPage = newPage;
  }

  @action setUser(newUser: User) {
    this.user = newUser;
  }

  @action setError(newerror: string) {
    this.error = newerror;
  }

  @action setLoading(newLoading: boolean) {
    this.loading = newLoading;
  }
}
