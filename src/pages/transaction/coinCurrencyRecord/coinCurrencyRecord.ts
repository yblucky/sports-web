import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;
declare var layer: any;
var stbExchangePage: any;

@Component({
    selector   : 'page-coinCurrencyRecord',
    templateUrl: './coinCurrencyRecord.html',
    styleUrls: ['./coinCurrencyRecord.scss']
})
export class CoinCurrencyRecordPage {
    find:any={
      uid:"",
      mobile:"",
      startTime:"",
      coinType:"",
      endTime:"",
      currencyOrderId:""
    };
    currencyTypes:any;
    showTime:any = new Date();
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        stbExchangePage=this;

        if(this.aroute.snapshot.queryParams["currencyOrderId"]!=undefined){
          this.find.currencyOrderId=this.aroute.snapshot.queryParams["currencyOrderId"];
          this.httpService.currentPage=1;
        }  

        if(this.aroute.snapshot.queryParams["startTime"]!=undefined){
          this.find.startTime=this.aroute.snapshot.queryParams["startTime"];
          this.httpService.currentPage=1;
        }
        if(this.aroute.snapshot.queryParams["endTime"]!=undefined){
          this.find.endTime=this.aroute.snapshot.queryParams["endTime"];
          this.httpService.currentPage=1;
        }
        this.loadDataOne();
    }

    /**
    * 搜索默认第一页
    */
    loadDataOne(){
      this.httpService.currentPage=1;
      this.loadData();
      this.loadType();
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/appCurrencyRecord/findAll',
            data:this.find
        });

       
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
