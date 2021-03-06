import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "../services/authentication.service";
import { AppStore } from "../models/stores/appstore";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private store: AppStore
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          location.reload(true);
        } else if (err.status === 403) {
          this.store.setError("Usuario o contraseña incorrectos");
        } else if (err.status === 304) {
          this.store.setError("Entidad no modificada");
        }

        this.store.setHttpErrorCode(err.status);
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
