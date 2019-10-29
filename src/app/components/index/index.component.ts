import { Component, OnInit } from "@angular/core";
import { AppStore } from "src/app/models/stores/appstore";
import { MediaObserver } from "@angular/flex-layout";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"]
})
export class IndexComponent implements OnInit {
  tiles = [
    { text: "One", cols: 2, rows: 1, color: "#142A5C" },
    { text: "Two", cols: 1, rows: 1, color: "#B7A0E8" },
    { text: "Three", cols: 1, rows: 2, color: "#FF0000" },
    { text: "Four", cols: 3, rows: 1, color: "#D9EDD9" }
  ];
  constructor(public store: AppStore, public mediaObserver: MediaObserver) {
    store.setToolbarPage("Index");
  }

  ngOnInit() {}
}
