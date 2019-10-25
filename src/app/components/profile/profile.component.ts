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
import { User } from "src/app/models/user";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  error = "";

  constructor(
    public store: AppStore,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    store.page = "Perfil";
  }

  get fields() {
    return this.userForm.controls;
  }

  ngOnInit() {
    this.authenticationService.getUserData().subscribe(
      dataUserData => {},
      error => {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    );

    this.userForm = this.formBuilder.group(
      {
        username: [{ value: "", disabled: true }],
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

    this.store.setLoading(false);
    this.store.setError("");
  }

  updateUser() {
    if (this.userForm.invalid) {
      return;
    }

    this.store.setLoading(true);

    const user = new User();
    user.id = this.store.user.id;
    user.username = this.store.user.username;
    user.password = this.fields.password.value;

    user.email = !this.fields.email.dirty
      ? this.store.user.email
      : this.fields.email.value;
    user.lastName = !this.fields.lastName.dirty
      ? this.store.user.lastName
      : this.fields.lastName.value;
    user.name = !this.fields.name.dirty
      ? this.store.user.name
      : this.fields.name.value;
    user.phoneNumber = !this.fields.phone.dirty
      ? this.store.user.phoneNumber
      : this.fields.phone.value;

    user.role = this.store.user.role;
    this.userService.updateUser(user).subscribe(
      data => {
        this.store.setLoading(false);
        this.store.setError("");
        this.openSnackBar();
      },
      error => {
        this.store.setLoading(false);
      }
    );
  }

  formControl(control: string) {
    return this.userForm.controls[control];
  }

  openSnackBar() {
    const snackBarRef = this.snackBar.open("Usuario actualizado", "Cerrar", {
      duration: 5000
    });

    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
