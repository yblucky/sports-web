import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-userInfo',
    templateUrl: './userInfo.html',
    styleUrls: ['./userInfo.scss']
})
export class UserInfoPage {

    datas:any;
    subData:any={};
    roles:any;
    isEdit:boolean;
    constructor(private httpService:HttpService,private utils:Utils) {
        this.httpService.items = null;
        this.httpService.currentPage = 1;
        this.loadData();
        this.loadRoles();
        nowPage = this;
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/user/findAll',
            data:{}
        });
    }

    /**
    * 加载角色
    */
    loadRoles(){
        this.httpService.get({
            url:'/user/findRoles',
            data:{}
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                this.roles = data.data;
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

    /**
    * 弹出新增面板
    */
    showAddPanel(){
        this.isEdit = false;
        this.subData = {
            userName: '',
            loginName: '',
            password: '1q2w3e',
            mobile: '',
            roleId: '',
            roleName: '',
            state: '10'
        };
        for(let obj in this.roles){
            this.subData.roleId = this.roles[obj].id;
            this.subData.roleName = this.roles[obj].roleName;
            break;
        }
        layer.open({
            title: "添加参数",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['350px','auto'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/user/add',
                        data:nowPage.subData
                    }).subscribe((data:any)=>{
                        layer.closeAll();
                        if(data.code==='0000'){
                            //新增成功
                           layer.msg(data.message,{
                               icon: '1',
                               time: 2000
                           },function(){
                               nowPage.loadData();
                           });
                        }else if(data.code==='9999'){
                            Utils.show(data.message);
                        }else{
                            Utils.show("系统异常，请联系管理员");
                        }
                    });
                }
            }
        });
    }

    /**
    * 弹出编辑面板
    */
    showEditPanel(item:any){
        this.isEdit = true;
        this.subData = Utils.copyObject(item);
        this.subData.password = "******";
        layer.open({
            title: "修改参数",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['350px','auto'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/user/update',
                        data:nowPage.subData
                    }).subscribe((data:any)=>{
                        layer.closeAll();
                        if(data.code==='0000'){
                            //修改成功
                           layer.msg(data.message,{
                               icon: '1',
                               time: 2000
                           },function(){
                               nowPage.loadData();
                           });
                        }else if(data.code==='9999'){
                            Utils.show(data.message);
                        }else{
                            Utils.show("系统异常，请联系管理员");
                        }
                    });
                }
            }
        });
    }

    deleteItem(item:any){
        layer.confirm('您确定要删除此数据吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            nowPage.httpService.post({
                url:'/user/delete',
                data:item
            }).subscribe((data:any)=>{
                layer.closeAll();
                if(data.code==='0000'){
                    //删除成功
                   layer.msg(data.message,{
                       icon: '1',
                       time: 2000
                   },function(){
                       nowPage.loadData();
                   });
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
        });
    }

    disableItem(item:any){
        layer.confirm('您确定要禁用此数据吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            nowPage.httpService.post({
                url:'/user/disable',
                data:item
            }).subscribe((data:any)=>{
                layer.closeAll();
                if(data.code==='0000'){
                    //删除成功
                   layer.msg(data.message,{
                       icon: '1',
                       time: 2000
                   },function(){
                       nowPage.loadData();
                   });
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
        });
    }

    enabledItem(item:any){
        layer.confirm('您确定要启用此数据吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            nowPage.httpService.post({
                url:'/user/enabled',
                data:item
            }).subscribe((data:any)=>{
                layer.closeAll();
                if(data.code==='0000'){
                    //删除成功
                   layer.msg(data.message,{
                       icon: '1',
                       time: 2000
                   },function(){
                       nowPage.loadData();
                   });
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
        });
    }

    setRole(opt:any){
        this.subData.roleId = opt.id;
        this.subData.roleName = opt.roleName;
    }

    validator(){
        if(Utils.isEmpty(this.subData.userName)){
            layer.tips('用户名不能为空', '#userName',{tips: 1});
            $("#userName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.loginName)){
            layer.tips('登录名不能为空', '#loginName',{tips: 1});
            $("#loginName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.password)){
            layer.tips('密码不能为空', '#password',{tips: 1});
            $("#password").focus();
            return false;
        }
        return true;
    }
}
