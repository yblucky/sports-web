import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var paraPage: any;

@Component({
    selector   : 'page-parameter',
    templateUrl: './parameter.html',
    styleUrls: ['./parameter.scss']
})
export class ParameterPage {

    datas:any;
    subData:any={};
    editType:number;
    groupTypes:any;
    find:any={
      paraName:"",
      groupType:""
    };
    constructor(private httpService:HttpService,private utils:Utils) {
        this.httpService.items = null;
        this.httpService.currentPage = 1;
        this.loadData();
        this.loadType();
        paraPage = this;
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/parameter/findAll',
            data:this.find
        });
    }

    /**
     * 加载类型
     */
     loadType(){
          this.httpService.get({
                url:'/parameter/findGrouptype'
            }).subscribe((data:any)=>{
                if(data.code==='0000'){

                    this.groupTypes = data.data;
                
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
        this.subData = {
            paraName: '',
            paraValue: '',
            paraCnName: '',
            remark: '',
            state: '10',
            groupType:''
        };
        this.editType=1;
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
                if(paraPage.validator()){
                    paraPage.httpService.post({
                        url:'/parameter/add',
                        data:paraPage.subData
                    }).subscribe((data:any)=>{
                        layer.closeAll();
                        if(data.code==='0000'){
                            //新增成功
                           layer.msg(data.message,{
                               icon: '1',
                               time: 2000
                           },function(){
                               paraPage.loadData();
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
        this.editType=2;
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
            area: ['350px','auto'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(paraPage.validator()){
                    paraPage.httpService.post({
                        url:'/parameter/update',
                        data:paraPage.subData
                    }).subscribe((data:any)=>{
                        layer.closeAll();
                        if(data.code==='0000'){
                            //修改成功
                           layer.msg(data.message,{
                               icon: '1',
                               time: 2000
                           },function(){
                               paraPage.loadData();
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
            paraPage.httpService.post({
                url:'/parameter/delete',
                data:item
            }).subscribe((data:any)=>{
                layer.closeAll();
                if(data.code==='0000'){
                    //删除成功
                   layer.msg(data.message,{
                       icon: '1',
                       time: 2000
                   },function(){
                       paraPage.loadData();
                   });
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
        });
    }

    validator(){
        if(Utils.isEmpty(this.subData.paraName)){
            layer.tips('参数key不能为空', '#paraName',{tips: 1});
            $("#paraName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.paraValue)){
            layer.tips('参数值不能为空', '#paraValue',{tips: 1});
            $("#paraValue").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.paraCnName)){
            layer.tips('参数中文名不能为空', '#paraCnName',{tips: 1});
            $("#paraCnName").focus();
            return false;
        }
        return true;
    }
}
