import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AppStore } from "src/app/models/stores/appstore";
import { Role } from "src/app/models/entities/user";
import { UserDataSource } from "../../../datasources/user.datasource";
import { UserService } from "src/app/services/user.service";
import { MatPaginator } from "@angular/material/paginator";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";

@Component({
  selector: "app-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.css"]
})
export class AdminUsersComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSource: UserDataSource;
  watcher: Subscription;
  displayedColumnsSubject = new BehaviorSubject<string[]>([
    "id",
    "username",
    "name",
    "lastName",
    "email",
    "role",
    "lastConnection",
    "actions"
  ]);
  displayedColumns = this.displayedColumnsSubject.asObservable();
  filterTypeUser: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("searchBox", { static: true }) input: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private mediaObserver: MediaObserver,
    public store: AppStore
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage("Gestión - Usuarios");
    }

    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === "xs") {
        this.displayedColumnsSubject.next([
          "id",
          "username",
          "role",
          "actions"
        ]);
      } else if (change.mqAlias === "sm") {
        this.displayedColumnsSubject.next([
          "id",
          "username",
          "role",
          "lastConnection",
          "actions"
        ]);
      } else if (change.mqAlias === "md") {
        this.displayedColumnsSubject.next([
          "id",
          "username",
          "email",
          "role",
          "lastConnection",
          "actions"
        ]);
      } else if (change.mqAlias === "lg") {
        this.displayedColumnsSubject.next([
          "id",
          "username",
          "name",
          "lastName",
          "email",
          "role",
          "lastConnection",
          "actions"
        ]);
      } else if (change.mqAlias === "xl") {
        this.displayedColumnsSubject.next([
          "id",
          "username",
          "name",
          "lastName",
          "email",
          "role",
          "lastConnection",
          "actions"
        ]);
      }
    });
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
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.loadUser(10, 0);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadUsersPage())).subscribe();
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadUsersPage();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  loadUsersPage() {
    this.dataSource.loadUser(
      this.paginator.pageSize,
      this.paginator.pageIndex,
      this.input.nativeElement.value,
      this.filterTypeUser
    );
  }

  removeUser() {
    console.log("Deleting user");
  }

  onChangeSelect() {
    this.loadUsersPage();
  }
}
