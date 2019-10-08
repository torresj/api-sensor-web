import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

import { AuthenticationService } from "../../services/authentication.service";
import { Role } from "src/app/models/user";
import { AppStore } from "src/app/models/stores/appstore";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"]
})
export class LayoutComponent implements OnInit {
  toolbarName: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public store: AppStore
  ) {
    this.matIconRegistry.addSvgIcon(
      `linkedin`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../assets/images/linkedin.svg"
      )
    );

    this.matIconRegistry.addSvgIcon(
      `github`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../assets/images/github.svg"
      )
    );

    this.toolbarName = "test";
  }

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

  getToolbarName($event) {
    this.toolbarName = $event;
  }
}
