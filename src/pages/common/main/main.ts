import { Component } from "@angular/core";
import { Router,ActivatedRoute } from '@angular/router';
import {Utils} from "../../../providers/Utils";
import {HttpService} from "../../../providers/HttpService";

declare var $: any;
declare var layer: any;
let _router: any;
var mainPage:any;

@Component({
    selector   : 'page-main',
    templateUrl: './main.html',
    styleUrls: ['./main.scss']
})
export class MainPage {
    linkCls:string='';
    userImg:string = "/assets/images/avatar.png";
    userName:string;
    userMoney:number=0.00;
    userQrcode:string;
    menuParent = "我的桌面";
    menuName = "首页";
    refreshLink ='desktop/timeLottery';

    //保存用户银行卡列表变量
    userBankCardList:any;

    amount:number;
    bankCardId:string="-1";
    payPwd:string;

    constructor(private router:Router,private aroute:ActivatedRoute,private httpService:HttpService) {
        _router = router;
        //获取用户信息
        mainPage=this;
        this.loadUser();
    }

    loadUser(){
        $(".leftPanel_2").first().css("color","yellow");
        $(".leftPanel_2").first().css("background-image","url('/assets/img/daohangdianjian.png')");
        $(".leftPanel_2").first().css("background-repeat","no-repeat");
        this.router.navigate(['common/main/desktop/timeLottery']);
        this.loadUserInfo();
    }

    loadUserInfo(){
        this.httpService.get({
            url:'/user/findUserInfo',
            data:[]
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                this.userName = data.data.nickName;
                this.userMoney = data.data.balance;
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

    /*
    * 获取充值二维码参数
    */
    loadRechargeQrcode(){
        this.httpService.get({
            url:'/common/findParameter',
            data:{
                paraName:'recharge_qrcode'
            }
        }).subscribe((data:any)=>{
            if(data.code === "0000"){
                //Utils.show("获取成功!");
                this.userQrcode = data.data;
            }else{
                Utils.show("获取充值二维码失败!");
            }
        });
    }

    ngOnInit(){
        $(".leftPanel_2").first().addClass("w2");
    }

    displayMenu(){
        if(this.linkCls==='open'){
            this.linkCls = '';
            $("body").removeClass("big-page");
        } else {
            this.linkCls = 'open';
            $("body").addClass("big-page");
        }
    }

    //退出鼠标经过颜色
    signOver($event:any){
        $($event.target).css("color","red");
        $($event.target).css("text-decoration","underline");
    }

    signOut($event:any){
        var isClick = $($event.target).attr("isClick");
        $($event.target).css("color","black");
        $($event.target).css("text-decoration","none");
    }

    loginOut(){
        layer.confirm('你确定要退出系统？', {
            btn: ['确定','取消'] //按钮
        }, function(idx:number){
          layer.closeAll();
          mainPage.httpService.loginOut();
        }, function(){
            //取消
        });
    }

    showTitle(menuParent:string,menuName:string,refreshLink:string){
        this.menuParent = menuParent;
        this.menuName = menuName;
        this.refreshLink = refreshLink;
        this.router.navigate(['common/main/'+refreshLink]);
    }

    showStyle($event:any,refreshLink:string,refreshClass:string){
        $(".leftPanel_total").children().removeClass("w2");
        if(refreshClass == ""){
            $($event.target).addClass("w2");
        }else{
            $(refreshClass).addClass("w2");
        }

        this.router.navigate(['common/main/'+refreshLink]);

        //重新加载用户信息
        this.loadUserInfo();
    }

    rechargePage(){
        $(".cashMoney").show();
        $(".recharge").show();
        this.loadRechargeQrcode();
    }

    withdrawalsPage(){
        $(".cashMoney").show();
        $(".withdrawals").show();
        this.loadUserBankCard();
    }

    closePage(){
        $(".cashMoney").hide();
        $(".withdrawals").hide();
        $(".recharge").hide();
    }

    //获取用户银行卡列表
    //获取用户银行卡
    loadUserBankCard(){
        this.httpService.get({
            url:'/setting/bank/findAll',
            data:{}
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                this.userBankCardList = data.data;
                //alert(this.bankTypeList[0].bankName);
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

    //提交提现表单
    withdrawalsSubmit(){
        if(this.validatorWithdrawals()){
            this.httpService.post({
                url:'/withdrawals/draw',
                data:{
                    amount:this.amount,
                    bankCardId:this.bankCardId,
                    payPwd:this.payPwd
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                    this.closePage();
                    this.amount=0;
                    this.bankCardId="-1";
                    this.payPwd="";
                    this.showStyle("","/desktop/withdrawals",".leftPanel_7");
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show(data.message);
                }
            });
        }
    }

    validatorWithdrawals(){
        if(Utils.isEmpty(this.amount)){
            layer.tips('提现金额不能为空', '#amount',{tips: 1});
            $("#amount").focus();
            return false;
        }
        if(Utils.isEmpty(this.bankCardId) || this.bankCardId == "-1"){
            layer.tips('开户银行不能为空', '#bankCardId',{tips: 1});
            $("#bankCardId").focus();
            return false;
        }
        if(Utils.isEmpty(this.payPwd)){
            layer.tips('支付密码不能为空', '#payPwd',{tips: 1});
            $("#payPwd").focus();
            return false;
        }
        return true;
    }

}
