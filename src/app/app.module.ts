import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { LayoutComponent } from "./layout/layout.component";

@NgModule({
  declarations: [LayoutComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class AppModule {}
