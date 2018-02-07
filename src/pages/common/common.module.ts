import { CommonRoutes } from './common.routes';
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { TreeModule } from 'ng2-tree';
import { ImageUploadModule } from 'ng2-imageupload';
//通用
import { LoginPage } from './login/login';
import { MainPage } from './main/main';
//我的桌面
import { HomePage } from '../desktop/home/home';
import { TousuPage } from '../desktop/tousu/tousu';
import { UserOrderPage } from '../desktop/userOrder/userOrder';

@NgModule({
    declarations: [
        LoginPage,
        MainPage,
        HomePage,
        TousuPage,
        UserOrderPage
    ],
    imports: [
        BrowserModule,
        FormsModule,
        TreeModule,
        ImageUploadModule,
        RouterModule.forRoot(CommonRoutes,{useHash: false}),
    ]
})
export class CommonModule { }
