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
import { RegisterPage } from './register/register';
//我的桌面
import { HomePage } from '../desktop/home/home';
import { TousuPage } from '../desktop/tousu/tousu';
import { UserOrderPage } from '../desktop/userOrder/userOrder';
import { TimeLotteryPage } from '../desktop/timeLottery/timeLottery';
import { AwardNumberPage } from '../desktop/awardNumber/awardNumber';
import { PersonalSettingsPage } from '../desktop/personalSettings/personalSettings';
import { ReportFormPage } from '../desktop/reportForm/reportForm';
import { WithdrawalsPage } from '../desktop/withdrawals/withdrawals';
import { BlankPage } from '../desktop/blank/blank';

@NgModule({
    declarations: [
        LoginPage,
        MainPage,
        RegisterPage,
        HomePage,
        TousuPage,
        UserOrderPage,
        TimeLotteryPage,
        AwardNumberPage,
        PersonalSettingsPage,
        ReportFormPage,
        WithdrawalsPage,
        BlankPage
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
