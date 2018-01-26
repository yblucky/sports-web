import { Routes } from "@angular/router";

import { HomePage } from '../desktop/home/home';
import { TousuPage } from '../desktop/tousu/tousu';

import { ParameterPage } from '../system/parameter/parameter';
import { UserInfoPage } from '../system/userInfo/userInfo';
import { RolePage } from '../system/role/role';
import { NoticePage } from '../system/notice/notice';
import { MessagePage } from '../system/message/message';
import { currencyTypePage } from '../system/currencyType/currencyType';
import { UpdatePwPage } from '../system/updatePw/updatePw';
import { UserPage } from '../appuser/user/user';
import { UserCoinPage } from '../appuser/userCoin/userCoin';
import { BankCardPage } from '../appuser/bankcard/bankcard';
import { TransferPage } from '../transaction/transfer/transfer';
import { StbForwardPage } from '../transaction/stbForward/stbForward';
import { StbExchangePage } from '../transaction/stbExchange/stbExchange';
import { WithdrawOrder } from '../transaction/withdrawOrder/withdrawOrder';
import { RechargeOrder } from '../transaction/rechargeOrder/rechargeOrder';
import { ConvertScorePage } from '../transaction/convertScore/convertScore';
import { CoinExchangePage } from '../transaction/coinExchange/coinExchange';
import { UserStarLevelPage } from '../appuser/userStarLevel/userStarLevel';
import { UserBillPage } from '../appuser/userBill/userBill';
import { CoinCurrencyRecordPage } from '../transaction/coinCurrencyRecord/coinCurrencyRecord';
import { CoinCurrencyOrderPage } from '../transaction/coinCurrencyOrder/coinCurrencyOrder';
import { IpconnectPage } from '../system/ipconnect/ipconnect';
import { IcoPage } from '../system/ico/ico';
import { IcoRecordPage } from '../transaction/icoRecord/icoRecord';


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
        path     : 'system/parameter',//参数管理
        component: ParameterPage
    },{
        path     : 'system/userInfo',//用户管理
        component: UserInfoPage
    },{
        path     : 'appuser/userCoin',//用户钱包
        component: UserCoinPage
    },{
        path     : 'system/role',//权限管理
        component: RolePage
    },{
        path     : 'system/updatePw',//修改密码
        component: UpdatePwPage
    },{
        path     : 'system/notice',//公告
        component: NoticePage
    },{
        path     : 'system/message',//用户消息
        component: MessagePage
    },{
        path     : 'appuser/userStarlevel',//用户等级
        component: UserStarLevelPage
    },{
        path     : 'appuser/userBill',//用户流水查询
        component: UserBillPage
    },{
        path     : 'system/currencyType',//币种管理
        component: currencyTypePage
    },{
        path     : 'appuser/user',//用户管理
        component: UserPage
    },{
        path     : 'appuser/bankcard',//银行卡管理
        component: BankCardPage
    },{
        path     : 'transaction/transfer',//转账记录
        component: TransferPage
    },{
        path     : 'transaction/stbForward',//速通宝转出
        component: StbForwardPage
    },{
        path     : 'transaction/stbExchange',//速通宝兑换
        component: StbExchangePage
    },{
        path     : 'transaction/coinExchange',//币种兑换
        component: CoinExchangePage
    },{
        path     : 'transaction/withdrawOrder',//提现订单
        component: WithdrawOrder
    },{
        path     : 'transaction/rechargeOrder',//充值订单
        component: RechargeOrder
    },{
        path     : 'transaction/convertScore',//积分兑换
        component: ConvertScorePage
    },{
        path     : 'transaction/coinCurrencyRecord',//币种订单交易记录
        component: CoinCurrencyRecordPage
    },{
        path     : 'transaction/coinCurrencyOrder',//币种订单记录
        component: CoinCurrencyOrderPage
    },{
        path     : 'system/ipconnect',//访问IP管理
        component: IpconnectPage
    },{
        path     : 'system/ico',//Ico
        component: IcoPage
    },{
        path     : 'transaction/icoRecord',//Ico流水记录
        component: IcoRecordPage
    },{
        path     : '**',
        component: HomePage
    },
];
