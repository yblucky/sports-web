import { Routes } from "@angular/router";

import { HomePage } from '../desktop/home/home';
import { TousuPage } from '../desktop/tousu/tousu';
import { UserOrderPage } from '../desktop/userOrder/userOrder';

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
        path     : 'desktop/userOrder',//用户订单
        component: UserOrderPage
    },{
        path     : '**',
        component: HomePage
    },
];
