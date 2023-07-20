import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {Zip} from "@awesome-cordova-plugins/zip/ngx";
import {File} from "@awesome-cordova-plugins/file/ngx";
import {Chooser} from "@awesome-cordova-plugins/chooser/ngx";
import { AddPassComponent } from './add-pass/add-pass.component';
import { HomePage } from './home/home.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { QRCodeModule } from "angularx-qrcode";

@NgModule({
  declarations: [
    AppComponent,
    AddPassComponent,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    QRCodeModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    Zip,
    File,
    Chooser
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
