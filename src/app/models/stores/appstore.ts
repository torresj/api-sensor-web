import { Injectable } from "@angular/core";
import { action, observable } from "mobx";

@Injectable({ providedIn: "root" })
export class AppStore {
  @observable page = "";

  @action setFilter(newPage: string) {
    this.page = newPage;
  }
}
