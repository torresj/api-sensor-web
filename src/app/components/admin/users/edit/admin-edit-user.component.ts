import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { User, Role } from "src/app/models/entities/user";
import { House } from "src/app/models/entities/house";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UserService } from "src/app/services/user.service";
import { AppStore } from "src/app/models/stores/appstore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "src/app/helpers/must-match.validator";
import { HouseService } from "src/app/services/house.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-admin-edit-user",
  templateUrl: "./admin-edit-user.component.html",
  styleUrls: ["./admin-edit-user.component.css"]
})
export class AdminEditUserComponent implements OnInit {
  private id: string;
  private allSystemHouses: House[] = [];
  private allUserHouses: House[] = [];
  editForm: FormGroup;
  userSubject = new BehaviorSubject<User>(null);
  housesSubject = new BehaviorSubject<House[]>([]);
  allHousesSubject = new BehaviorSubject<House[]>([]);
  user$ = this.userSubject.asObservable();
  houses$ = this.housesSubject.asObservable();
  housesDiff$ = this.allHousesSubject.asObservable();
  roles: Role[] = [Role.admin, Role.station, Role.user];
  houseToAdd: number;
  roleSelected: Role;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private houseService: HouseService,
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
        { label: "Usuarios", url: "/admin/users" },
        { label: "Editar", url: "/admin/users/" + this.id + "/edit" }
      ]);
    }
    this.store.setLoading(true);
  }

  ngOnInit() {
    this.store.setError("");
    this.store.setLoading(true);
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {
        this.roleSelected = (dataUserData as User).role;
      },
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    this.id = this.activatedRoute.snapshot.params.id;

    combineLatest(
      this.userService.getUser$(this.id),
      this.userService.getUserHouses$(this.id),
      this.houseService.getAllHouses$()
    ).subscribe(
      ([userData, housesData, allHousesData]) => {
        this.userSubject.next(userData as User);
        this.housesSubject.next(housesData as House[]);
        this.allSystemHouses = allHousesData as House[];
        this.allHousesSubject.next(
          this.getDiffHouses(this.housesSubject.value, this.allSystemHouses)
        );
        this.store.setLoading(false);
      },
      error => {
        this.store.setLoading(false);
        if (this.store.httpErrorCode === 404) {
          this.store.setError("La usuario no existe");
        } else {
          this.store.setError("Error al consultar los datos del usuario");
        }
      }
    );

    this.editForm = this.formBuilder.group(
      {
        id: [{ value: "", disabled: true }],
        username: [{ value: "", disabled: true }],
        logins: [{ value: "", disabled: true }],
        role: [""],
        password: [""],
        checkPassword: [""],
        name: [""],
        lastName: [""],
        email: ["", Validators.email],
        phone: [""]
      },
      {
        validator: MustMatch("password", "checkPassword")
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
    const user = this.userSubject.value;
    const userToUpdate = {
      id: user.id,
      username: user.username,
      password: this.fields.password.value,
      email: !this.fields.email.dirty ? user.email : this.fields.email.value,
      lastName: !this.fields.lastName.dirty
        ? user.lastName
        : this.fields.lastName.value,
      name: !this.fields.name.dirty ? user.name : this.fields.name.value,
      phoneNumber: !this.fields.phone.dirty
        ? user.phoneNumber
        : this.fields.phone.value,
      role: this.roleSelected,
      numLogins: user.numLogins
    };
    const houseIds: number[] = this.housesSubject.value.map(house => house.id);
    combineLatest(
      this.userService.updateUser$(userToUpdate),
      this.userService.setUserHouses$(user.id.toString(), houseIds)
    ).subscribe(
      ([userData, housesData]) => {
        this.userSubject.next(userData as User);
        this.store.setLoading(false);
        this.store.setError("");
        this.openSnackBar();
      },
      error => {
        this.store.setLoading(false);
        this.openSnackBar("No se pudo actualizar el usuario");
      }
    );
  }

  removeHouse(id: number) {
    const listHouses = this.housesSubject.value;
    const userHouses = listHouses.filter(house => house.id !== id);
    this.allHousesSubject.next(
      this.getDiffHouses(userHouses, this.allSystemHouses)
    );
    this.housesSubject.next(userHouses);
  }

  addHouse() {
    if (this.houseToAdd) {
      const house = this.allHousesSubject.value.find(
        userHouse => userHouse.id === this.houseToAdd
      );
      const userHouses = this.housesSubject.value;
      userHouses.push(house);
      this.housesSubject.next(userHouses);
      this.allHousesSubject.next(
        this.getDiffHouses(userHouses, this.allSystemHouses)
      );
      this.houseToAdd = undefined;
    }
  }

  private getDiffHouses(userHouses: House[], allSystemHouses: House[]) {
    return allSystemHouses.filter(house =>
      userHouses.find(userHouse => userHouse.id === house.id) === undefined
        ? true
        : false
    );
  }

  addAllHouses() {
    this.housesSubject.next(this.allSystemHouses);
    this.allHousesSubject.next([]);
    this.houseToAdd = undefined;
  }

  openSnackBar(error?: string) {
    let snackBarRef = null;
    if (error) {
      snackBarRef = this.snackBar.open(error, "Cerrar");
    } else {
      snackBarRef = this.snackBar.open("Usuario actualizado", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
