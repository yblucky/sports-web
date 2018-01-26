import { Component } from "@angular/core";
import { Router } from '@angular/router';

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;

@Component({
    selector   : 'page-login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class LoginPage {

    loginName:string;//登录名
    password:string;//密码
    imgCode:string;//验证码
    imgStr:string;//图片验证码
    imgKey:string;//验证码对应的key
    constructor(private router:Router,private httpService:HttpService) {
        this.loadValiCode();//获取验证码图片
    }

    ngOnInit(){
        $("#loginName").focus();
    }

    /**
    * 回车键提交表单
    */
    submitData(evt:any){
        if(evt.keyCode===13){
            this.loginIn();
        }
    }

    /**
    * 用户登录
    */
    loginIn(){
        if(this.validator()){
            this.httpService.post({
                url:'/login/loginIn',
                data:{
                    loginName:this.loginName,
                    password:this.password,
                    imgKey:this.imgKey,
                    picCode:this.imgCode
                }
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    sessionStorage.setItem('token',data.data);
                    layer.msg("用户登录成功",{
                        icon: '1',
                        time: 2000
                    },()=>this.router.navigate(['common/main']));
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("登录失败，请联系管理员");
                }
            });
        }
    }

    /*
    * 获取图片验证码
    */
    loadValiCode(){
        this.httpService.get({
            url:'/login/loadImgCode',
            data:[]
        }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.imgStr = "data:image/jpg;base64,"+data.data.imgStr;
                this.imgKey = data.data.imgKey;
            }
        });
    }

    /**
    * 清空表单数据
    */
    clearVal(){
        this.loginName = '';
        this.password = '';
        this.imgCode = '';
        $("#loginName").focus();
    }

    //验证表单数据
    validator(){
        if(Utils.isEmpty(this.loginName)){
            layer.tips('登录名不能为空', '#loginName',{tips: 1});
            $("#loginName").focus();
            return false;
        }
        if(Utils.isEmpty(this.password)){
            layer.tips('密码不能为空', '#password',{tips: 1});
            $("#password").focus();
            return false;
        }
        if(Utils.isEmpty(this.imgCode)){
            layer.tips('验证码不能为空', '#imgCode',{tips: 1});
            $("#imgCode").focus();
            return false;
        }
        return true;
    }
}
