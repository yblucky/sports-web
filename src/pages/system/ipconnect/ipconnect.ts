import { Component } from "@angular/core";

import {HttpService} from "../../../providers/HttpService";
import {Utils} from "../../../providers/Utils";

declare var $: any;
declare var layer: any;
var nowPage: any;

@Component({
    selector   : 'page-ipconnect',
    templateUrl: './ipconnect.html',
    styleUrls: ['./ipconnect.scss']
})
export class IpconnectPage {
    

     find:any={
      connectCount:500,
    
    };
  
    constructor(private httpService:HttpService,private utils:Utils) {
        this.httpService.items = null;
        this.httpService.currentPage = 1;
        nowPage = this;
        this.loadData();
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/ipConnect/findAll',
            data:this.find
        });
    }

}
