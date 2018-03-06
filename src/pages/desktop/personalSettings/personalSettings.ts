import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


declare var $: any;
declare var layer: any;
declare var $interval: any;
declare var Highcharts: any;

var personalSettingsPage:any;

@Component({
    selector   : 'page-personalSettings',
    templateUrl: './personalSettings.html',
    styleUrls: ['./personalSettings.scss']
})
export class PersonalSettingsPage {

    oldLoginPwd:string;//旧登录密码
    newLoginPwd:string;//新登录密码
    confirmNewLoginPwd:string;//确认新登录密码

    oldPwd:string;  //旧支付密码
    newPwd:string;  //新支付密码
    confirmNewPwd:string; //确认新支付密码

    bankTypeList:any;//银行卡类型列表
    userBankCardList:any;//用户银行卡列表

    //新增用户银行卡
    cardName:string;  //持卡人姓名
    bankCard:string;  //银行卡号
    branch:string;  //开户支行
    bankTypeId:string = "-1";  //银行开户类型



    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
        });
        personalSettingsPage = this;
    }

    //修改登录密码
    modfiyLoginPwd(){
        if(this.validatorLoginPwd()){
            this.httpService.post({
                url:'/setting/user/modfiyLoginPwd',
                data:{
                    oldLoginPwd:this.oldLoginPwd,
                    newLoginPwd:this.newLoginPwd
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show(data.message);
                }
            });
        }
    }

    //验证表单数据
    validatorLoginPwd(){
        if(Utils.isEmpty(this.oldLoginPwd)){
            layer.tips('原密码不能为空', '#oldLoginPwd',{tips: 1});
            $("#oldLoginPwd").focus();
            return false;
        }
        if(Utils.isEmpty(this.newLoginPwd)){
            layer.tips('新密码不能为空', '#newLoginPwd',{tips: 1});
            $("#newLoginPwd").focus();
            return false;
        }
        if(this.oldLoginPwd == this.newLoginPwd){
            layer.tips('新密码不能和旧密码一致', '#newLoginPwd',{tips: 1});
            $("#newLoginPwd").focus();
            return false;
        }
        if(this.confirmNewLoginPwd != this.newLoginPwd){
            layer.tips('登录密码不一致', '#confirmNewLoginPwd',{tips: 1});
            $("#confirmNewLoginPwd").focus();
            return false;
        }
        return true;
    }

    //修改支付密码
    modfiyPayPwd(){
        if(this.validatorPayPwd()){
            this.httpService.post({
                url:'/setting/user/modfiyPayPwd',
                data:{
                    oldPwd:this.oldPwd,
                    newPwd:this.newPwd
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show(data.message);
                }
            });
        }
    }

    //验证表单数据
    validatorPayPwd(){
        if(Utils.isEmpty(this.oldPwd)){
            layer.tips('原密码不能为空', '#oldPwd',{tips: 1});
            $("#oldPwd").focus();
            return false;
        }
        if(Utils.isEmpty(this.newPwd)){
            layer.tips('新密码不能为空', '#newPwd',{tips: 1});
            $("#newPwd").focus();
            return false;
        }
        if(this.oldPwd == this.newPwd){
            layer.tips('新密码不能和旧密码一致', '#newPwd',{tips: 1});
            $("#newPwd").focus();
            return false;
        }
        if(this.confirmNewPwd != this.newPwd){
            layer.tips('登录密码不一致', '#confirmNewPwd',{tips: 1});
            $("#confirmNewPwd").focus();
            return false;
        }
        return true;
    }

    //投注类别
    betCategory($event:any,betCategory_index:string){
        $($event.target).siblings("span").css("background-color","#A7D6CD");
        $($event.target).css("background-color","#148ee2");

        $(".content-tab_2").hide();
        $(".content-tab_3").hide();
        $(".content-tab_4").hide();

        $(".content-tab_"+betCategory_index).show();
        if(betCategory_index == "4"){
            //获取用户银行卡列表
            this.loadUserBankCard();
        }
    }


    //添加银行卡
    addBankCardPage(){
        $(".addBankCard").show();
        this.loadBankTypeList();
    }

    //获取银行类型列表
    loadBankTypeList(){
        this.httpService.get({
            url:'/setting/bank/typeList',
            data:{}
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                this.bankTypeList = data.data;
                //alert(this.bankTypeList[0].bankName);
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

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

    //新增用户银行卡
    addUserBankCard(){
        if(this.validatorBankCard()){
            this.httpService.post({
                url:'/setting/bank/add',
                data:{
                    name:this.cardName,
                    bankCard:this.bankCard,
                    branch:this.branch,
                    bankTypeId:this.bankTypeId
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                    this.closePage();
                    this.loadUserBankCard();
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show(data.message);
                }
            });
        }
    }

    //新增用户银行卡
    delUserBankCard(delId:string){
        layer.confirm('你确定要删除该银行卡？', {
            btn: ['确定','取消'] //按钮
        }, function(idx:number){
            personalSettingsPage.httpService.post({
                url:'/setting/bank/del',
                data:{
                    id:delId
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                    //重新加载银行卡
                    personalSettingsPage.loadUserBankCard();
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show(data.message);
                }
            });
            layer.closeAll();
        }, function(){
            //取消
        });
    }

    //验证表单数据
    validatorBankCard(){
        if(Utils.isEmpty(this.cardName)){
            layer.tips('持卡人姓名不能为空', '#cardName',{tips: 1});
            $("#cardName").focus();
            return false;
        }
        if(Utils.isEmpty(this.bankCard)){
            layer.tips('银行卡号不能为空', '#bankCard',{tips: 1});
            $("#bankCard").focus();
            return false;
        }
        if(Utils.isEmpty(this.bankTypeId) || this.bankTypeId == "-1"){
            layer.tips('开户银行不能为空', '#bankTypeId',{tips: 1});
            $("#bankTypeId").focus();
            return false;
        }
        // if(Utils.isEmpty(this.branch)){
        //     layer.tips('开户支行不能为空', '#branch',{tips: 1});
        //     $("#branch").focus();
        //     return false;
        // }

        return true;
    }

    closePage(){
        $(".addBankCard").hide();
        this.cardName="";
        this.bankCard="";
        this.branch="";
        this.bankTypeId="-1";
        //$(".withdrawals").hide();
    }

}
