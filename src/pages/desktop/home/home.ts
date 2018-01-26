import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


declare var $: any;
declare var layer: any;
declare var Highcharts: any;
var homePage: any;

@Component({
    selector   : 'page-home',
    templateUrl: './home.html',
    styleUrls: ['./home.scss']
})
export class HomePage {
    orderStatisticsCount:any={
      todayOrder:"",
      PayCount:"",
      WithdrawCount:"",
      STBRollOut:"",
      STBExchange:""
    };
    userCount:any={
      userStatistics:{
        balance:"",
        score:"",
        virtualCoin:"",
        userCount:""
      },
      UserWithdrawCount:"",
      toDayuserCount:""
    };
    coinManage:any;//币种数量
    orderType:string="10";
    showTime:any = new Date();
    highChartOptions:any={};
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        homePage=this;
        this.orderStatistics();
    }

    orderStatistics(){
      this.httpService.get({
            url:'/homePage/orderStatistics',
            data:[]
      }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.orderStatisticsCount=Utils.copyObject(data.data);
            }
      });
      this.httpService.get({
            url:'/homePage/operationStatistics',
            data:[]
      }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.userCount=Utils.copyObject(data.data);
            }
      });
      this.reportAjax('10');


      this.httpService.get({
            url:'/homePage/coinManage',
            data:[]
      }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.coinManage=Utils.copyObject(data.data);
            }
      });
      //获取当日币种交易总数





    }

    reportAjax(orderType:string){
      this.httpService.get({
            url:'/homePage/reportStatistics',
            data:{
              orderType:orderType
            }
      }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.highChartOptions.series=data.data;
                this.report(orderType);
            }
      });
    }

    report(orderType:string){
      var type:string="";
      if(orderType=="10"){
          type="充值/提现";
      }else if(orderType=="20"){
          type="转账/收款";
      }
      this.highChartOptions.chart={};
      this.highChartOptions.chart.type="column";
      this.highChartOptions.title={};
      this.highChartOptions.title.text="最近6个月"+type+"金额";
      this.highChartOptions.xAxis={};
      this.highChartOptions.xAxis.type="category";
      this.highChartOptions.yAxis={};
      this.highChartOptions.yAxis.title={};
      this.highChartOptions.yAxis.title.text=type+"成功金额";
      this.highChartOptions.legend={};
      this.highChartOptions.legend.enabled=false;
      this.highChartOptions.credits={};
      this.highChartOptions.credits.enabled=false;
      this.highChartOptions.plotOptions={};
      this.highChartOptions.plotOptions.series={};
      this.highChartOptions.plotOptions.series.borderWidth=0;
      this.highChartOptions.plotOptions.series.dataLabels={};
      this.highChartOptions.plotOptions.series.dataLabels.enabled=false;
      this.highChartOptions.plotOptions.series.dataLabels.format="{point.y:.1f}";
      this.highChartOptions.tooltip={};
      this.highChartOptions.tooltip.headerFormat="";
      this.highChartOptions.tooltip.pointFormat="<span style='color:{point.color}'>{point.name}月</span>:<b>{point.y:.2f}</b>"+type+"金额<br/>";
      Highcharts.chart("container",homePage.highChartOptions);
    }

    href(type:string){
      var strDate:string=this.utils.formatDate(this.showTime,'yyyy-MM-dd');
      if("1"==type){
          this.router.navigate(['/common/main/transaction/transfer'],{relativeTo: this.aroute,queryParams: { startTime: strDate,endTime:strDate }});
      }
      if("2"==type){
          this.router.navigate(['/common/main/transaction/rechargeOrder'],{relativeTo: this.aroute,queryParams: { state:10 }});
      }
      if("3"==type){
          this.router.navigate(['/common/main/transaction/withdrawOrder'],{relativeTo: this.aroute,queryParams: { state:10 }});
      }
      if("4"==type){
          this.router.navigate(['/common/main/transaction/stbForward'],{relativeTo: this.aroute,queryParams: { startTime: strDate,endTime:strDate }});
      }
      if("5"==type){
          this.router.navigate(['/common/main/transaction/coinCurrencyRecord']);
      }
    }



}
