import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


declare var $: any;
declare var layer: any;
declare var $interval: any;
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


    //定义一个数组变量保存
    total_array:any=[];

    //定义数组
    nums:any;

    //定义号码
    haomas:any = [0,1,2,3,4,5,6,7,8,9];
    kaijianghaoma:any = [5,3,4,1,2];

    //定义开奖时间
    openTime: any = "2017-01-30 17:40:00";
    diff:any;
    shijian:any;

    //定义封盘时间的分
    fengpan_feng:any = 2;
    fengpan_miao:any = 30;

    //定义时时彩各个区的变量
    total_num:any={
        wan_num:"",
        qian_num:"",
        bai_num:"",
        shi_num:"",
        ge_num:"",
    };

    //定义列表数组
    bet_list:any = {
        //定义下注个数，一个数字一个注
        wan_num:[],
        qian_num:[],
        bai_num:[],
        shi_num:[],
        ge_num:[]
    }

    //下号个数和累积金额
    bet_zhushu:number = 0;
    bet_money:number = 0;
    zhushu:number = 0;
    money:number = 0;
    //总注数和总金额
    total_zhushu:number = 0;
    total_money:number = 0;

    //定义输入倍数
    inputMultiplier:number;
    inputMultiplier_back:number;

    //定义一个变量保存加倍对象和
    jiabei:string;
    jiabei_num:any;


    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        homePage=this;
        //this.orderStatistics();
        this.init();
    }

    //初始化开奖时间
    initOpenTime(){
      this.shijian = new Date(this.openTime);
      this.shijian = this.shijian.valueOf();
      this.diff = this.shijian - Date.now();
      this.diff = this.diff / 1000;
      this.diff = Math.floor(this.diff / 3600);
      console.log(this.diff);
      this.fengpan_feng = Math.floor((this.diff % 3600) / 60);
      this.fengpan_miao = (this.diff % 3600) % 60;
      // console.log(this.diff);
      // this.diff = shijian.valueOf() - Date.valueOf();
      // console.log(this.diff);
      // var timer = setInterval(() => {
      //     this.diff = this.openTime - Date.valueOf();
      //     console.log(this.openTime + "-" + Date.now() + "=" +this.diff);
      //     this.diff = Math.floor(this.diff / 1000);
      //     this.openHour = Math.floor(this.diff / 3600);
      //     this.openMinute = Math.floor((this.diff % 3600) / 60);
      // }, 1000);
    }

    //封盘时间倒计时
    init(){
      var timer = setInterval(() => {
          this.fengpan_miao = this.fengpan_miao - 1;
          //如果秒减完，就减分
          if(this.fengpan_miao === 0){
              this.fengpan_feng = this.fengpan_feng - 1;
              this.fengpan_miao = 60;

              //如果分也减完，那就重新赋值
              if(this.fengpan_feng === -1){
                this.fengpan_miao = 30;
                this.fengpan_feng = 2;
              }
          }
      }, 1000);
    }

    //点击号码生成投注列表
    createTouzhu($event:any){
        var elm = $($event.target);
        //获取点击事件的各个参数
        var flag = elm.attr("flag");
        var className = elm.attr("class");
        var num =  elm.text();

        //获取倍数
        this.inputMultiplier = $("#shuru").val();

        //如果是1，表示投注
        if(flag == 1){
            elm.css("background-image","url('/assets/img/haoma_red.png')");
            elm.attr("flag","2");
            if(className == "wan"){
                this.total_num.wan_num = this.total_num.wan_num + num + ",";
            }else if(className == "qian"){
                this.total_num.qian_num = this.total_num.qian_num + num + ",";
            }else if(className == "bai"){
                this.total_num.bai_num = this.total_num.bai_num + num + ",";
            }else if(className == "shi"){
                this.total_num.shi_num = this.total_num.shi_num + num + ",";
            }else if(className == "ge"){
                this.total_num.ge_num = this.total_num.ge_num + num + ",";
            }

            //注数
            this.bet_zhushu ++;

        }else if(flag == 2){
            elm.css("background-image","url('/assets/img/haoma_green.png')");
            elm.attr("flag","1");
            if(className == "wan"){
                this.total_num.wan_num = (this.total_num.wan_num).replace(num+",","");
            }else if(className == "qian"){
                this.total_num.qian_num = (this.total_num.qian_num).replace(num+",","");
            }else if(className == "bai"){
                this.total_num.bai_num = (this.total_num.bai_num).replace(num+",","");
            }else if(className == "shi"){
                this.total_num.shi_num = (this.total_num.shi_num).replace(num+",","");
            }else if(className == "ge"){
                this.total_num.ge_num = (this.total_num.ge_num).replace(num+",","");
            }

            //注数
            this.bet_zhushu --;

            //调用添加号码
            this.addHaomaList(1);
        }

        //计算累积金钱 = 下号个数 * 投入倍数
        this.bet_money = this.bet_zhushu * this.inputMultiplier;
    }

    //定义输入倍数(针对添加号码用的)
    shurubeishu(flag:number){

        //获取输入框中的参数
        this.inputMultiplier = $("#shuru").val();

        if(flag == 1){
            this.inputMultiplier --;
        }else if(flag == 2){
            this.inputMultiplier ++;
        }

        if(this.inputMultiplier <= 0){
            this.inputMultiplier = 1;
        }
        //赋值
        $("#shuru").val(this.inputMultiplier);

        //计算累积金钱 = 下号个数 * 投入倍数
        this.zhushu = this.bet_zhushu * this.inputMultiplier;
        this.money = this.bet_zhushu * this.inputMultiplier;

        this.addHaomaList(2);
    }

    //针对某一号码用的
    shurubeishu1(flag:number){

        //获取输入框中的参数
        this.inputMultiplier_back = $("#shuru1").val();

        if(flag == 1){
            this.inputMultiplier_back --;
        }else if(flag == 2){
            this.inputMultiplier_back ++;
        }

        if(this.inputMultiplier_back <= 0){
            this.inputMultiplier_back = 1;
        }
        //赋值
        $("#shuru1").val(this.inputMultiplier_back);

        this.addHaomaList(1);
    }

    //添加列表
    addHaomaList(flag:number){

        this.inputMultiplier = $("#shuru").val();
        this.inputMultiplier_back = $("#shuru1").val();

        //判断是否选中号码
        if(this.total_num.wan_num != "" || flag == 1 || this.jiabei == "wan_num"){
            this.bet_list.wan_num = [];
            var wan_nums = (this.total_num.wan_num).split(",");
            for(var i=0;i<(wan_nums.length) - 1;i++){
                if(this.jiabei_num == i){
                    //点击加倍的
                    this.bet_list.wan_num.push([wan_nums[i],"-","-","-","-",this.inputMultiplier_back,this.inputMultiplier_back]);
                }else{
                    this.bet_list.wan_num.push([wan_nums[i],"-","-","-","-",this.inputMultiplier,this.inputMultiplier]);
                }
            }
        }
        if(this.total_num.qian_num != "" || flag == 1){
            this.bet_list.qian_num = [];
            var qian_nums = (this.total_num.qian_num).split(",");
            for(var i=0;i<(qian_nums.length) - 1;i++){
                this.bet_list.qian_num.push(["-",qian_nums[i],"-","-","-",this.inputMultiplier,this.inputMultiplier]);
            }
        }
        if(this.total_num.bai_num != "" || flag == 1){
            this.nums = (this.total_num.bai_num).split(",");
            for(var i=0;i<(this.nums.length) - 1;i++){
                this.bet_list.bai_num.push(["-","-",this.nums[i],"-","-",this.inputMultiplier,this.inputMultiplier]);
            }
        }
        if(this.total_num.shi_num != "" || flag == 1){
            this.nums = (this.total_num.shi_num).split(",");
            for(var i=0;i<(this.nums.length) - 1;i++){
                this.bet_list.shi_num.push(["-","-","-",this.nums[i],"-",this.inputMultiplier,this.inputMultiplier]);
            }
        }

        if(this.total_num.ge_num != "" || flag == 1){
            this.nums = (this.total_num.ge_num).split(",");
            for(var i=0;i<(this.nums.length) - 1;i++){
              this.bet_list.ge_num.push(["-","-","-","-",this.nums[i],this.inputMultiplier,this.inputMultiplier]);
            }
        }

        //计算总注数 和总金额
        this.total_zhushu = this.bet_zhushu * this.inputMultiplier;
        this.total_money = this.bet_zhushu * this.inputMultiplier;
        this.zhushu = this.bet_zhushu * this.inputMultiplier;
        this.money = this.bet_zhushu * this.inputMultiplier;
    }

    //删除号码
    delHaoma($event:any,num:number,beishu:number){
        var elm = $($event.target);
        //为点击事件设置背景
        var flag = elm.attr("flag");
        console.log(beishu);
        // console.log(elm.parent().next().text());
        if("wan_num" == flag){
            $("#wan_"+num).css("background-image","url('/assets/img/haoma_green.png')");
            $("#wan_"+num).attr("flag","1");
            //$(".wan").get(num).css("background-image","url('/assets/img/haoma_green.png')");
            //$(".wan").get(num).attr("flag","1");
            this.total_num.wan_num = (this.total_num.wan_num).replace(num+",","");
            this.bet_zhushu --;
            this.addHaomaList(1);
        }
    }

    //点击加倍数（接着昨天做）
    jiabeishu($event:any,flag:string,num:string,num1:string){
        //改变加倍
        $("#inputMultiplier1").css("display","none");
        $("#inputMultiplier2").css("display","block");
        //获取点击事件
        var elm = $($event.target);
        elm.parent().siblings("tr").css("background-color","");
        elm.parent().css("background-color","#95928E");
        this.jiabei = flag;
        var str = num+"_"+num1;
        this.jiabei_num.push(str);
        $("#shuru1").val(num1);
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
