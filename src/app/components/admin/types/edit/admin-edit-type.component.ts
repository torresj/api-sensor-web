import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SensorType } from "src/app/models/entities/sensortype";
import { BehaviorSubject } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "src/app/services/authentication.service";
import { SensortypeService } from "src/app/services/sensortype.service";
import { AppStore } from "src/app/models/stores/appstore";
import { MatSnackBar } from "@angular/material";
import { Role } from "src/app/models/entities/user";

@Component({
  selector: "app-admin-edit-type",
  templateUrl: "./admin-edit-type.component.html",
  styleUrls: ["./admin-edit-type.component.css"]
})
export class AdminEditTypeComponent implements OnInit {
  editForm: FormGroup;
  submitted = false;
  private id: string;
  typeSubject = new BehaviorSubject<SensorType>(null);
  type$ = this.typeSubject.asObservable();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private typeService: SensortypeService,
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
        { label: "Tipos", url: "/admin/types" },
        { label: "Editar", url: "/admin/types/" + this.id + "/edit" }
      ]);
    }
    this.store.setLoading(true);
  }

  ngOnInit() {
    this.store.setError("");
    this.store.setLoading(true);
    this.authenticationService.getUserData$().subscribe(
      dataUserData => {},
      error => {
        this.store.error = "Sesión caducada. Por favor, identifíquese de nuevo";
        this.authenticationService.logout();
        this.store.setLoading(false);
        this.router.navigate(["/login"]);
      }
    );

    this.editForm = this.formBuilder.group({
      id: [{ value: "", disabled: true }],
      name: ["", Validators.required],
      description: [""],
      actions: [""]
    });

    this.id = this.activatedRoute.snapshot.params.id;

    this.typeService.getType$(this.id).subscribe(
      typeData => {
        const type = typeData as SensorType;
        this.typeSubject.next(type);
        this.editForm.patchValue({
          id: type.id,
          name: type.name,
          description: type.description,
          actions: type.actions
        });
        this.store.setError("");
        this.store.setLoading(false);
      },
      error => {
        this.store.setLoading(false);
        if (this.store.httpErrorCode === 404) {
          this.store.setError("El tipo no existe");
        } else {
          this.store.setError("Error al consultar los datos del tipo");
        }
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
    const type = this.typeSubject.value;
    const typeToUpdate = {
      id: type.id,
      name: this.fields.name.value,
      description: this.fields.description.value,
      actions: this.fields.actions.value
    };
    this.typeService.updateType$(typeToUpdate).subscribe(
      typeData => {
        const typeUpdated = typeData as SensorType;
        this.typeSubject.next(typeUpdated);
        this.editForm.patchValue({
          id: typeUpdated.id,
          name: typeUpdated.name,
          description: typeUpdated.description,
          actions: typeUpdated.actions
        });
        this.store.setLoading(false);
        this.store.setError("");
        this.openSnackBar();
      },
      error => {
        this.store.setLoading(false);
        this.openSnackBar("No se pudo actualizar el tipo");
      }
    );
  }

  openSnackBar(error?: string) {
    let snackBarRef = null;
    if (error) {
      snackBarRef = this.snackBar.open(error, "Cerrar");
    } else {
      snackBarRef = this.snackBar.open("Tipo actualizado", "Cerrar", {
        duration: 5000
      });
    }
    snackBarRef.onAction().subscribe(() => {
      snackBarRef.dismiss();
    });
  }
}
