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
import { Role, User } from "src/app/models/entities/user";
import { UserDataSource } from "../../../datasources/user.datasource";
import { UserService } from "src/app/services/user.service";
import { MatPaginator } from "@angular/material/paginator";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { DeleteUserDialogComponent } from "../../dialogs/delete-user-dialog/delete-user-dialog.component";

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
    public store: AppStore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([
        { label: "Gestión", url: "/admin" },
        { label: "Usuarios", url: "/admin/users" }
      ]);
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
          "numLogins",
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
          "numLogins",
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

  removeUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = user.username;
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteUser(user.id.toString()).subscribe(
          data => {
            this.loadUsersPage();
          },
          error => {
            this.openSnackBar(
              "No se pudo borrar al usuario usuario " + user.username
            );
          }
        );
      }
    });
  }

  onChangeSelect() {
    this.loadUsersPage();
  }

  openSnackBar(error?: string) {
    let snackBarRef = null;
    if (error) {
      snackBarRef = this.snackBar.open(error, "Cerrar");
    } else {
      snackBarRef = this.snackBar.open("Usuario creado", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
