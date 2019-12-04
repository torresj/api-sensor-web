import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { HouseDataSource } from "src/app/datasources/house.datasource";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import {
  MatPaginator,
  MatDialog,
  MatSnackBar,
  MatDialogConfig
} from "@angular/material";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { AppStore } from "src/app/models/stores/appstore";
import { Role } from "src/app/models/entities/user";
import { HouseService } from "src/app/services/house.service";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { House } from "src/app/models/entities/house";
import { DeleteDialogComponent } from "../../dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: "app-admin-houses",
  templateUrl: "./admin-houses.component.html",
  styleUrls: ["./admin-houses.component.css"]
})
export class AdminHousesComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSource: HouseDataSource;
  watcher: Subscription;
  displayedColumnsSubject = new BehaviorSubject<string[]>([
    "id",
    "name",
    "description",
    "address",
    "createAt"
  ]);
  displayedColumns = this.displayedColumnsSubject.asObservable();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("searchBox", { static: true }) input: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private houseService: HouseService,
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
        { label: "Casas", url: "/admin/houses" }
      ]);
    }

    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === "xs") {
        this.displayedColumnsSubject.next(["id", "name", "actions"]);
      } else if (change.mqAlias === "sm") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "description",
          "actions"
        ]);
      } else if (change.mqAlias === "md") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "description",
          "actions"
        ]);
      } else if (change.mqAlias === "lg") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "description",
          "address",
          "createAt",
          "actions"
        ]);
      } else if (change.mqAlias === "xl") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "description",
          "address",
          "createAt",
          "actions"
        ]);
      }
    });
  }

  ngOnInit() {
    this.store.setError("");
    this.authenticationService.getUserData().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    );
    this.dataSource = new HouseDataSource(this.houseService);
    this.dataSource.loadHouses(10, 0);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadHousesPage())).subscribe();
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadHousesPage();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  onChangeSelect() {
    this.loadHousesPage();
  }

  loadHousesPage() {
    this.dataSource.loadHouses(
      this.paginator.pageSize,
      this.paginator.pageIndex,
      this.input.nativeElement.value
    );
  }

  removeHouse(house: House) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: "Borrar casa",
      mainText: "¿Desea eliminar la casa " + house.name + "?"
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.houseService.deleteHouse(house.id.toString()).subscribe(
          data => {
            this.store.setError("");
            this.loadHousesPage();
          },
          error => {
            this.openSnackBar(
              "No se pudo borrar al usuario usuario " + house.name
            );
          }
        );
      }
    });
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
