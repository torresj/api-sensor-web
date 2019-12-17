import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import { HouseService } from "src/app/services/house.service";
import { Role, User } from "src/app/models/entities/user";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AppStore } from "src/app/models/stores/appstore";
import { BehaviorSubject, combineLatest } from "rxjs";
import { House } from "src/app/models/entities/house";
import { Sensor } from "src/app/models/entities/sensor";
import { MarkerDto } from "src/app/models/dtos/markerDto";

@Component({
  selector: "app-admin-house",
  templateUrl: "./admin-house.component.html",
  styleUrls: ["./admin-house.component.css"]
})
export class AdminHouseComponent implements OnInit, AfterViewInit {
  private id: string;
  houseSubject = new BehaviorSubject<House>(null);
  usersSubject = new BehaviorSubject<User[]>([]);
  sensorsSubject = new BehaviorSubject<Sensor[]>([]);
  positionsSubject = new BehaviorSubject<MarkerDto[]>([]);
  house$ = this.houseSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  sensors$ = this.sensorsSubject.asObservable();
  positions$ = this.positionsSubject.asObservable();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private houseService: HouseService,
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
        { label: "Casas", url: "/admin/houses" },
        { label: "Info", url: "/admin/houses/" + this.id }
      ]);
    }
  }

  ngAfterViewInit() {}

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
      this.houseService.getHouse$(this.id),
      this.houseService.getUsersHouse$(this.id),
      this.houseService.getSensorsHouse$(this.id)
    ).subscribe(
      ([houseData, usersData, sensorsData]) => {
        this.houseSubject.next(houseData as House);
        this.updateMerkers(houseData as House);
        this.usersSubject.next(usersData as User[]);
        this.sensorsSubject.next(sensorsData as Sensor[]);
        this.store.setLoading(false);
        this.store.setError("");
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
  updateMerkers(house: House) {
    house.position
      ? this.positionsSubject.next([
          {
            name: house.name,
            latitude: house.position.latitude,
            longitude: house.position.longitude
          }
        ])
      : this.positionsSubject.next([
          {
            name: "",
            latitude: 0,
            longitude: 0
          }
        ]);
  }

  hasPosition() {
    const house = this.houseSubject.value;
    if (house.position) {
      if (house.position.latitude === 0 || house.position.longitude === 0) {
        return false;
      } else {
        return true;
      }
    } else return false;
  }
}
