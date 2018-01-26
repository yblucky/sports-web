import { LoginPage } from './login/login';
import { MainPage } from './main/main';
import { Routes } from "@angular/router";
import { MainRoutes } from './main.routes';
export const CommonRoutes: Routes = [ // Routes类型的数组
    {
        path     : '',
        component: LoginPage
    },
    {
        path     : 'common/main',
        component: MainPage,
        children : MainRoutes
    },{
        path     : '**',
        component: LoginPage
    }
];
