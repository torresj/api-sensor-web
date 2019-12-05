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
import { BehaviorSubject } from "rxjs";
import { House } from "src/app/models/entities/house";
import { Sensor } from "src/app/models/entities/sensor";

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
  positionsSubject = new BehaviorSubject<google.maps.LatLng[]>([]);
  house = this.houseSubject.asObservable();
  users = this.usersSubject.asObservable();
  sensors = this.sensorsSubject.asObservable();
  positions = this.positionsSubject.asObservable();

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
    this.authenticationService.getUserData().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    this.houseService.getHouse(this.id).subscribe(
      houseData => {
        this.houseSubject.next(houseData as House);
        this.updateMerkers(houseData as House);
        this.houseService.getUsersHouse(this.id).subscribe(
          usersData => {
            this.usersSubject.next(usersData as User[]);
            this.houseService.getSensorsHouse(this.id).subscribe(
              sensorsData => {
                this.sensorsSubject.next(sensorsData as Sensor[]);
                this.store.setLoading(false);
                this.store.setError("");
              },
              error => {
                this.store.setLoading(false);
                this.store.setError(
                  "Error al consultar los sensores de la casa"
                );
              }
            );
          },
          error => {
            this.store.setLoading(false);
            this.store.setError("Error al consultar los usuarios de la casa");
          }
        );
      },
      error => {
        this.store.setLoading(false);
        if (this.store.httpErrorCode === 404) {
          this.store.setError("La casa no existe");
        } else {
          this.store.setError("Servidor no disponible");
        }
      }
    );
  }
  updateMerkers(house: House) {
    house.position
      ? this.positionsSubject.next([
          new google.maps.LatLng(
            house.position.latitude,
            house.position.longitude
          )
        ])
      : this.positionsSubject.next([new google.maps.LatLng(0, 0)]);
  }
}
