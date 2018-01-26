import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-currencyType',
    templateUrl: './currencyType.html',
    styleUrls: ['./currencyType.scss']
})
export class currencyTypePage {

    datas:any;
    subData:any={
            remark:"",
            currencyName:"",
            currencyEgName:"",
            currentEnPrice:0,
            currentZhPrice:0,
            exrateUrl:"",
            currencyType:0,
            state: "10",
            color: "",
            buyMinRate:0,
            buyMaxRate:0,
            saleMaxRate:0,
            saleMinRate:0,
            maxDailyRiseRate:0,
            minDailyRiseRate:0,
            maxDailyDeclineRate:0,
            minDailyDeclineRate:0,
            changePerTransaction:0,
            basePrice:0,
            saleSwitch:'off',
            buySwitch:'off'

    };
    roles:any;
    isEdit:boolean;
    osType:any = 1;  //控制界面弹出窗口，1：新增修改 2：详情参数
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
            url:'/appCurrencyType/findAll',
            data:{}
        });
    }

    

    /**
    * 弹出新增面板
    */
    showAddPanel(){
        this.osType = 1;
        this.isEdit = false;
        this.subData = {
            remark:"",
            currencyName:"",
            currencyEgName:"",
            currentEnPrice:0,
            currentZhPrice:0,
            exrateUrl:"",
            currencyType:0,
            state: "10",
            color: "",
            buyMinRate:0,
            buyMaxRate:0,
            saleMaxRate:0,
            saleMinRate:0,
            maxDailyRiseRate:0,
            minDailyRiseRate:0,
            maxDailyDeclineRate:0,
            minDailyDeclineRate:0,
            changePerTransaction:0,
            basePrice:0,
            saleSwitch:'off',
            buySwitch:'off'

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
            area: ['350px','550px'],
            content: $("#editPanel"),
            yes: function(index:number){
                console.log(nowPage.validator());
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/appCurrencyType/add',
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
        this.osType = 1;
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
            area: ['350px','550px'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator()){
                    nowPage.httpService.post({
                        url:'/appCurrencyType/update',
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



    /**
    * 弹出详情参数设置面板
    */
    showEditPersonPanel(item:any){
        this.osType = 2;
        this.isEdit = true;
        this.subData = Utils.copyObject(item);
        layer.open({
            title: "详情参数设置",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['700px','420px'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator1()){
                    nowPage.httpService.post({
                        url:'/appCurrencyType/update',
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
                url:'/appCurrencyType/delete',
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
                url:'/appCurrencyType/update',
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
                url:'/appCurrencyType/update',
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
        if(Utils.isEmpty(this.subData.currencyName)){
            layer.tips('币种中文不能为空', '#currencyName',{tips: 1});
            $("#currencyName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.currencyEgName)){
            layer.tips('币种英文不能为空', '#currencyEgName',{tips: 1});
            $("#currencyEgName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.currentZhPrice)){
            layer.tips('币种中文价格不能为空', '#currentZhPrice',{tips: 1});
            $("#currentZhPrice").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.currentEnPrice)){
            layer.tips('币种英文价格不能为空', '#currentEnPrice',{tips: 1});
            $("#currentEnPrice").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.exrateUrl)){
            layer.tips('币种接口不能为空', '#exrateUrl',{tips: 1});
            $("#exrateUrl").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.currencyType)){
            layer.tips('币种类型不能为空', '#currencyType',{tips: 1});
            $("#currencyType").focus();
            return false;
        }
        return true;
    }

     validator1(){
        
        if(Utils.isEmpty(this.subData.buyMaxRate)){
            layer.tips('买入区间最大百分比不能为空', '#buyMaxRate',{tips: 1});
            $("#currencyName").focus();
            return false;
        }

        if(this.subData.buyMaxRate<0 || this.subData.buyMaxRate>=1){
            layer.tips('买入区间最大百分比只能大于等于0小于1', '#buyMaxRate',{tips: 1});
            $("#currencyName").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.buyMinRate)){
            layer.tips('买入区间最小百分比不能为空', '#buyMinRate',{tips: 1});
            $("#buyMinRate").focus();
            return false;
        }


        if(this.subData.buyMinRate<0 || this.subData.buyMinRate>=1){
            layer.tips('买入区间最小百分比只能大于等于0小于1', '#buyMinRate',{tips: 1});
            $("#buyMinRate").focus();
            return false;
        }


       /* if(this.subData.buyMaxRate <= this.subData.buyMinRate){
            layer.tips('买入区间最大百分比不能小于等于买入区间最小百分比', '#buyMaxRate',{tips: 1});
            $("#buyMaxRate").focus();
            return false;
        }*/




        if(Utils.isEmpty(this.subData.saleMaxRate)){
            layer.tips('卖出区间最大百分比不能为空', '#saleMaxRate',{tips: 1});
            $("#saleMaxRate").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.saleMinRate)){
            layer.tips('卖出区间最小百分比不能为空', '#saleMinRate',{tips: 1});
            $("#saleMinRate").focus();
            return false;
        }


        if(this.subData.saleMaxRate<0 || this.subData.saleMaxRate>=1 ){
            layer.tips('卖出区间最大百分比只能大于等于0小于1', '#saleMaxRate',{tips: 1});
            $("#saleMaxRate").focus();
            return false;
        }

        if(this.subData.saleMinRate<0 || this.subData.saleMinRate>=1){
            layer.tips('卖出区间最小百分比只能大于等于0小于1', '#saleMinRate',{tips: 1});
            $("#saleMinRate").focus();
            return false;
        }


       /* if(this.subData.saleMaxRate <= this.subData.saleMinRate ){
            layer.tips('卖出区间最大百分比不能小于等于卖出区间最小百分比', '#saleMaxRate',{tips: 1});
            $("#saleMaxRate").focus();
            return false;
        }*/










        if(Utils.isEmpty(this.subData.maxDailyRiseRate)){
            layer.tips('上升最大值百分比不能为空', '#maxDailyRiseRate',{tips: 1});
            $("#maxDailyRiseRate").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.minDailyRiseRate)){
            layer.tips('上升最小值百分比不能为空', '#minDailyRiseRate',{tips: 1});
            $("#minDailyRiseRate").focus();
            return false;
        }

        if(this.subData.maxDailyRiseRate <0 || this.subData.maxDailyRiseRate >=1 ){
            layer.tips('上升最大值百分比只能大于等于0小于1', '#maxDailyRiseRate',{tips: 1});
            $("#maxDailyRiseRate").focus();
            return false;
        }

        if(this.subData.minDailyRiseRate <0 || this.subData.minDailyRiseRate >=1 ){
            layer.tips('上升最小值百分比只能大于等于0小于1', '#maxDailyRiseRate',{tips: 1});
            $("#minDailyRiseRate").focus();
            return false;
        }

        if(this.subData.maxDailyRiseRate <= this.subData.minDailyRiseRate){
            layer.tips('上升最大值百分比不能小于等于上升最小值百分比', '#maxDailyRiseRate',{tips: 1});
            $("#minDailyRiseRate").focus();
            return false;
        }



        if(Utils.isEmpty(this.subData.maxDailyDeclineRate)){
            layer.tips('下降最大值百分比不能为空', '#maxDailyDeclineRate',{tips: 1});
            $("#maxDailyDeclineRate").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.minDailyDeclineRate)){
            layer.tips('下降最小值百分比不能为空', '#minDailyDeclineRate',{tips: 1});
            $("#minDailyDeclineRate").focus();
            return false;
        }

        if(this.subData.maxDailyDeclineRate  <0 || this.subData.maxDailyDeclineRate >=1 ){
            layer.tips('下降最大值百分比只能大于等于0小于1', '#maxDailyDeclineRate',{tips: 1});
            $("#maxDailyDeclineRate").focus();
            return false;
        }

        if(this.subData.minDailyDeclineRate  <0 || this.subData.minDailyDeclineRate >=1 ){
            layer.tips('下降最小值百分比只能大于等于0小于1', '#maxDailyDeclineRate',{tips: 1});
            $("#minDailyDeclineRate").focus();
            return false;
        }

        if(this.subData.maxDailyDeclineRate  <= this.subData.minDailyDeclineRate){
            layer.tips('下降最大值百分比不能小于等于下降最小值百分比', '#maxDailyDeclineRate',{tips: 1});
            $("#maxDailyDeclineRate").focus();
            return false;
        }



        if(Utils.isEmpty(this.subData.changePerTransaction)){
            layer.tips('价格波动基准指数不能为空', '#changePerTransaction',{tips: 1});
            $("#changePerTransaction").focus();
            return false;
        }
        
        if(this.subData.changePerTransaction<=0){
            layer.tips('价格波动基准指数必须大于0', '#changePerTransaction',{tips: 1});
            $("#changePerTransaction").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.basePrice)){
            layer.tips('上个基准价格不能为空', '#basePrice',{tips: 1});
            $("#basePrice").focus();
            return false;
        }
       
        return true;
    }
}
