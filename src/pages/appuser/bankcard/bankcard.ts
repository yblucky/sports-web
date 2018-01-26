import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

declare var $: any;
declare var layer: any;
var bankCardPage: any;

@Component({
    selector   : 'page-bankcrad',
    templateUrl: './bankcard.html',
    styleUrls: ['./bankcard.scss']
})
export class BankCardPage {
    find:any={
      uid:"",
      mobile:"",
      bankName:"",
      bankTypeId:""
    }
    bankType:any;
    showTime:any = new Date();
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        if(this.aroute.snapshot.queryParams["uid"]!=undefined){
          this.find.uid=this.aroute.snapshot.queryParams["uid"];
          this.httpService.currentPage=1;
        }
        bankCardPage=this;
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
        this.httpService.get({
            url:'/bankcard/allBankType',
            data:[]
        }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.bankType=Utils.copyObject(data.data);
            }
        });
        this.httpService.pagination({
            url:'/bankcard/bankCardInfo',
            data:this.find
        });
    }

}
