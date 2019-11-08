import { Injectable } from "@angular/core";
import { action, observable } from "mobx";
import { User } from "../entities/user";
import { House } from "../entities/house";

@Injectable({ providedIn: "root" })
export class AppStore {
  @observable toolbarPageLinks: Link[] = [];
  @observable user: User;
  @observable loading = false;
  @observable error = "";

  @action setToolbarPage(links: Link[]) {
    this.toolbarPageLinks = links;
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

export interface Link {
  label: string;
  url: string;
}
