import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";

import { AlertService } from "../../services/alert.service";
import { AuthenticationService } from "../../services/authentication.service";

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
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
      this.router.navigate(["/"]);
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
        data => {
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.router.navigate(["/"]);
          }
        },
        error => {
          if (this.authenticationService.error !== "") {
            this.error = this.authenticationService.error;
            this.authenticationService.error = "";
            this.fields.username.setErrors({ incorrect: true });
            this.fields.password.setErrors({ incorrect: true });
          } else {
            this.error =
              "Error al realizar el login. Intentelo de nuevo mas tarde";
          }
          this.loading = false;
        }
      );
  }
}
