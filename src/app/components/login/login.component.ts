import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

import { AlertService } from "../../services/alert.service";
import { AuthenticationService } from "../../services/authentication.service";
import { AppStore } from "src/app/models/stores/appstore";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  submitted = false;
  error = "";

  @Output() toolbarEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public store: AppStore
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/home"]);
    } else {
      store.page = "Login";
    }
  }

  get fields() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/home"]);
    }
  }

  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.fields.username.value, this.fields.password.value)
      .pipe(first())
      .subscribe(
        dataLogin => {
          this.authenticationService.getUserData().subscribe(
            dataUserData => {
              this.router.navigate(["/home"]);
            },
            error => {
              this.error =
                "Error al realizar el login. Inténtelo de nuevo más tarde";
            }
          );
        },
        error => {
          if (this.authenticationService.error !== "") {
            this.error = this.authenticationService.error;
            this.authenticationService.error = "";
            this.fields.username.setErrors({ incorrect: true });
            this.fields.password.setErrors({ incorrect: true });
          } else {
            this.error =
              "Error al realizar el login. Inténtelo de nuevo más tarde";
          }
          this.loading = false;
        }
      );
  }
}
