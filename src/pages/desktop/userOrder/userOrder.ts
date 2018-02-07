import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;
declare var layer: any;
var stbExchangePage: any;

@Component({
    selector   : 'page-userOrder',
    templateUrl: './userOrder.html',
    styleUrls: ['./userOrder.scss']
})
export class UserOrderPage {
    find:any={
      busnessType:"".trim(),
      currencyType:"10".trim(),
      uid:"".trim(),
      mobile:"".trim(),
      startTime:"".trim(),
      endTime:"".trim(),

    };
    currencyTypes:any;
    orderData:any;
    showTime:any = new Date();
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        stbExchangePage=this;
        this.loadDataOne();
    }

    /**
    * 搜索默认第一页
    */
    loadDataOne(){
      this.httpService.currentPage=1;
      this.loadData();
    }

    /**
    * 加载数据
    */
    loadData(){
      this.httpService.pagination({
          url:'/record/record',
          data:this.find
      });

    }


      /**
      * 弹出等级面板
      */
      openDetail(item:any){
          if(item.busnessType==31){
            this.httpService.get({
                url:'/record/racingBettingRecord',
                data:{businessNumber:item.businessNumber}
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                  this.orderData = data.data;
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
          }else{
            this.httpService.get({
                url:'/record/timeBettingRecord',
                data:{businessNumber:item.businessNumber}
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                  this.orderData = data.data;
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("系统异常，请联系管理员");
                }
            });
          }

          layer.open({
              title: "投注明细",
              btn: ["确认","退出"],
              type: 1,
              closeBtn: 0,
              shade: 0,
              fixed: true,
              shadeClose: false,
              resize: false,
              area: ['550px','400px'],
              content: $("#editPanel"),
              yes: function(index:number){
                     layer.closeAll();
              }
          });

      }

}
