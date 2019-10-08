import { Component, OnInit } from "@angular/core";
import { AppStore } from "src/app/models/stores/appstore";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"]
})
export class IndexComponent implements OnInit {
  constructor(public store: AppStore) {
    store.page = "Index";
  }

  ngOnInit() {}
}
