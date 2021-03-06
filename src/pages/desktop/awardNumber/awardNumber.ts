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
      busnessType:21,
      startTime:"",
      endTime:""
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
    }

    /**
    * 加载数据
    */
    loadData(){
      var awardUrl;
      if(this.find.busnessType == 21){
          awardUrl = "/time/awardNumberList";
      }else if(this.find.busnessType == 31){
          awardUrl = "/racing/awardNumberList";
      }

      this.httpService.pagination({
          url:awardUrl,
          data:this.find
      });

    }

}
