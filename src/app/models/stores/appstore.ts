import { Injectable } from "@angular/core";
import { action, observable } from "mobx";
import { User } from "../user";

@Injectable({ providedIn: "root" })
export class AppStore {
  @observable page = "";
  @observable user = new User();

  @action setFilter(newPage: string) {
    this.page = newPage;
  }

  @action setUser(newUser: User) {
    this.user = newUser;
  }
}
