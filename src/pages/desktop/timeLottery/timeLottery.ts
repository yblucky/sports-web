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
    selector   : 'page-timeLottery',
    templateUrl: './timeLottery.html',
    styleUrls: ['./timeLottery.scss']
})
export class TimeLotteryPage {

    //定义data
    dataInfo:any;
    showTime:any = new Date();
    //定义号码
    haomas:any = [0,1,2,3,4,5,6,7,8,9];
    lotteryList:any = [];

    //定义开奖时间
    openTime: any;
    //定义当前期数
    currentIssuNo:any;
    //定义下期期数
    lotteryInfo:any;
    //定义定时器
    timer:any;

    //定义封盘时间的分
    fengpan_feng:number;
    fengpan_miao:number;

    //定义数组保存号码列表
    betting_list:any=[];
    betting_list_row:any=[];
    dingwei_row:any=["ge","shi","bai","qian","wan"]; //个  十  百  千  万
    dingwei_nums:any =[];
    numsArr:any = [];
    maxNumsPerWeizhi:any =3;
    betting_list_display:any=[];
    doubling_index:number;
    target_elm:any;
    sumMoney:number = 0;
    //定义输入倍数
    inputMultiplier:number = 1;
    inputMultiplier_back:number = 1;


    //赔率
    timeLotteryOdds_1:number;
    timeLotteryOdds_2:number;


    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        //this.orderStatistics();
        //this.init();
        this.loadData();
        this.loadTimeLatteryOdds();
        //this.initnumsArray();
    }

    //获取时时彩信息
    loadData(){
      this.httpService.get({
        url:'/time/timeInfo',
        data:{}
      }).subscribe((data:any)=>{
        if(data.code==='0000'){
            //修改成功
            this.dataInfo = data.data;
            this.init();
            console.log(this.dataInfo);
        }else if(data.code==='9999'){
            Utils.show(data.message);
        }else{
            Utils.show("网络异常");
        }
      });
    }

    //封盘时间倒计时
    init(){
        this.currentIssuNo = this.dataInfo.historyIssuNo;
        this.lotteryInfo = this.dataInfo.appTimeLotteryPo;
        this.openTime = this.dataInfo.bettingOpen;

        //计算开奖号码
        this.lotteryList = new Array();
        this.lotteryList.push(this.lotteryInfo.lotteryOne);
        this.lotteryList.push(this.lotteryInfo.lotteryTwo);
        this.lotteryList.push(this.lotteryInfo.lotteryThree);
        this.lotteryList.push(this.lotteryInfo.lotteryFour);
        this.lotteryList.push(this.lotteryInfo.lotteryFive);

        //计算封盘时间
        var diff = this.dataInfo.restTime;
        if(diff != 0){
            diff = diff / 1000;
            this.fengpan_feng = Math.floor(diff/ 60);
            this.fengpan_miao = Math.floor(diff % 60);
            this.timer = setInterval(() => {
                this.fengpan_miao = this.fengpan_miao - 1;
                //如果秒减完，就减分
                if(this.fengpan_miao == 0){
                    this.fengpan_feng = this.fengpan_feng - 1;
                    this.fengpan_miao = 60;
                    //如果分也减完，那就重新赋值
                    if(this.fengpan_feng == -1){
                       clearInterval(this.timer);
                       this.fengpan_feng = 0;
                       this.fengpan_miao = 0;
                       return;
                    }
                }
            }, 1000);
        }else{
            clearInterval(this.timer);
            //切换禁止投注背景色
            //$(".row-tab_2_2").css("background-image","url('/assets/img/bg.png')");
        }
    }


    //投注
    bettingSubmit(){
        var row={
            lotteryOne:"",
            lotteryTwo:"",
            lotteryThree:"",
            lotteryFour:"",
            lotteryFive:"",
            multiple:"",
        };

        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          payPwd:"123456",
          timeList:new Array()
        };

        for(var i=0;i<this.betting_list.length;i++){
          row.lotteryOne=this.betting_list[i][0];
          row.lotteryTwo=this.betting_list[i][1];
          row.lotteryThree=this.betting_list[i][2];
          row.lotteryFour=this.betting_list[i][3];
          row.lotteryFive=this.betting_list[i][4];
          row.multiple=this.betting_list[i][5];
          subData.timeList.push(row);
        }
        console.log("subData:"+subData)
        if(this.validator()){
            this.httpService.post({
                url:'/time/timebetting',
                data:subData
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("登录失败，请联系管理员");
                }
            });
        }
    }

    //验证表单数据
    validator(){
        if(Utils.isEmpty(this.betting_list)){
            Utils.show("请选择投注的号码");
            return false;
        }
        return true;
    }

    //封装初始化每个投注的数组
    initClickArray(){
      var clickArr=new Array();
      for(var i=0;i<7;i++){
        clickArr[i]=-1;
        if(i==6){
          clickArr[i]=0;
        }
      }
      return clickArr;
    }

    //封装初始化每个投注的数组
    initContentArray(){
      var clickArr=new Array();
      for(var i=0;i<5;i++){
        clickArr[i]="X";
      }
      return clickArr;
    }

    //封装初始化每个不同的个十百千万对应的位置上投注的数字集合
    initnumsArray(){
      var numsArr=new Array();
      for(var i=0;i<5;i++){
        numsArr=[];
        this.dingwei_nums.push(numsArr);
      }
      return this.dingwei_nums;
    }

    //点击号码生成投注列表
    // createTouzhu($event:any){
    //   //clickArr[0] 个位  clickArr[1] 十位 clickArr[2] 百位 clickArr[3] 千位 clickArr[4] 万位 clickArr[5] 投注倍数;
    //     var clickArr=this.initClickArray();
    //     var elm = $($event.target);
    //     //获取点击事件的各个参数
    //     var className = elm.attr("class");
    //     var num =  parseInt(elm.text());
    //
    //     //获取输入倍数框
    //     //改变加倍
    //     $("#inputMultiplier1").css("display","block");
    //     $("#inputMultiplier2").css("display","none");
    //
    //     //获取倍数
    //     this.inputMultiplier = $("#shuru").val();
    //
    //     //判断是否投错位置
    //     var n=this.dingwei_row.indexOf(className);
    //     if(n==-1){
    //       Utils.show("操作错误");
    //       return;
    //     }
    //
    //     //[-1,-1,-1,-1,-1,0]
    //     //判断是否有添加过
    //     if(this.betting_list.length==0){
    //       //直接增加投注
    //       // for(var j=0;j<this.dingwei_row.length;j++){
    //         clickArr[n]=num;
    //         clickArr[5]=this.inputMultiplier;
    //         this.betting_list.push(clickArr);
    //         this.dingwei_nums[n].push(num);
    //         //恢复默认数组
    //         clickArr=this.initClickArray();
    //         //显示就好
    //       // }
    //     }else{
    //       //for(var k=0;k<this.betting_list.length;k++){
    //         //for(var j=0;j<5;j++){
    //         var countPerNum=this.dingwei_nums[n].length;
    //         if(countPerNum>=this.maxNumsPerWeizhi){
    //            Utils.show("单个位只能最多投注"+this.maxNumsPerWeizhi+"个不同的数字");
    //            return;
    //         }
    //         if(this.dingwei_nums[n].indexOf(num)>-1){
    //           Utils.show("此位对应的数字已经添加过投注,请直接加倍");
    //           return;
    //         }
    //         //}
    //         //var n=this.dingwei_row.indexOf(className);
    //
    //       //}
    //       clickArr[n]=num;
    //       clickArr[5]=this.inputMultiplier;
    //       this.betting_list.push(clickArr);
    //       this.dingwei_nums[n].push(num);
    //     }
    //
    //     //投注颜色变红
    //     elm.css("background-image","url('/assets/img/haoma_red.png')");
    //     //计算金额
    //     this.calculateAmount();
    // }

    //投注时时彩
    betTimeLotteryOne($event:any,digit:number,betNum:number){
        //获取flag属性
        var flag = $($event.target).attr("flag");
        //获取投注数值
        var clickArr=this.initClickArray();
        var contentArr = this.initContentArray();

        if(flag == 1){
          $($event.target).css("background-color","#FFFF00");
          $($event.target).attr("flag","2");
        }else if(flag == 2){
          $($event.target).css("background-color","");
          $($event.target).attr("flag","1");
        }else if(flag == 3){
          $($event.target).parent().css("background-color","#FFFF00");
          $($event.target).attr("flag","4");
        }else if(flag == 4){
          $($event.target).parent().css("background-color","");
          $($event.target).attr("flag","3");
        }

        contentArr[digit] = betNum;
        //alert((contentArr.toString()).replace(/,/g,""));
        //放到服务上去
        clickArr[digit] = betNum;
        clickArr[5] = (contentArr.toString()).replace(/,/g,"");
        //clickArr
        this.betting_list.push(clickArr);

    }

    betTimeLotteryTwo($event:any){
        //获取flag属性
        var flag = $($event.target).attr("flag");

        if(flag == 1){
          $($event.target).css("background-color","#FFFF00");
          $($event.target).attr("flag","2");
        }else if(flag == 2){
          $($event.target).css("background-color","");
          $($event.target).attr("flag","1");
        }else if(flag == 3){
          $($event.target).parent().css("background-color","#FFFF00");
          $($event.target).attr("flag","4");
        }else if(flag == 4){
          $($event.target).parent().css("background-color","");
          $($event.target).attr("flag","3");
        }
    }

    //投注类别
    betCategory($event:any,betCategory_index:string){
        $($event.target).siblings("span").css("background-color","#A7D6CD");
        $($event.target).css("background-color","#148ee2");

        $(".content-tab_2").hide();
        $(".content-tab_3").hide();
        $(".content-tab_4").hide();

        $(".content-tab_"+betCategory_index).show();
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

    //获取赔率
    loadTimeLatteryOdds(){
        this.httpService.get({
            url:'/common/loadOdds',
            data:[]
        }).subscribe((data:any)=>{
            if(data.code === "0000"){
                //Utils.show("获取成功!");
                this.timeLotteryOdds_1 = data.data.timelotteryodds_1;
                this.timeLotteryOdds_2 = data.data.timelotteryodds_2;
            }else{
                Utils.show("获取赔率失败!");
            }
        });
    }

    //快打动画
    quickPlayOver($event:any){
        $($event.target).parent().css("background-color","#7EFF28");
    }

    quickPlayOut($event:any){
        $($event.target).parent().css("background-color","white");
    }



}
