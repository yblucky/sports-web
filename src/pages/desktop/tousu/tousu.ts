import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';

declare var $: any;
declare var layer: any;

@Component({
    selector   : 'page-tousu',
    templateUrl: './tousu.html',
    styleUrls: ['./tousu.scss']
})
export class TousuPage {
    find:any={
      uid:"",
      mobile:"",
      nickName:"",
      userName:"",
      content:"",
      startTime:"",
      endTime:""
    };
    showTime:any = new Date();
    path:string;
    imgPath:string;
    context:string;
    showType:number;
    haomas:any = [1,2,3,4,5,6,7,8,9,10];
    kaijianghaomas:any = [1,4,3,2,7,6,5,9,10,8];
    constructor(private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        //this.path = Utils.FILE_SERVE_URL;
        //this.httpService.currentPage=1;
        //this.loadData();
    }

    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/complainSuggest/findAll',
            data:this.find
        });
    }

    showPath(img:any,type:number){
        var title:string;
        var id:string;
        this.showType=type;
        if(type==1){
          this.imgPath=img.imgPath;
        }else{
          this.context=img.content;
        }
        layer.open({
            title: "用户反馈",
            type: 1,
            closeBtn: 1,
            shade: 0,
            fixed: true,
            shadeClose: true,
            resize: false,
            area: ['800px','700px'],
            content: $("#editPanel")
        });
    }
}
