import { Component, OnInit } from "@angular/core";
import { AppStore } from "src/app/models/stores/appstore";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  constructor(public store: AppStore) {
    store.page = "Perfil";
  }

  ngOnInit() {}
}
