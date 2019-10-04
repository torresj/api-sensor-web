import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";
import { Role } from "src/app/models/user";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"]
})
export class LayoutComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {}

  isLogged(): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin(): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.role === Role.admin) {
      return true;
    } else {
      return false;
    }
  }

  getUserName(): string {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return currentUser.username;
    } else {
      return "";
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  login() {
    this.router.navigate(["/login"]);
  }
}
