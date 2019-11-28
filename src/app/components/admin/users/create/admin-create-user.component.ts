import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { UserService } from "src/app/services/user.service";
import { AppStore } from "src/app/models/stores/appstore";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Role } from "src/app/models/entities/user";
import { MustMatch } from "src/app/helpers/must-match.validator";

@Component({
  selector: "app-admin-create-user",
  templateUrl: "./admin-create-user.component.html",
  styleUrls: ["./admin-create-user.component.css"]
})
export class AdminCreateUserComponent implements OnInit {
  createForm: FormGroup;
  roles: Role[] = [Role.admin, Role.station, Role.user];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    public store: AppStore,
    private snackBar: MatSnackBar
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.role !== Role.admin) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([
        { label: "Gestión", url: "/admin" },
        { label: "Usuarios", url: "/admin/users" },
        { label: "Crear", url: "/admin/users/create" }
      ]);
    }
  }

  ngOnInit() {
    this.store.setError("");
    this.store.setHttpErrorCode(0);
    this.store.setLoading(false);
    this.authenticationService.getUserData().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    this.createForm = this.formBuilder.group(
      {
        username: ["", Validators.required],
        role: ["", Validators.required],
        password: ["", Validators.required],
        checkPassword: ["", Validators.required],
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
    return this.createForm.controls;
  }

  formControl(control: string) {
    return this.createForm.controls[control];
  }

  onSubmit() {
    if (this.createForm.invalid) {
      return;
    }

    console.log("creating");

    this.store.setLoading(true);
    this.userService
      .createUser({
        username: this.fields.username.value,
        password: this.fields.password.value,
        email: this.fields.email.value,
        lastName: this.fields.lastName.value,
        name: this.fields.name.value,
        phoneNumber: this.fields.phone.value,
        role: this.fields.role.value
      })
      .subscribe(
        data => {
          this.store.setLoading(false);
          this.store.setError("");
          this.store.setHttpErrorCode(0);
          this.openSnackBar();
        },
        error => {
          this.store.setLoading(false);
          if (this.store.httpErrorCode === 304) {
            this.openSnackBar(
              "No se pudo crear el usuario '" +
                this.fields.username.value +
                "', ya existe"
            );
          } else {
            this.openSnackBar("No se pudo crear el usuario");
          }
        }
      );
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
