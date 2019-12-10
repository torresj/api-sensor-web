import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

import { AuthenticationService } from "../../services/authentication.service";
import { AppStore } from "src/app/models/stores/appstore";
import { combineLatest, concat } from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  submitted = false;

  @Output() toolbarEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    public store: AppStore
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/home"]);
    } else {
      store.setToolbarPage([{ label: "Login", url: "/login" }]);
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

    // stop here if form is invalid
    if (!this.fields.username.value || !this.fields.password.value) {
      return;
    }
    this.store.setError("");
    this.store.setLoading(true);
    concat(
      this.authenticationService.login$(
        this.fields.username.value,
        this.fields.password.value
      ),
      this.authenticationService.getUserData$()
    ).subscribe(
      data => {},
      error => {
        this.errorRequest();
      },
      () => {
        this.store.setLoading(false);
        this.store.setError("");
        this.router.navigate(["/home"]);
      }
    );
  }

  private errorRequest() {
    if (this.store.error !== "") {
      this.fields.username.setErrors({ incorrect: true });
      this.fields.password.setErrors({ incorrect: true });
    } else {
      this.store.setError(
        "Error al realizar el login. Inténtelo de nuevo más tarde"
      );
    }
    this.store.setLoading(false);
  }
}
