import { Component, OnInit } from "@angular/core";
import { AppStore } from "src/app/models/stores/appstore";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(
    public store: AppStore,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    store.setToolbarPage([{ label: "Domótica", url: "/home" }]);
  }

  ngOnInit() {
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    );
  }
}
