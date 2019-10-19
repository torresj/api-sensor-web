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
    private router: Router
  ) {
    store.page = "Perfil";
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
        username: ["", Validators.required],
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

  updateUser() {
    console.log("test");
  }

  formControl(control: string) {
    return this.userForm.controls[control];
  }
}
