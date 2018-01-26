import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var updatePwPage: any

@Component({
    selector   : 'page-updatePw',
    templateUrl: './updatePw.html',
    styleUrls: ['./updatePw.scss']
})
export class UpdatePwPage {
    subData = {
        oldPw:'',
        newPw:'',
        okPw:''
    }
    constructor(private httpService:HttpService,private utils:Utils) {
        updatePwPage=this;
    }

    submitData(){
        if(this.validator()){
            this.httpService.post({
                url:'/user/updatePw',
                data:this.subData
            }).subscribe((data:any)=>{
                layer.closeAll();
                if(data.code==='0000'){
                    //修改成功
                   layer.msg(data.message,{
                       icon: '1',
                       time: 2000
                   },function(){
                       updatePwPage.httpService.loginOut();
                   });
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
        }
    }

    validator(){
        if(Utils.isEmpty(this.subData.oldPw)){
            layer.tips('旧密码不能为空', '#oldPw',{tips: 1});
            $("#oldPw").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.newPw)){
            layer.tips('新密码不能为空', '#newPw',{tips: 1});
            $("#newPw").focus();
            return false;
        }

        if(this.subData.newPw.trim().length<6||this.subData.newPw.trim().length>32){
            layer.tips('密码为6-32位半角字符', '#newPw',{tips: 1});
            $("#newPw").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.okPw)){
            layer.tips('确认码不能为空', '#okPw',{tips: 1});
            $("#okPw").focus();
            return false;
        }
        return true;
    }

}
