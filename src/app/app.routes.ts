import { LoginPage } from '../pages/common/login/login';
import { Routes } from "@angular/router";
export const AppRoutes: Routes = [ // Routes类型的数组
    {
        path     :'',
        component: LoginPage
    }, {
        path     :'common/login',
        component: LoginPage
    }
];
