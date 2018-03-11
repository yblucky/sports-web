import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


declare var $: any;
declare var layer: any;
declare var $interval: any;
declare var Highcharts: any;

@Component({
    selector   : 'page-reportForm',
    templateUrl: './reportForm.html',
    styleUrls: ['./reportForm.scss']
})
export class ReportFormPage {

    //定义data
    costs:number;
    income:number;
    penNumber:number = 0;

    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
        });
        //this.orderStatistics();
        //this.init();
        this.loadData();
        //this.initnumsArray();
    }

    //获取时时彩信息
    loadData(){
        this.loadReportInfo(11);
    }

    //投注类别
    betCategory($event:any,betCategory_index:number){
        $($event.target).siblings("span").css("background-color","#A7D6CD");
        $($event.target).css("background-color","#148ee2");

        $(".content-tab_2_13").hide();
        $(".content-tab_2_15").hide();

        $(".content-tab_2_"+betCategory_index).show();

        //获取报表
        this.loadReportInfo(betCategory_index);
    }

    //鼠标经过颜色
    categoryOver($event:any){
        $($event.target).css("color","red");
        $($event.target).css("text-decoration","underline");
    }

    categoryOut($event:any){
        var isClick = $($event.target).attr("isClick");
        if(isClick == 2){
            return;
        }
        $($event.target).css("color","black");
        $($event.target).css("text-decoration","none");
    }

    categoryClick($event:any,category_index:string){
        $(".category_type").css("color","black");
        $(".category_type").css("text-decoration","none");
        $(".category_type").attr("isClick","1");

        $($event.target).css("color","red");
        $($event.target).css("text-decoration","underline");

        //设置显示
        $(".tbody_category tr").hide();
        $(".category_"+category_index).show();

        //设置
        $($event.target).attr("isClick","2");
    }

    //快打动画
    quickPlayOver($event:any){
        $($event.target).parent().css("background-color","#7EFF28");
    }

    quickPlayOut($event:any){
        $($event.target).parent().css("background-color","white");
    }

    //查询报表
    queryReport($event:any,flag:number){
        $($event.target).siblings("span").css("color","white");
        $($event.target).css("color","red");

        //获取报表
        this.loadReportInfo(flag);
    }

    loadReportInfo(index:number){
        this.httpService.get({
          url:'/report/consume',
          data:{
              paramTime:index
          }
        }).subscribe((data:any)=>{
          if(data.code==='0000'){
              console.log(index);
              this.costs = data.data.costs;
              this.income = data.data.income;
              this.penNumber = data.data.costsCount;
          }else if(data.code==='9999'){
              Utils.show(data.message);
          }else{
              Utils.show("网络异常");
          }
        });
    }

}
