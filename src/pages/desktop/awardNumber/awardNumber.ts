import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;
declare var layer: any;
var awardNumberPage: any;

@Component({
    selector   : 'page-awardNumber',
    templateUrl: './awardNumber.html',
    styleUrls: ['./awardNumber.scss']
})
export class AwardNumberPage {
    find:any={
      busnessType:[21,22]
    };

    orderData:any;
    businessTypeDesc:string;
    bettingContent:string = "";
    showTime:any = new Date();
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        awardNumberPage=this;
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
          url:'/record/list',
          data:this.find
      });

    }


      /**
      * 弹出等级面板
      */
      openDetail(item:any){
          if(item.busnessType==31 || item.busnessType == 32){
            this.httpService.get({
                url:'/record/racingBettingRecord',
                data:{businessNumber:item.businessNumber}
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                  this.orderData = data.data;
                  this.businessTypeDesc = '北京赛车';
                  this.bettingContent = "";
                  for(var i = 0;i<data.data.length;i++){
                    this.bettingContent = "";
                    this.bettingContent += this.orderData[i].lotteryOne + ",";
                    this.bettingContent += this.orderData[i].lotteryTwo + ",";
                    this.bettingContent += this.orderData[i].lotteryThree + ",";
                    this.bettingContent += this.orderData[i].lotteryFour + ",";
                    this.bettingContent += this.orderData[i].lotteryFive + ",";
                    this.bettingContent += this.orderData[i].lotterySix + ",";
                    this.bettingContent += this.orderData[i].lotterySeven + ",";
                    this.bettingContent += this.orderData[i].lotteryEight + ",";
                    this.bettingContent += this.orderData[i].lotteryNine + ",";
                    this.bettingContent += this.orderData[i].lotteryTen;
                    this.bettingContent = this.bettingContent.replace(/-1/g,"-");
                    this.orderData[i].bettingContent=this.bettingContent;
                  }


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
                  this.businessTypeDesc = '时时彩';
                  //this.bettingContent = "";
                  for(var i = 0;i<data.data.length;i++){
                      this.bettingContent = "";
                      this.bettingContent += this.orderData[i].lotteryOne + ",";
                      this.bettingContent += this.orderData[i].lotteryTwo + ",";
                      this.bettingContent += this.orderData[i].lotteryThree + ",";
                      this.bettingContent += this.orderData[i].lotteryFour + ",";
                      this.bettingContent += this.orderData[i].lotteryFive;
                      this.bettingContent = this.bettingContent.replace(/-1/g,"-");
                      this.orderData[i].bettingContent=this.bettingContent;
                  }
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
              area: ['880px','400px'],
              content: $("#editPanel"),
              yes: function(index:number){
                     layer.closeAll();
              }
          });

      }

}
