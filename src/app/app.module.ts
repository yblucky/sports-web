import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import {Http, XHRBackend, RequestOptions,HttpModule} from "@angular/http";

import {HttpService} from "../providers/HttpService";
import {HttpInterceptHandle} from "../providers/HttpInterceptHandle";
import {Utils} from "../providers/Utils";

import { CommonModule } from '../pages/common/common.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
      BrowserModule,
      FormsModule,
      CommonModule,
      HttpModule,
      RouterModule.forRoot(AppRoutes,{useHash: false}),
    ],
    bootstrap: [AppComponent],
    providers: [
        Utils,
        HttpInterceptHandle,
        HttpService
    ]
})
export class AppModule { }
