import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-message',
    templateUrl: './message.html',
    styleUrls: ['./message.scss']
})
export class MessagePage {
    

     find:any={
      uid:"",
      title:"",
      content:"",
      startTime:"",
      endTime:""
    };
    nickName:any = "";
    
    datas:any;
    subData:any={};
    roles:any;
    isEdit:boolean;
    constructor(private httpService:HttpService,private utils:Utils) {
        this.httpService.items = null;
        this.httpService.currentPage = 1;
        this.loadData();
        
        nowPage = this;
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/appUserMessage/findAll',
            data:this.find
        });
    }

    /**
    * 加载用户信息
    */
    findUid(){
        console.log(this.subData.uid);
        if(this.subData.uid == "" ||this.subData.uid ==undefined){
                this.nickName = "";
        }else{
            var person = {
                uid:this.subData.uid
            }

           nowPage.httpService.get({
                url:'/appUserMessage/findUid',
                data:person
            }).subscribe((data:any)=>{
                
                if(data.code==='0000'){
                       if(data.data == null){
                             this.nickName = data.message;
                       } else{
                             this.nickName = data.data.nickName;   
                       }
                
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });

        }
        
    }


    /**
    * 弹出新增面板
    */
    showAddPanel(){
        this.nickName = "";
        this.isEdit = false;
        this.subData = {
            title: '',
            content: '',
            remark:"",
            createTime:"",
            endTime:"",
            state: '10'
        };
       
        layer.open({
            title: "添加个人消息",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['450px','390px'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/appUserMessage/add',
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

    

    deleteItem(item:any){
        layer.confirm('您确定要删除此数据吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            nowPage.httpService.post({
                url:'/appUserMessage/delete',
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
         if(Utils.isEmpty(this.subData.uid)){
            layer.tips('uid不能为空', '#uid',{tips: 1});
            $("#uid").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.title)){
            layer.tips('标题不能为空', '#title',{tips: 1});
            $("#title").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.content)){
            layer.tips('内容不能为空', '#content',{tips: 1});
            $("#content").focus();
            return false;
        }

        
        return true;
    }
}
