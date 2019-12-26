import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AppStore } from "src/app/models/stores/appstore";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { MustMatch } from "../../helpers/must-match.validator";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/entities/user";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject } from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  error = "";
  userSubject = new BehaviorSubject<User>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    public store: AppStore,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    store.setToolbarPage([{ label: "Perfil", url: "/profile" }]);
  }

  get fields() {
    return this.userForm.controls;
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group(
      {
        username: [{ value: "", disabled: true }],
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

    this.authenticationService.getUserData$().subscribe(
      dataUserData => {
        const user = dataUserData as User;
        this.userSubject.next(user);
        this.userForm.patchValue({
          username: user.username,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phoneNumber
        });
      },
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    );

    this.store.setLoading(false);
    this.store.setError("");
  }

  updateUser() {
    if (this.userForm.invalid) {
      return;
    }

    this.store.setLoading(true);
    const user = this.userSubject.value;
    this.userService
      .updateUserLogged$({
        id: this.store.user.id,
        username: this.fields.username.value,
        password: this.fields.password.value,
        email: this.fields.email.value,
        lastName: this.fields.lastName.value,
        name: this.fields.name.value,
        phoneNumber: this.fields.phone.value,
        role: user.role,
        numLogins: user.numLogins
      })
      .subscribe(
        data => {
          this.userSubject.next(data);
          this.userForm.patchValue({
            username: data.username,
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            phone: data.phoneNumber
          });
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

  formControl(control: string) {
    return this.userForm.controls[control];
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
