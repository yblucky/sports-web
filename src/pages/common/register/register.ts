import { Component } from "@angular/core";
import { Router } from '@angular/router';

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;

@Component({
    selector   : 'page-login',
    templateUrl: './register.html',
    styleUrls: ['./register.scss']
})
export class RegisterPage {

    mobile:string;//手机号
    nickName:string;//用户昵称
    inviteMobile:string;//代理手机号
    loginPwd:string;//登录密码
    confirmLoginPwd:string;//确认登录密码
    payPwd:string;//支付密码
    confirmPayPwd:string;//确认支付密码
    smsCode:string;//短信验证码
    constructor(private router:Router,private httpService:HttpService) {
    }

    ngOnInit(){
        $("#mobile").focus();
    }

    /**
    * 回车键提交表单
    */
    submitData(evt:any){
        if(evt.keyCode===13){
            this.register();
        }
    }

    /**
    * 用户登录
    */
    register(){
        if(this.validator()){
            this.httpService.post({
                url:'/user/register',
                data:{
                    mobile:this.mobile,
                    nickName:this.nickName,
                    inviteMobile:this.inviteMobile,
                    loginPwd:this.loginPwd,
                    payPwd:this.payPwd,
                    smsCode:this.smsCode
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    layer.msg("用户注册成功",{
                        icon: '1',
                        time: 2000
                    },()=>this.router.navigate(['common/login']));
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("注册失败");
                }
            });
        }
    }

    /*
    * 获取手机验证码
    */
    loadMobileCode(){
        if(Utils.isEmpty(this.mobile)){
            layer.tips('手机号不能为空', '#mobile',{tips: 1});
            $("#mobile").focus();
            return false;
        }
        this.httpService.get({
            url:'/common/registerSms',
            data:{
                mobile:this.mobile,
                areaNum:'86'
            }
        }).subscribe((data:any)=>{
            if(data.code === "0000"){
                Utils.show("获取验证码成功!");
            }else{
                Utils.show("获取验证码失败!");
            }
        });
    }

    /**
    * 清空表单数据
    */
    clearVal(){
        this.router.navigate(['common/login']);
    }

    //验证表单数据
    validator(){
        if(Utils.isEmpty(this.mobile)){
            layer.tips('手机号不能为空', '#mobile',{tips: 1});
            $("#mobile").focus();
            return false;
        }
        if(Utils.isEmpty(this.nickName)){
            layer.tips('用户昵称不能为空', '#nickName',{tips: 1});
            $("#nickName").focus();
            return false;
        }
        if(Utils.isEmpty(this.inviteMobile)){
            layer.tips('代理手机号不能为空', '#inviteMobile',{tips: 1});
            $("#inviteMobile").focus();
            return false;
        }
        if(Utils.isEmpty(this.loginPwd)){
            layer.tips('登录密码不能为空', '#loginPwd',{tips: 1});
            $("#loginPwd").focus();
            return false;
        }
        if(Utils.isEmpty(this.payPwd)){
            layer.tips('支付密码不能为空', '#payPwd',{tips: 1});
            $("#payPwd").focus();
            return false;
        }
        if(Utils.isEmpty(this.smsCode)){
            layer.tips('验证码不能为空', '#smsCode',{tips: 1});
            $("#smsCode").focus();
            return false;
        }
        if(this.confirmLoginPwd != this.loginPwd){
            layer.tips('登录密码不一致', '#confirmLoginPwd',{tips: 1});
            $("#confirmLoginPwd").focus();
            return false;
        }
        if(this.confirmPayPwd != this.payPwd){
            layer.tips('支付密码不一致', '#confirmPayPwd',{tips: 1});
            $("#confirmPayPwd").focus();
            return false;
        }
        return true;
    }

    //确认登录密码
    loginPwdPair(){
        if(this.confirmLoginPwd != this.loginPwd){
            layer.tips('登录密码不一致', '#confirmLoginPwd',{tips: 1});
            $("#confirmLoginPwd").focus();
            return false;
        }
    }

    payPwdPair(){
        if(this.confirmPayPwd != this.payPwd){
            layer.tips('支付密码不一致', '#confirmPayPwd',{tips: 1});
            $("#confirmPayPwd").focus();
            return false;
        }
    }
}
