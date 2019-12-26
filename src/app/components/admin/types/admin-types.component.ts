import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { TypeDataSource } from "src/app/datasources/type.datasource";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import { Router } from "@angular/router";
import { SensortypeService } from "src/app/services/sensortype.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { AppStore } from "src/app/models/stores/appstore";
import {
  MatDialog,
  MatSnackBar,
  MatPaginator,
  MatDialogConfig
} from "@angular/material";
import { Role } from "src/app/models/entities/user";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { SensorType } from "src/app/models/entities/sensortype";
import { DeleteDialogComponent } from "../../dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: "app-admin-types",
  templateUrl: "./admin-types.component.html",
  styleUrls: ["./admin-types.component.css"]
})
export class AdminTypesComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSource: TypeDataSource;
  watcher: Subscription;
  displayedColumnsSubject = new BehaviorSubject<string[]>([
    "id",
    "name",
    "description",
    "createAt",
    "sensorActions",
    "actions"
  ]);
  displayedColumns$ = this.displayedColumnsSubject.asObservable();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("searchBox", { static: true }) input: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private typeService: SensortypeService,
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
        { label: "Tipos", url: "/admin/types" }
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
          "sensorActions",
          "actions"
        ]);
      } else if (change.mqAlias === "lg") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "description",
          "createAt",
          "sensorActions",
          "actions"
        ]);
      } else if (change.mqAlias === "xl") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "description",
          "createAt",
          "sensorActions",
          "actions"
        ]);
      }
    });
  }

  ngOnInit() {
    this.store.setError("");
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    );
    this.dataSource = new TypeDataSource(this.typeService);
    this.dataSource.loadTypes(10, 0);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadTypePage())).subscribe();
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadTypePage();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  loadTypePage() {
    this.dataSource.loadTypes(
      this.paginator.pageSize,
      this.paginator.pageIndex,
      this.input.nativeElement.value
    );
  }

  removeType(type: SensorType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: "Borrar tipo de sensor",
      mainText: "¿Desea eliminar el tipo " + type.name + "?"
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.typeService.deleteType$(type.id.toString()).subscribe(
          data => {
            this.store.setError("");
            this.loadTypePage();
          },
          error => {
            this.openSnackBar("No se pudo borrar el tipo " + type.name);
          }
        );
      }
    });
  }

  onChangeSelect() {
    this.loadTypePage();
  }

  openSnackBar(error?: string) {
    let snackBarRef = null;
    if (error) {
      snackBarRef = this.snackBar.open(error, "Cerrar");
    } else {
      snackBarRef = this.snackBar.open("Tipo creado", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
