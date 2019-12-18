import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { SensorType } from "src/app/models/entities/sensortype";
import { Sensor } from "src/app/models/entities/sensor";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { SensorService } from "src/app/services/sensor.service";
import { SensortypeService } from "src/app/services/sensortype.service";
import { AppStore } from "src/app/models/stores/appstore";
import { Role } from "src/app/models/entities/user";

@Component({
  selector: "app-admin-type",
  templateUrl: "./admin-type.component.html",
  styleUrls: ["./admin-type.component.css"]
})
export class AdminTypeComponent implements OnInit {
  private id: string;
  typeSubject = new BehaviorSubject<SensorType>(null);
  sensorsSubject = new BehaviorSubject<Sensor[]>([]);
  type$ = this.typeSubject.asObservable();
  sensors$ = this.sensorsSubject.asObservable();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private sensorService: SensorService,
    private typeService: SensortypeService,
    private activatedRoute: ActivatedRoute,
    public store: AppStore
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    this.id = this.activatedRoute.snapshot.params.id;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([
        { label: "Gestión", url: "/admin" },
        { label: "Tipos de sensor", url: "/admin/types" },
        { label: "Info", url: "/admin/types/" + this.id }
      ]);
    }
  }

  ngOnInit() {
    this.store.setLoading(true);
    this.store.setError("");
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    combineLatest(
      this.typeService.getType$(this.id),
      this.sensorService.getSensorsWithSensorType$(this.id)
    ).subscribe(
      ([typeData, sensorsData]) => {
        this.typeSubject.next(typeData as SensorType);
        this.sensorsSubject.next(sensorsData as Sensor[]);
        this.store.setLoading(false);
        this.store.setError("");
      },
      error => {
        this.store.setLoading(false);
        if (this.store.httpErrorCode === 404) {
          this.store.setError("El tipo no existe");
        } else {
          this.store.setError("Error al consultar los datos del tipo");
        }
      }
    );
  }
}
