import { Component, OnInit } from "@angular/core";
import { AppStore } from "src/app/models/stores/appstore";
import { Router } from "@angular/router";

@Component({
  selector: "app-page404",
  templateUrl: "./page404.component.html",
  styleUrls: ["./page404.component.css"]
})
export class Page404Component implements OnInit {
  url: string;
  constructor(private router: Router, public store: AppStore) {
    store.setToolbarPage([{ label: "Error 404", url: "" }]);
    this.url = router.url;
  }

  ngOnInit() {}
}
