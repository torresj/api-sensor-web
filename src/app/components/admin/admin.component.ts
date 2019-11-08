import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";
import { Role } from "../../models/entities/user";
import { AppStore } from "src/app/models/stores/appstore";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public store: AppStore
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([{ label: "Gestión", url: "/admin" }]);
    }
  }

  ngOnInit() {
    this.authenticationService.getUserData().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    );

    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    }
  }
}
