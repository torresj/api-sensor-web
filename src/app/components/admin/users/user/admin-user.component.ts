import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UserService } from "src/app/services/user.service";
import { AppStore } from "src/app/models/stores/appstore";
import { Role, User } from "src/app/models/entities/user";
import { BehaviorSubject } from "rxjs";
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
  user = this.userSubject.asObservable();
  houses = this.housesSubject.asObservable();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    public store: AppStore
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage("Gestión - Usuarios");
    }
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

    this.id = this.activatedRoute.snapshot.params.id;

    this.userService.getUser(this.id).subscribe(
      userData => {
        this.userSubject.next(userData as User);
        this.userService.getUserHouses(this.id).subscribe(
          housesData => {
            this.housesSubject.next(housesData as House[]);
          },
          error => {
            this.store.error = "Error al obtener las casas del usuario";
          }
        );
      },
      error => {
        this.store.error = "El usuario no existe";
      }
    );
  }
}
