import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";

import { AppRoutingModule } from "./app-routing.module";
import { LayoutComponent } from "./layout/layout.component";
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LayoutComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule, MatToolbarModule, MatMenuModule],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
