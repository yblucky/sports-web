import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-userStarLevel',
    templateUrl: './userStarLevel.html',
    styleUrls: ['./userStarLevel.scss']
})
export class UserStarLevelPage {

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
            url:'/appUserStar/findAll',
            data:{}
        });
    }

    

    /**
    * 弹出新增面板
    */
    showAddPanel(){
        this.isEdit = false;
        this.subData = {
              starLevelName: "",
              minScore: 0,
              maxScore: 0,
              enjoyLevel: 0,
              exchangeMinScale: 0,
              exchangeMaxScale: 0,
              transferMinScale: 0,
              transferMaxScale: 0,
              reachStarLevel:0
        };
        
        layer.open({
            title: "添加参数",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['450px','auto'],
            content: $("#editPanel"),
            yes: function(index:number){
                console.log(nowPage.validator());
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/appUserStar/add',
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
        layer.open({
            title: "修改参数",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['450px','auto'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/appUserStar/update',
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
                url:'/appUserStar/delete',
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

            item.state  = "20";
            nowPage.httpService.post({
                url:'/appUserStar/update',
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
             item.state  = "10";
            nowPage.httpService.post({
                url:'/appUserStar/update',
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
        if(Utils.isEmpty(this.subData.starLevelName)){
            layer.tips('星级不能为空', '#starLevelName',{tips: 1});
            $("#starLevelName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.minScore)){
            layer.tips('星级最小积分不能为空', '#minScore',{tips: 1});
            $("#minScore").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.maxScore)){
            layer.tips('星级最大积分不能为空', '#maxScore',{tips: 1});
            $("#maxScore").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.enjoyLevel)){
            layer.tips('对应星级享受代数不能为空', '#enjoyLevel',{tips: 1});
            $("#enjoyLevel").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.reachStarLevel)){
            layer.tips('达到星级所需直推代数不能为空', '#reachStarLevel',{tips: 1});
            $("#reachStarLevel").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.exchangeMinScale)){
            layer.tips('余额兑换积分上级获取影子积分最小比例不能为空', '#exchangeMinScale',{tips: 1});
            $("#exchangeMinScale").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.exchangeMaxScale)){
            layer.tips('余额兑换积分上级获取影子积分最大比例不能为空', '#exchangeMaxScale',{tips: 1});
            $("#exchangeMaxScale").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.transferMinScale)){
            layer.tips('转账上级获取影子积分最小比例', '#transferMinScale',{tips: 1});
            $("#transferMinScale").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.transferMaxScale)){
            layer.tips('转账上级获取影子积分最大比例', '#transferMaxScale',{tips: 1});
            $("#transferMaxScale").focus();
            return false;
        }

        return true;
    }
}
