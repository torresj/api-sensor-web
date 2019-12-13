import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UserService } from "src/app/services/user.service";
import { HouseService } from "src/app/services/house.service";
import { AppStore } from "src/app/models/stores/appstore";
import { MatSnackBar } from "@angular/material";
import { Role, User } from "src/app/models/entities/user";
import { BehaviorSubject, combineLatest } from "rxjs";
import { House } from "src/app/models/entities/house";
import { Sensor } from "src/app/models/entities/sensor";
import { SensorService } from "src/app/services/sensor.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-edit-house",
  templateUrl: "./admin-edit-house.component.html",
  styleUrls: ["./admin-edit-house.component.css"]
})
export class AdminEditHouseComponent implements OnInit {
  private allSystemSensors: Sensor[] = [];
  editForm: FormGroup;
  submitted = false;
  private id: string;
  houseSubject = new BehaviorSubject<House>(null);
  houseSensorsSubject = new BehaviorSubject<Sensor[]>([]);
  houseUsersSubject = new BehaviorSubject<User[]>([]);
  sensorDiffSubject = new BehaviorSubject<Sensor[]>([]);
  house$ = this.houseSubject.asObservable();
  houseSensors$ = this.houseSensorsSubject.asObservable();
  houseUsers$ = this.houseUsersSubject.asObservable();
  sensorDiff$ = this.sensorDiffSubject.asObservable();
  sensorToAdd: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private houseService: HouseService,
    private sensorService: SensorService,
    private activatedRoute: ActivatedRoute,
    public store: AppStore,
    private snackBar: MatSnackBar
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    this.id = this.activatedRoute.snapshot.params.id;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([
        { label: "Gestión", url: "/admin" },
        { label: "Casas", url: "/admin/houses" },
        { label: "Editar", url: "/admin/houses/" + this.id + "/edit" }
      ]);
    }
    this.store.setLoading(true);
  }

  ngOnInit() {
    this.store.setError("");
    this.store.setLoading(true);
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    this.editForm = this.formBuilder.group({
      id: [{ value: "", disabled: true }],
      name: ["", Validators.required],
      description: [""],
      address: [""],
      latitude: [0],
      longitude: [0]
    });

    this.id = this.activatedRoute.snapshot.params.id;

    combineLatest(
      this.houseService.getHouse$(this.id),
      this.houseService.getUsersHouse$(this.id),
      this.houseService.getSensorsHouse$(this.id),
      this.sensorService.getAllSensors$()
    ).subscribe(
      ([houseData, usersData, houseSensorsData, sensorData]) => {
        const house = houseData as House;
        this.houseSubject.next(house);
        this.editForm.patchValue({
          name: house.name,
          description: house.description,
          address: house.address,
          position: house.position
        });
        this.houseSensorsSubject.next(houseSensorsData as Sensor[]);
        this.houseUsersSubject.next(usersData as User[]);
        this.allSystemSensors = sensorData as Sensor[];
        this.sensorDiffSubject.next(
          this.getDiffSensors(
            this.houseSensorsSubject.value,
            this.allSystemSensors
          )
        );
        this.store.setError("");
        this.store.setLoading(false);
      },
      error => {
        this.store.setLoading(false);
        if (this.store.httpErrorCode === 404) {
          this.store.setError("La casa no existe");
        } else {
          this.store.setError("Error al consultar los datos de la casa");
        }
      }
    );
  }

  get fields() {
    return this.editForm.controls;
  }

  formControl(control: string) {
    return this.editForm.controls[control];
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.submitted = true;
    this.store.setLoading(true);
    const house = this.houseSubject.value;
    const houseToUpdate = {
      id: house.id,
      name: house.name,
      description: !this.fields.description.dirty
        ? house.description
        : this.fields.description.value,
      address: !this.fields.address.dirty
        ? house.address
        : this.fields.address.value,
      position: {
        latitude: !this.fields.latitude.dirty
          ? house.position.latitude
          : this.fields.latitude.value,
        longitude: !this.fields.longitude.dirty
          ? house.position.longitude
          : this.fields.longitude.value
      }
    };
    this.houseService.updateHouse$(houseToUpdate).subscribe(
      houseData => {
        this.houseSubject.next(houseData as House);
        this.store.setLoading(false);
        this.store.setError("");
        this.openSnackBar();
      },
      error => {
        this.store.setLoading(false);
        this.openSnackBar("No se pudo actualizar la casa");
      }
    );
  }

  openSnackBar(error?: string) {
    let snackBarRef = null;
    if (error) {
      snackBarRef = this.snackBar.open(error, "Cerrar");
    } else {
      snackBarRef = this.snackBar.open("Casa actualizada", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }

  removeSensor(id: number) {
    const listSensors = this.houseSensorsSubject.value;
    const houseSensors = listSensors.filter(sensor => sensor.id !== id);
    this.sensorDiffSubject.next(
      this.getDiffSensors(houseSensors, this.allSystemSensors)
    );
    this.houseSensorsSubject.next(houseSensors);
  }

  addSensor() {
    if (this.sensorToAdd) {
      const sensor = this.sensorDiffSubject.value.find(
        sensorHouse => sensorHouse.id === this.sensorToAdd
      );
      const houseSensors = this.houseSensorsSubject.value;
      houseSensors.push(sensor);
      this.houseSensorsSubject.next(houseSensors);
      this.sensorDiffSubject.next(
        this.getDiffSensors(houseSensors, this.allSystemSensors)
      );
      this.sensorToAdd = undefined;
    }
  }

  addAllSensors() {
    this.houseSensorsSubject.next(this.allSystemSensors);
    this.sensorDiffSubject.next([]);
    this.sensorToAdd = undefined;
  }

  private getDiffSensors(houseSensors: Sensor[], allSystemSensors: Sensor[]) {
    return allSystemSensors.filter(sensor =>
      houseSensors.find(houseSensor => houseSensor.id === sensor.id) ===
      undefined
        ? true
        : false
    );
  }
}
