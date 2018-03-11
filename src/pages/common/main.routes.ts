import { Routes } from "@angular/router";

import { RegisterPage } from '../common/register/register';
import { HomePage } from '../desktop/home/home';
import { TousuPage } from '../desktop/tousu/tousu';
import { UserOrderPage } from '../desktop/userOrder/userOrder';
import { TimeLotteryPage } from '../desktop/timeLottery/timeLottery';
import { AwardNumberPage } from '../desktop/awardNumber/awardNumber';
import { PersonalSettingsPage } from '../desktop/personalSettings/personalSettings';
import { ReportFormPage } from '../desktop/reportForm/reportForm';
import { WithdrawalsPage } from '../desktop/withdrawals/withdrawals';

export const MainRoutes: Routes = [ // Routes类型的数组
    {
        path     : '',
        //component: HomePage
        component: TimeLotteryPage
    },{
        path     : 'common/register',//注册
        component: RegisterPage
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
        path     : 'desktop/timeLottery',//时时彩
        component: TimeLotteryPage
    },{
        path     : 'desktop/awardNumber',//开奖号码
        component: AwardNumberPage
    },{
        path     : 'desktop/personalSettings',//个人设置
        component: PersonalSettingsPage
    },{
        path     : 'desktop/reportForm',//个人报表
        component: ReportFormPage
    },{
        path     : 'desktop/withdrawals',//个人提现
        component: WithdrawalsPage
    },{
        path     : '**',
        //component: HomePage
        component: TimeLotteryPage
    },
];
