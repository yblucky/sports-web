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

      gameType:"10".trim(),
      uid:"".trim(),
      mobile:"".trim(),
      startTime:"".trim(),
      issueNo:"".trim(),
      lotteryFlag:"".trim(),
      endTime:"".trim(),

    };
    currencyTypes:any;
    showTime:any = new Date();
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        stbExchangePage=this;
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
        if(this.find.gameType =="10"){
          this.httpService.pagination({
              url:'/record/racingBettingRecord',
              data:this.find
          });
        }else {
          this.httpService.pagination({
              url:'/record/timeBettingRecord',
              data:this.find
          });
        }

    }


}
