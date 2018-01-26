import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-role',
    templateUrl: './role.html',
    styleUrls: ['./role.scss']
})
export class RolePage {

    roles:any;
    menuDatas:any;
    parentMenuData:any;
    roleId:any;
    constructor(private httpService:HttpService,private utils:Utils) {
        this.loadRoles();
        nowPage = this;
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
                for(let obj in this.roles){
                    this.roleId = [this.roles[obj].id];
                    this.loadMenus();
                    break;
                }
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

    /**
    * 加载菜单
    */
    loadMenus(){
        this.httpService.get({
            url:'/role/findMenus',
            data:{roleId:this.roleId}
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                this.menuDatas = data.data;
                this.parentMenuData = this.getParentMenu();
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

    /**
    * 获取父菜单集合
    */
    getParentMenu(){
        return this.getChilderMenu(this.getRootId());
    }

    /**
    * 获取根菜单编号
    */
    getRootId(){
        for(var o in this.menuDatas){
            if(this.menuDatas[o].parentId==='0'){
                return this.menuDatas[o].id;
            }
        }
        return null;
    }

    /**
    * 根据父id查找子菜单
    */
    getChilderMenu(pid:string){
        let lis = [];
        for(var o in this.menuDatas){
            if(this.menuDatas[o].parentId===pid){
                lis.push(this.menuDatas[o]);
            }
        }
        return lis;
    }

    /**
    * 点击父功能实现子功能全选和反选
    */
    isSelected(id:string,selected:boolean){
        for(var o in this.menuDatas){
            if(this.menuDatas[o].parentId===id){
                this.menuDatas[o].selected = !selected;
            }
        }
    }

    /**
    * 点击子功能，让父功能选中
    */
    checkNode(pmenu:any){
        pmenu.selected = true;
    }

    /**
    * 选中角色
    */
    selectItem(){
        this.loadMenus();
    }

    /**
    * 保存角色权限
    */
    saveRole(){
        let subData={
            roleId:this.roleId+'',
            lis:[{
                resourceId:this.getRootId()
            }]
        };
        for(let o in this.menuDatas){
            if(this.menuDatas[o].selected && this.menuDatas[o].parentId!='0'){
                subData.lis.push({resourceId:this.menuDatas[o].id});
            }
        }
        this.httpService.post({
            url:'/role/saveRolePerm',
            data:subData
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                //保存成功
               layer.msg(data.message,{
                   icon: '1',
                   time: 2000
               },function(){

               });
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

}
