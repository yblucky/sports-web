import { Routes } from "@angular/router";

import { HomePage } from '../desktop/home/home';
import { TousuPage } from '../desktop/tousu/tousu';

export const MainRoutes: Routes = [ // Routes类型的数组
    {
        path     : '',
        component: HomePage
    },{
        path     : 'desktop/home',//首页
        component: HomePage
    },{
        path     : 'desktop/tousu',//投诉与建议
        component: TousuPage
    },{
        path     : '**',
        component: HomePage
    },
];
