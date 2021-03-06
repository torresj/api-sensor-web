import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UserService } from "src/app/services/user.service";
import { AppStore } from "src/app/models/stores/appstore";
import { Role, User } from "src/app/models/entities/user";
import { BehaviorSubject, combineLatest } from "rxjs";
import { House } from "src/app/models/entities/house";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-user",
  templateUrl: "./admin-user.component.html",
  styleUrls: ["./admin-user.component.css"]
})
export class AdminUserComponent implements OnInit {
  private id: string;
  userSubject = new BehaviorSubject<User>(null);
  housesSubject = new BehaviorSubject<House[]>([]);
  user$ = this.userSubject.asObservable();
  houses$ = this.housesSubject.asObservable();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
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
        { label: "Usuarios", url: "/admin/users" },
        { label: "Info", url: "/admin/users/" + this.id }
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
      this.userService.getUser$(this.id),
      this.userService.getUserHouses$(this.id)
    ).subscribe(
      ([userData, housesData]) => {
        this.userSubject.next(userData as User);
        this.housesSubject.next(housesData as House[]);
        this.store.setLoading(false);
        this.store.setError("");
      },
      error => {
        this.store.setLoading(false);
        if (this.store.httpErrorCode === 404) {
          this.store.setError("El usuario no existe");
        } else {
          this.store.setError("Error al obtener los datos del usuario");
        }
      }
    );
  }
}
