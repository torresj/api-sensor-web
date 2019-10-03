import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { LayoutComponent } from "./components/layout/layout.component";
import { LoginComponent } from "./components/login/login.component";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { AppConfig } from "./app.config";

// Material
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

// Flex layout
import { FlexLayoutModule } from "@angular/flex-layout";
import { AlertComponent } from "./components/alert/alert.component";
import { HomeComponent } from "./components/home/home.component";

@NgModule({
  declarations: [
    LayoutComponent,
    LoginComponent,
    AlertComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDividerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AppConfig
  ],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
