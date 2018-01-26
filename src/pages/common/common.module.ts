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
//系统管理
import { ParameterPage } from '../system/parameter/parameter';
import { UserInfoPage } from '../system/userInfo/userInfo';
import { RolePage } from '../system/role/role';
import { UpdatePwPage } from '../system/updatePw/updatePw';
import { NoticePage } from '../system/notice/notice';
import { MessagePage } from '../system/message/message';
import { IpconnectPage } from '../system/ipconnect/ipconnect';
import { currencyTypePage } from '../system/currencyType/currencyType';
import { IcoPage } from '../system/ico/ico';
//用户管理
import { UserPage } from '../appuser/user/user';
import { UserCoinPage } from '../appuser/userCoin/userCoin';
import { BankCardPage } from '../appuser/bankcard/bankcard';
import { UserStarLevelPage } from '../appuser/userStarLevel/userStarLevel';
import { UserBillPage } from '../appuser/userBill/userBill';
//交易管理
import { ConvertScorePage } from '../transaction/convertScore/convertScore';
import { TransferPage } from '../transaction/transfer/transfer';
import { StbForwardPage } from '../transaction/stbForward/stbForward';
import { StbExchangePage } from '../transaction/stbExchange/stbExchange';
import { CoinExchangePage } from '../transaction/coinExchange/coinExchange';
import { WithdrawOrder } from '../transaction/withdrawOrder/withdrawOrder';
import { RechargeOrder } from '../transaction/rechargeOrder/rechargeOrder';
import { CoinCurrencyRecordPage } from '../transaction/coinCurrencyRecord/coinCurrencyRecord';
import { CoinCurrencyOrderPage } from '../transaction/coinCurrencyOrder/coinCurrencyOrder';
import { IcoRecordPage } from '../transaction/icoRecord/icoRecord';


@NgModule({
    declarations: [
        LoginPage,
        MainPage,
        HomePage,
        ParameterPage,
        UserInfoPage,
        RolePage,
        UpdatePwPage,
        TousuPage,
        UserPage,
        BankCardPage,
        TransferPage,
        StbForwardPage,
        StbExchangePage,
        WithdrawOrder,
        RechargeOrder,
        NoticePage,
        MessagePage,
        currencyTypePage,
        ConvertScorePage,
        CoinExchangePage,
        UserCoinPage,
        UserStarLevelPage,
        UserBillPage,
        CoinCurrencyRecordPage,
        CoinCurrencyOrderPage,
        IpconnectPage,
        IcoPage,
        IcoRecordPage
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
