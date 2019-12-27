import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { SensorDataSource } from "src/app/datasources/sensor.datasource";
import { Subscription, BehaviorSubject, fromEvent } from "rxjs";
import {
  MatPaginator,
  MatDialog,
  MatSnackBar,
  MatDialogConfig
} from "@angular/material";
import { SensorType } from "src/app/models/entities/sensortype";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { SensorService } from "src/app/services/sensor.service";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { AppStore } from "src/app/models/stores/appstore";
import { Role } from "src/app/models/entities/user";
import { SensortypeService } from "src/app/services/sensortype.service";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Sensor } from "src/app/models/entities/sensor";
import { DeleteDialogComponent } from "../../dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: "app-admin-sensors",
  templateUrl: "./admin-sensors.component.html",
  styleUrls: ["./admin-sensors.component.css"]
})
export class AdminSensorsComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSource: SensorDataSource;
  watcher: Subscription;
  types: SensorType[];
  filterSensorType: number;
  displayedColumnsSubject = new BehaviorSubject<string[]>([
    "id",
    "name",
    "mac",
    "privateIp",
    "publicIp",
    "houseId",
    "sensorTypeId",
    "lastConnection"
  ]);
  displayedColumns$ = this.displayedColumnsSubject.asObservable();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("searchBox", { static: true }) input: ElementRef;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private sensorService: SensorService,
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
        { label: "Sensores", url: "/admin/sensors" }
      ]);
    }

    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === "xs") {
        this.displayedColumnsSubject.next(["id", "name", "actions"]);
      } else if (change.mqAlias === "sm") {
        this.displayedColumnsSubject.next(["id", "name", "mac", "actions"]);
      } else if (change.mqAlias === "md") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "mac",
          "houseId",
          "sensorTypeId",
          "actions"
        ]);
      } else if (change.mqAlias === "lg") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "mac",
          "privateIp",
          "publicIp",
          "houseId",
          "sensorTypeId",
          "lastConnection",
          "actions"
        ]);
      } else if (change.mqAlias === "xl") {
        this.displayedColumnsSubject.next([
          "id",
          "name",
          "mac",
          "privateIp",
          "publicIp",
          "houseId",
          "sensorTypeId",
          "lastConnection",
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
    this.typeService.getAllTypes$().subscribe(
      typesData => {
        this.types = typesData as SensorType[];
      },
      error => {
        this.openSnackBar("No se pudo obtener la lista de tipos de sensor");
      }
    );
    this.dataSource = new SensorDataSource(this.sensorService);
    this.dataSource.loadSensors(10, 0, null, null);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadSensorPage())).subscribe();
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadSensorPage();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  loadSensorPage() {
    this.dataSource.loadSensors(
      this.paginator.pageSize,
      this.paginator.pageIndex,
      this.input.nativeElement.value,
      this.filterSensorType
    );
  }

  onChangeSelect() {
    this.loadSensorPage();
  }

  removeSensor(sensor: Sensor) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: "Borrar sensor",
      mainText: "¿Desea eliminar el sensor " + sensor.name + "?"
    };
    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.sensorService.deleteSensor$(sensor.id.toString()).subscribe(
          data => {
            this.store.setError("");
            this.loadSensorPage();
          },
          error => {
            this.openSnackBar("No se pudo borrar el sensor " + sensor.name);
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
      snackBarRef = this.snackBar.open("Sensor creado", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
