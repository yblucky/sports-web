import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-ico',
    templateUrl: './ico.html',
    styleUrls: ['./ico.scss']
})
export class IcoPage {
    

     find:any={
      state:"",
      icoEgName:"",
      icoName:""
     
    };
    imageUrl:string = "";
    nickName:any = "";
    currencyTypes:any;
    datas:any;
    subData:any={};
    roles:any;
    isEdit:boolean;
    constructor(private httpService:HttpService,private utils:Utils) {
        this.httpService.items = null;
        this.httpService.currentPage = 1;
        this.loadData();
        this.loadType();
        
        nowPage = this;
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/appCoinIco/findAll',
            data:this.find
        });
    }

   


    changeImg(id:any){
      var imgFile = new FileReader();
      if(""!=$("#"+id+"_file").val()){
        imgFile.readAsDataURL($("#"+id+"_file")[0].files[0]);
        imgFile.onload = function () {
          var imgData:any = this.result;
          $("#"+id+"_img").attr("src",imgData);
           nowPage.httpService.post({
                url:'/appCoinIco/upImg',
                data:{imgPath:imgData}
            }).subscribe((data:any)=>{
                if(data.code==='0000'){

                  nowPage.imageUrl = data.data;
                
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });  






        }
      }
    }

    /**
    * 弹出新增面板
    */
    showAddPanel(){
        nowPage.imageUrl = '';
        this.nickName = "";
        $("#1_file").attr("value","");
        $("#1_img").attr("src","");
        this.isEdit = false;

        this.subData = {
            icoName: '',
            icoEgName: '',
            icoShortName:"",
            currencyId:"",
            limitCount:0,
            sellScale:0,
            minCount: 0,

            releaseScale: 0,
            startTime: '',
            endTime: '',
            circulation: 0,
            sellCount:0,

            imgUrl:nowPage.imageUrl,
           /* releaseCount:"",*/
            currencyType:"",
            remark:"",
            state:""
        };
       
        layer.open({
            title: "添加Ico",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['700px','650px'],
            content: $("#editPanel"),
            yes: function(index:number){
                if(nowPage.validator()){
                     nowPage.subData.imgUrl = nowPage.imageUrl;
                    nowPage.httpService.post({
                        url:'/appCoinIco/add',
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
        $("#1_img").attr("src",Utils.FILE_SERVE_URL+item.imgUrl);
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
            area: ['700px','650px'],
            content: $("#editPanel"),
            yes: function(index:number){
                nowPage.subData.imgUrl = nowPage.imageUrl;
                nowPage.httpService.post({
                    url:'/appCoinIco/update',
                    data:nowPage.subData
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
                
            }
        });
    }



    deleteItem(item:any){
        layer.confirm('您确定要删除此数据吗？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            nowPage.httpService.post({
                url:'/appCoinIco/delete',
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
        if(Utils.isEmpty(this.subData.icoName)){
            layer.tips('ico中文名不能为空', '#icoName',{tips: 1});
            $("#icoName").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.icoEgName)){
            layer.tips('ico英文名不能为空', '#icoEgName',{tips: 1});
            $("#icoEgName").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.icoShortName)){
            layer.tips('ico简称', '#icoShortName',{tips: 1});
            $("#icoShortName").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.currencyId)){
            layer.tips('币种类型不能为空', '#currencyId',{tips: 1});
            $("#currencyId").focus();
            return false;
        }

         if(Utils.isEmpty(this.subData.limitCount)){
            layer.tips('ID限制数量不能为空', '#limitCount',{tips: 1});
            $("#limitCount").focus();
            return false;
        }

        if(Utils.isEmpty(this.subData.minCount)){
            layer.tips('最小购买数量不能为空', '#minCount',{tips: 1});
            $("#minCount").focus();
            return false;
        }



        if(Utils.isEmpty(this.subData.releaseScale)){
            layer.tips('释放比例不能为空', '#releaseScale',{tips: 1});
            $("#releaseScale").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.sellScale)){
            layer.tips('兑换价格比例不能为空', '#sellScale',{tips: 1});
            $("#sellScale").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.circulation)){
            layer.tips('发行总量不能为空', '#circulation',{tips: 1});
            $("#circulation").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.sellCount)){
            layer.tips('已出售总量不能为空', '#sellCount',{tips: 1});
            $("#sellCount").focus();
            return false;
        }



         if(Utils.isEmpty(this.subData.currencyType)){
            layer.tips('接受币种类型不能为空', '#currencyType',{tips: 1});
            $("#currencyType").focus();
            return false;
        }
        if(Utils.isEmpty(this.subData.state)){
            layer.tips('状态不能为空', '#state11',{tips: 1});
            $("#state11").focus();
            return false;
        }
       
        
        return true;
    }


     /**
     * 加载币种类型
     */
     loadType(){
          this.httpService.get({
                url:'/appCurrencyType/findAll'
            }).subscribe((data:any)=>{
                if(data.code==='0000'){

                    this.currencyTypes = data.data;
                
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });


     }
}
