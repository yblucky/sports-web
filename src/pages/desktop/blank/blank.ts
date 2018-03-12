import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MainPage } from '../../common/main/main';


declare var $: any;
declare var layer: any;
var blankPage: any;
var mainPage :any;

@Component({
    selector   : 'page-blank',
    templateUrl: './blank.html',
    styleUrls: ['./blank.scss']
})
export class BlankPage {

    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils,private mPage:MainPage) {
        this.aroute.params.subscribe( params  => {
        });
        blankPage=this;
        mainPage = mPage;
        this.loadData();
    }

    /**
    * 搜索默认第一页
    */
    loadData(){
        mainPage.showStyle("","/desktop/timeLottery",".leftPanel_2");
    }

}
