import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MainPage } from '../../common/main/main';


declare var $: any;
declare var layer: any;
declare var $interval: any;
declare var Highcharts: any;
var timeLotteryPage:any;
var mainPage :any;

@Component({
    selector   : 'page-timeLottery',
    templateUrl: './timeLottery.html',
    styleUrls: ['./timeLottery.scss']
})
export class TimeLotteryPage {

    //定义data
    dataInfo:any;
    //定义一个变量保存时时彩规则
    dataRuleInfo:any;
    //定义时时彩规则变量
    //一字定
    maxBetSeats:string = "3";
    maxBetDigitalNoPerSeat:string="10";
    maxBetNoPerDigital:string = "500";
    //二字定
    timeDoubleMaxBetSeats:string = "3";
    timeDoubleMaxBetKindPerTwoSeats:string = "10";
    timeDoubleMaxBetNoPerKind:string = "500";


    showTime:any = new Date();
    //定义号码
    haomas:any = [0,1,2,3,4,5,6,7,8,9];
    lotteryList:any = ['?','?','?','?','?'];

    //定义开奖时间
    openTime: any="2018-01-01 00:00:00";
    //定义当前期数
    currentIssuNo:string="2018XXXXXXX";
    //定义上期期数
    preIssuNo:string="2018XXXXXXX";
    //定义上期期数号码
    lotteryInfo:any;
    //定义上期期数号码
    preLotteryInfo:any;
    //定义时时彩公告
    timeNotice:string;

    //定义定时器
    timer:any;
    //定义数据定时器
    timerData:any;
    countDown = 30;
    //定义获取开奖号码定时器
    timerAwardNumber:any;

    //定义封盘时间的分
    fengpan_feng:number=0;
    fengpan_miao:number=0;

    //定义数组保存号码列表
    bettingOneRule_list:any=[];

    bettingTwoRule_num:number=0;
    bettingTwoRule_list:any=[];
    bettingTwoType_num:any=[];

    bettingOne_list:any=[];
    bettingTwo_list:any=[];
    bettingPrompt_list:any=[];
    //定义一个保存投注集合的变量
    //bettingPrompt_num
    sumMoney:number = 0;
    sumNumber:number = 0;
    //支付密码
    payPwd:string="";
    //投注倍数
    bet_num:number = 1;

    //赔率
    timeLotteryOdds_1:number;
    timeLotteryOdds_2:number;

    //快选变量
    judgeList:any = [];
    keyCodeList:any = [];
    quickNumberList:any;
    quickCountList:any = [0,1,2,3,4,5,6,7,8];
    kindType:number = 1;
    //oldCodeList:any = [];


    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils,private mPage:MainPage) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        timeLotteryPage = this;
        mainPage = mPage;
        //this.orderStatistics();
        //this.init();
        this.loadData();
        this.loadTimeLotteryRule();
        this.loadNotice();
        //this.loadTimeLotteryOdds();
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
            clearInterval(this.timer);
            clearInterval(this.timerData);
            if(this.dataInfo.restTime != 0){
                $(".bet_vague").hide();
                this.countDown=0;
            }else if(this.dataInfo.restTime == 0 || !Utils.isNumber(this.dataInfo.restTime)){
                $(".bet_vague").show();
                this.initLoadData();
                // clearInterval(this.timer);
            }
            this.init();
        }else if(data.code==='9999'){
            Utils.show(data.message);
            if(data.message == "非投注时间"){
                $(".bet_vague").show();
                $(".prompt").text("非投注时间");
            }
        }else{
            Utils.show("网络异常");
            $(".bet_vague").show();
            $(".prompt").text("网络异常");
        }
      });
    }

    loadTimeLotteryRule(){
        this.httpService.get({
          url:'/common/regex',
          data:{}
        }).subscribe((data:any)=>{
          if(data.code==='0000'){
              //修改成功
              this.dataRuleInfo = data.data;
              //时时彩赔率
              this.timeLotteryOdds_1 = this.dataRuleInfo.odds;
              this.timeLotteryOdds_2 = this.dataRuleInfo.timeDoubleOdds;
              //一字定
              this.maxBetSeats = this.dataRuleInfo.maxBetSeats;
              this.maxBetDigitalNoPerSeat =this.dataRuleInfo.maxBetDigitalNoPerSeat;
              this.maxBetNoPerDigital = this.dataRuleInfo.maxBetNoPerDigital;
              //二字定
              this.timeDoubleMaxBetSeats = this.dataRuleInfo.timeDoubleMaxBetSeats;
              this.timeDoubleMaxBetKindPerTwoSeats = this.dataRuleInfo.timeDoubleMaxBetKindPerTwoSeats;
              this.timeDoubleMaxBetNoPerKind = this.dataRuleInfo.timeDoubleMaxBetNoPerKind;
          }else if(data.code==='9999'){
              Utils.show(data.message);
          }else{
              Utils.show("网络异常");
          }
        });
    }

    loadNotice(){
        this.httpService.get({
          url:'/common/loadNotice',
          data:{}
        }).subscribe((data:any)=>{
          if(data.code==='0000'){
              //修改成功
              this.timeNotice = data.data;
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
        this.preIssuNo = this.dataInfo.appTimeLotteryPo.issueNo;
        this.lotteryInfo = this.dataInfo.appTimeLotteryPo;
        this.openTime = this.dataInfo.bettingOpen;

        //计算开奖号码
        this.lotteryList = new Array();
        this.lotteryList.push(this.lotteryInfo.lotteryOne);
        this.lotteryList.push(this.lotteryInfo.lotteryTwo);
        this.lotteryList.push(this.lotteryInfo.lotteryThree);
        this.lotteryList.push(this.lotteryInfo.lotteryFour);
        this.lotteryList.push(this.lotteryInfo.lotteryFive);
        //this.loadAwardNumber();

        //计算封盘时间
        var diff = this.dataInfo.restTime;
        //var diff = 1646;
        if(diff != 0){
            diff = diff / 1000;
            this.fengpan_feng = Math.floor(diff/ 60);
            this.fengpan_miao = Math.floor(diff % 60);
            this.timer = setInterval(() => {
                this.fengpan_miao = this.fengpan_miao - 1;
                //这个是后面加的，如果定时器有问题，立马删掉
                clearInterval(this.timerData);
                //如果秒减完，就减分
                if(this.fengpan_miao <= 0){
                    this.fengpan_feng = this.fengpan_feng - 1;
                    this.fengpan_miao = 60;
                    //如果分也减完，那就重新赋值
                    if(this.fengpan_feng == -1){
                       clearInterval(this.timer);
                       this.fengpan_feng = 0;
                       this.fengpan_miao = 0;
                       $(".bet_vague").show();
                       $(".prompt").text("已封盘,禁止投注");
                       //$(".row-tab_2_2").css("background-image","url('/assets/img/banBetting.png')");
                       //this.loadData();
                       this.initLoadData();
                       return;
                    }
                }
            }, 1000);
        }else{
            clearInterval(this.timer);
            //clearInterval(this.timerData);
            //切换禁止投注背景色
            //$(".row-tab_2_2").css("background-image","url('/assets/img/banBetting.png')");
        }
    }

    initLoadData(){
        this.timerData = setInterval(() => {
            this.countDown--;
            //如果秒减完，就减分
            if(this.countDown <= 0){
                clearInterval(this.timer);
                clearInterval(this.timerData);
            }
            //每隔5秒调用一次
            this.loadData();
        }, 20000);
    }

    loadAwardNumberTimer(){
        this.timerAwardNumber = setInterval(() => {
            //每隔10秒调用一次获取号码
            this.loadAwardNumber();
        }, 10000);
    }

    //获取时时彩信息
    loadAwardNumber(){
        // if(Utils.isEmpty(this.preIssuNo) && this.preIssuNo == "系统维护"){
        //     return false;
        // }
        this.httpService.get({
          url:'/time/loadAwardNumber',
          data:{
              issueNo:this.preIssuNo
          }
        }).subscribe((data:any)=>{
          if(data.code==='0000'){
              this.preLotteryInfo = data.data;
              //修改成功
              if(Utils.isNotEmpty(this.preLotteryInfo)){
                  this.preIssuNo = this.preLotteryInfo.issueNo;
                  this.lotteryList = new Array();
                  this.lotteryList.push(this.preLotteryInfo.lotteryOne);
                  this.lotteryList.push(this.preLotteryInfo.lotteryTwo);
                  this.lotteryList.push(this.preLotteryInfo.lotteryThree);
                  this.lotteryList.push(this.preLotteryInfo.lotteryFour);
                  this.lotteryList.push(this.preLotteryInfo.lotteryFive);
              }
          }else if(data.code==='9999'){

          }else{
              Utils.show("网络异常");
          }
        });
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

    // betOneChange(){
    //     //获取投注数组的长度
    //     var length = this.bettingOne_list.length;
    //     var beishu = $("#betOne").val();
    //
    // }

    //投注
    bettingOneSubmit(){
        //this.validatorTimeBettingRule(1);
        //获取倍数
        this.sumNumber = this.bettingOne_list.length;
        this.bet_num = $("#betOne").val();
        this.payPwd = $("#payPwdOne").val();

        if(this.validatorBetOne()){
            //计算总金额
            this.sumMoney = this.sumNumber * this.bet_num;

            var subData={
              issueNo:this.dataInfo.historyIssuNo,
              serialNumber:this.dataInfo.currentIssueNo,
              payPwd:this.payPwd,
              betType:10,
              timeList:new Array()
            };
            var promptRow = new Array();
            this.bettingPrompt_list = [];
            var str;
            var str1 = this.bettingOne_list.length - 1;
            for(var i=0;i<this.bettingOne_list.length;i++){
                var row={
                    lotteryOne:"",
                    lotteryTwo:"",
                    lotteryThree:"",
                    lotteryFour:"",
                    lotteryFive:"",
                    multiple:0,
                    bettingContent:""
                };
                row.lotteryOne=this.bettingOne_list[i][0];
                row.lotteryTwo=this.bettingOne_list[i][1];
                row.lotteryThree=this.bettingOne_list[i][2];
                row.lotteryFour=this.bettingOne_list[i][3];
                row.lotteryFive=this.bettingOne_list[i][4];
                //console.log(this.bettingOne_list[i][5]);
                row.bettingContent=this.bettingOne_list[i][5];
                row.multiple=this.bet_num;
                //console.log(row);
                subData.timeList.push(row);
                //添加数据
                promptRow.push(row.bettingContent);
                str = i + "";
                //str1 = str1 + "";
                if(str.indexOf("9") != -1){
                    //alert("str="+str);
                    this.bettingPrompt_list.push(promptRow);
                    promptRow = new Array();
                }

                if(i == str1){
                    //alert("str1="+str1);
                    this.bettingPrompt_list.push(promptRow);
                    promptRow = new Array();
                }
            }
            //console.log(this.bettingPrompt_list);
            //this.bettingPrompt_list = this.bettingOne_list;

            this.openBettingPrompt(1,subData);
        }
        //console.log("subData:"+subData)

    }

    //验证表单数据
    validatorBetOne(){

        if(Utils.isEmpty(this.bettingOne_list) || this.bettingOne_list.length == 0){
            Utils.show("请选择投注的号码");
            return false;
        }
        if(Utils.isEmpty(this.bet_num) || this.bet_num == 0){
            layer.tips('投注金额不合法', '#betOne',{tips: 1});
            $("#betOne").focus();
            return false;
        }

        //校验小数点
        var bet_num_back = this.bet_num + "";
        if(bet_num_back.indexOf(".") >= 0){
            layer.tips('投注金额不合法', '#betOne',{tips: 1});
            $("#betOne").focus();
            return false;
        }

        if(this.bet_num < this.dataRuleInfo.minBetNoPerDigital || this.bet_num > this.dataRuleInfo.maxBetNoPerDigital){
            Utils.show("单注投注范围【"+this.dataRuleInfo.minBetNoPerDigital+"-"+this.dataRuleInfo.maxBetNoPerDigital+"】");
            $("#betOne").focus();
            return false;
        }

        // if(Utils.isEmpty(this.payPwd)){
        //     layer.tips('支付密码不能为空', '#payPwdOne',{tips: 1});
        //     $("#payPwdOne").focus();
        //     return false;
        // }
        return true;
    }

    //投注时时彩
    betTimeLotteryOne($event:any,digit:number,betNum:number){

        if (this.bettingOneRule_list.length==0) {
          for (var i = 0; i < 5; i++) {
               this.bettingOneRule_list[i]=new Array();
          }
        }

        var ruleRow=new Array();
        //获取flag属性
        var flag = $($event.target).attr("flag");
        //获取投注数值
        var clickArr=this.initClickArray();
        var contentArr = this.initContentArray();
        contentArr[digit] = betNum;
        var contentStr = (contentArr.toString()).replace(/,/g,"");
        //定义一个变量保存数组
        var rows;
        //ruleRow.push(contentStr);
        if(flag == 1){
          //点击验证一字定规则
          this.bettingOneRule_list[digit].push(contentStr);
          console.log(  this.bettingOneRule_list);
          if(!this.validatorTimeBettingRule(1,digit)){
              this.bettingOneRule_list[digit].pop();
              return false;
          }
          $($event.target).css("background-color","#FFFF00");
          $($event.target).attr("flag","2");
          //添加进数组中

          //alert((contentArr.toString()).replace(/,/g,""));
          //放到服务上去
          clickArr[digit] = betNum;
          clickArr[5] = contentStr;
          //clickArr
          this.bettingOne_list.push(clickArr);
        }else if(flag == 2){
          $($event.target).css("background-color","");
          $($event.target).attr("flag","1");

          for(var i=0;i<this.bettingOne_list.length;i++){
              rows = this.bettingOne_list[i];
              //判断是否该值
              if(contentStr == rows[5]){
                  //console.log("删除前"+this.bettingOne_list);
                  this.bettingOne_list.splice(i,1);
                  //console.log("删除后"+this.bettingOne_list);
              }
          }
          var removeIndex=this.bettingOneRule_list[digit].indexOf(contentStr);
          this.bettingOneRule_list[digit].splice(removeIndex,1);
        }
    }

    validatorTimeBettingRule(gameType:number,index:number){
       if (gameType==1) {
         var count=0;
          for(var i=0;i< this.bettingOneRule_list.length;i++){
            if (this.bettingOneRule_list[i].length>0) {
                // if(count < this.dataRuleInfo.maxBetSeats){
                    count++;
                // }
            }
            if(count>this.dataRuleInfo.maxBetSeats){
                Utils.show("最多选取"+this.dataRuleInfo.maxBetSeats+"个位置");
                return false;
            }
            if(this.bettingOneRule_list[index].length>this.dataRuleInfo.maxBetDigitalNoPerSeat){
                Utils.show("单个位,最多选取"+this.dataRuleInfo.maxBetDigitalNoPerSeat+"个不同的号码");
                return false;
            }
          }

          //var betNum = $("#betOne").val();

       }
       return true;
    }

    betTimeLotteryTwo($event:any,digit1:number,digit2:number,betNum1:number,betNum2:number){

        if (this.bettingTwoRule_list.length==0) {
          for (var i = 0; i < 10; i++) {
               this.bettingTwoRule_list[i]=new Array();
          }
        }
        //获取flag属性
        var flag = $($event.target).attr("flag");

        //获取投注数值
        var clickArr=this.initClickArray();
        var contentArr = this.initContentArray();
        contentArr[digit1] = betNum1;
        contentArr[digit2] = betNum2;
        var contentStr = (contentArr.toString()).replace(/,/g,"");
        //定义投注变量
        var rows;
        var clickNum;
        var ruleNum = this.bettingTwoRule_num;
        if(flag == 1){
          //验证二字定时时彩
          var clickNum = this.bettingTwoRule_list[ruleNum];
          clickNum ++;
          this.bettingTwoRule_list[ruleNum] = clickNum;
          if(this.bettingTwoType_num == null){
              this.bettingTwoType_num.push(ruleNum);
          }
          if(this.bettingTwoType_num.indexOf(ruleNum) < 0){
              this.bettingTwoType_num.push(ruleNum);
          }
          //console.log("组合"+this.bettingTwoType_num);
          //console.log("组合1:"+clickNum);
          if(!this.validatorTimeTwoBettingRule(ruleNum)){
              return false;
          }

          //$($event.target).css("background-color","#FFFF00");
          $($event.target).css("background-color","#FFFF00");
          $($event.target).attr("flag","2");

          //添加投注号码
          clickArr[digit1] = betNum1;
          clickArr[digit2] = betNum2;
          clickArr[5] = contentStr;
          //clickArr
          this.bettingTwo_list.push(clickArr);

        }else if(flag == 2){
          var clickNum = this.bettingTwoRule_list[ruleNum];
          clickNum --;
          this.bettingTwoRule_list[ruleNum] = clickNum;
          if(clickNum == 0){
            var ruleIndex = this.bettingTwoType_num.indexOf(ruleNum);
            this.bettingTwoType_num.splice(ruleIndex,1);
            //console.log("组合"+this.bettingTwoType_num);
          }
          //console.log("组合2:"+clickNum);
          if(!this.validatorTimeTwoBettingRule(ruleNum)){
              return false;
          }

          $($event.target).css("background-color","");
          $($event.target).attr("flag","1");

          //删除投注号码
          for(var i=0;i<this.bettingTwo_list.length;i++){
              rows = this.bettingTwo_list[i];
              //判断是否该值
              if(contentStr == rows[5]){
                  //console.log("删除前"+this.bettingTwo_list);
                  this.bettingTwo_list.splice(i,1);
                  //console.log("删除后"+this.bettingTwo_list);
              }
          }
        }
    }

    //验证二字定时时彩规则
    validatorTimeTwoBettingRule(twoBettingIndex:number){

        if(this.bettingTwoType_num.indexOf(twoBettingIndex) < 0 && this.bettingTwoType_num.length >= this.dataRuleInfo.timeDoubleMaxBetSeats){
            Utils.show("二字定最多选"+this.dataRuleInfo.timeDoubleMaxBetSeats+"种组合");
            return false;
        }

        //console.log("每种类型组合为："+this.bettingTwoRule_list[twoBettingIndex]);
        if(this.bettingTwoRule_list[twoBettingIndex] > this.dataRuleInfo.timeDoubleMaxBetKindPerTwoSeats){
            Utils.show("二字定选定两个位后,最多选"+this.dataRuleInfo.timeDoubleMaxBetKindPerTwoSeats+"个不同的号码");
            this.bettingTwoRule_list[twoBettingIndex] = this.bettingTwoRule_list[twoBettingIndex] - 1;
            return false;
        }

        //var betNum = $("#betTwo").val();
        return true;
   }

    //二字定投注
    bettingTwoSubmit(){
        //获取倍数
        this.sumNumber = this.bettingTwo_list.length;
        this.bet_num = $("#betTwo").val();
        this.payPwd = $("#payPwdTwo").val();

        if(this.validatorBetTwo()){
            //计算总金额
            this.sumMoney = this.sumNumber * this.bet_num;

            var subData={
              issueNo:this.dataInfo.historyIssuNo,
              serialNumber:this.dataInfo.currentIssueNo,
              payPwd:this.payPwd,
              betType:20,
              timeList:new Array()
            };

            var promptRow = new Array();
            this.bettingPrompt_list = [];
            var str;
            var str1 = this.bettingTwo_list.length - 1;
            for(var i=0;i<this.bettingTwo_list.length;i++){
                var row={
                    lotteryOne:"",
                    lotteryTwo:"",
                    lotteryThree:"",
                    lotteryFour:"",
                    lotteryFive:"",
                    multiple:0,
                    bettingContent:""
                };
                row.lotteryOne=this.bettingTwo_list[i][0];
                row.lotteryTwo=this.bettingTwo_list[i][1];
                row.lotteryThree=this.bettingTwo_list[i][2];
                row.lotteryFour=this.bettingTwo_list[i][3];
                row.lotteryFive=this.bettingTwo_list[i][4];
                row.bettingContent=this.bettingTwo_list[i][5];
                row.multiple=this.bet_num;
                subData.timeList.push(row);

                //添加数据
                promptRow.push(row.bettingContent);
                str = i + "";
                //str1 = str1 + "";
                if(str.indexOf("9") != -1){
                    //alert("str="+str);
                    this.bettingPrompt_list.push(promptRow);
                    promptRow = new Array();
                }

                if(i == str1){
                    //alert("str1="+str1);
                    this.bettingPrompt_list.push(promptRow);
                    promptRow = new Array();
                }
            }
            //console.log("subData:"+subData)
            this.openBettingPrompt(2,subData);
        }
    }

    //验证表单数据
    validatorBetTwo(){
        if(Utils.isEmpty(this.bettingTwo_list) || this.sumNumber == 0){
            Utils.show("请选择投注的号码");
            return false;
        }
        if(Utils.isEmpty(this.bet_num) || this.bet_num == 0){
            layer.tips('投注金额不合法', '#betTwo',{tips: 1});
            $("#betTwo").focus();
            return false;
        }

        //校验小数点
        var bet_num_back = this.bet_num + "";
        if(bet_num_back.indexOf(".") >= 0){
            layer.tips('投注金额不合法', '#betTwo',{tips: 1});
            $("#betTwo").focus();
            return false;
        }

        if(this.bet_num > this.dataRuleInfo.timeDoubleMaxBetNoPerKind || this.bet_num < 1){
            Utils.show("二字定每种组合投注范围【1-"+this.dataRuleInfo.timeDoubleMaxBetNoPerKind+"】");
            $("#betOne").focus();
            return false;
        }
        // if(Utils.isEmpty(this.payPwd)){
        //     layer.tips('支付密码不能为空', '#payPwdTwo',{tips: 1});
        //     $("#payPwdTwo").focus();
        //     return false;
        // }
        return true;
    }


    //快打提交数据
    quickPlaySubmit(){
        var row={
            lotteryOne:"",
            lotteryTwo:"",
            lotteryThree:"",
            lotteryFour:"",
            lotteryFive:"",
            multiple:0,
            bettingContent:""
        };

        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          payPwd:this.payPwd,
          betType:10,
          timeList:new Array()
        };
        var quickPlayBetNum = $("#quickPlayBetNum").val();
        var quickPlayBetMoney = $("#quickPlayBetMoney").val();
        this.payPwd = $("#payPwdQuickPlay").val();
        if(this.validatorBetQuickPlay(quickPlayBetNum,quickPlayBetMoney)){
              this.sumMoney = quickPlayBetMoney;
              quickPlayBetNum = quickPlayBetNum.toUpperCase();
              //判断X的个数
              var n = (quickPlayBetNum.split('X')).length-1;
              if(n != 3 && n != 4){
                  layer.tips('投注号码不规范', '#quickPlayBetNum',{tips: 1});
                  $("#quickPlayBetNum").focus();
                  return false;
              }

              //判断投注规则
              var d = [];
              for(var i=0;i<quickPlayBetNum.length;i++){
                  d.push(quickPlayBetNum.charAt(i).replace(/X/g,"-1"));
              }
              //alert(d.join(','));
              //加入到集合中
              row.lotteryOne=d[0];
              row.lotteryTwo=d[1];
              row.lotteryThree=d[2];
              row.lotteryFour=d[3];
              row.lotteryFive=d[4];
              row.bettingContent=quickPlayBetNum;
              row.multiple=quickPlayBetMoney;
              //console.log(row);
              subData.timeList.push(row);

              var backUrl;
              if(n == 4){
                  backUrl = "/time/oneTimeBetting";
                  subData.betType = 10;
              }else if(n == 3){
                  backUrl = "/time/twoTimeBetting";
                  subData.betType = 20;
              }else{
                  Utils.show("网络不稳定！");
              }

              //提交表单
              this.subQuickToBack(backUrl,subData);
        }

    }

    //验证表单数据
    validatorBetQuickPlay(quickPlayBetNum:string,quickPlayBetMoney:string){
        if(Utils.isEmpty(quickPlayBetNum)){
            layer.tips('投注号码不符合规则', '#quickPlayBetNum',{tips: 1});
            $("#quickPlayBetNum").focus();
            return false;
        }
        if(quickPlayBetNum.length != 5){
            layer.tips('投注号码不符合规则', '#quickPlayBetNum',{tips: 1});
            $("#quickPlayBetNum").focus();
            return false;
        }
        if(Utils.isEmpty(quickPlayBetMoney)){
            layer.tips('投注金额不符合规则', '#quickPlayBetMoney',{tips: 1});
            $("#quickPlayBetMoney").focus();
            return false;
        }

        //校验小数点
        if(quickPlayBetMoney.indexOf(".") >= 0){
            layer.tips('投注金额不合法', '#quickPlayBetMoney',{tips: 1});
            $("#quickPlayBetMoney").focus();
            return false;
        }

        // if(Utils.isEmpty(this.payPwd)){
        //     layer.tips('支付密码不能为空', '#payPwdQuickPlay',{tips: 1});
        //     $("#payPwdQuickPlay").focus();
        //     return false;
        // }
        return true;
    }

    //提交快打数据
    subQuickToBack(backUrl:string,subData:any){
        layer.confirm('已选中一组号码，投注金额为'+this.sumMoney+'，是否确认投注', {
            btn: ['确定','取消'] //按钮
        }, function(idx:number){
          layer.closeAll();
          //提交表单
          timeLotteryPage.httpService.post({
              url:backUrl,
              data:subData
          }).subscribe((data:any)=>{
              if(data.code==='0000'){
                  Utils.show(data.message);
                  timeLotteryPage.payPwd = "";
                  $("#quickPlayBetNum").val("");
                  $("#quickPlayBetMoney").val("");
                  $("#payPwdQuickPlay").val("");
                  timeLotteryPage.jumpPage();
                  //location.reload();
              }else if(data.code==='9999'){
                  Utils.show(data.message);
              }else{
                  Utils.show("登录失败，请联系管理员");
              }
          });
        }, function(){
            //取消
        });
    }


    //投注类别
    betCategory($event:any,betCategory_index:string){
        $($event.target).siblings("span").css("background-color","#A7D6CD");
        $($event.target).css("background-color","#148ee2");

        $(".content-tab_2").hide();
        $(".content-tab_3").hide();
        $(".content-tab_4").hide();
        $(".content-tab_5").hide();
        $(".content-tab_6").hide();
        $(".content-tab_7").hide();

        $(".content-tab_"+betCategory_index).show();

        //重置金额
        this.sumNumber = 0;
        //计算总金额
        this.sumMoney = 0;
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

    categoryClick($event:any,category_index:number){
        if(!this.validatorTimeTwoBettingRule(category_index)){
            return false;
        }
        $(".category_type").css("color","black");
        $(".category_type").css("text-decoration","none");
        $(".category_type").attr("isClick","1");

        $($event.target).css("color","red");
        $($event.target).css("text-decoration","underline");

        //设置显示
        $(".tbody_category tr").hide();
        $(".category_"+category_index).show();
        this.bettingTwoRule_num = category_index;
        //设置
        $($event.target).attr("isClick","2");
    }

    //获取赔率
    loadTimeLotteryOdds(){
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


    /**
    * 弹出等级面板
    */
    openBettingPrompt(gameType:number,subData:any){
        layer.open({
            title: "是否确认投注",
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
                if(gameType == 1){
                    timeLotteryPage.httpService.post({
                        url:'/time/oneTimeBetting',
                        data:subData
                    }).subscribe((data:any)=>{
                        if(data.code==='0000'){
                            Utils.show(data.message);
                            timeLotteryPage.payPwd="";
                            timeLotteryPage.bet_num=1;
                            $("#betOne").val("");
                            $("#payPwdOne").val("");
                            timeLotteryPage.jumpPage();
                            //location.reload();
                        }else if(data.code==='9999'){
                            Utils.show(data.message);
                        }else{
                            Utils.show("登录失败，请联系管理员");
                        }
                    });
                }else if(gameType == 2){
                    timeLotteryPage.httpService.post({
                        url:'/time/twoTimeBetting',
                        data:subData
                    }).subscribe((data:any)=>{
                        if(data.code==='0000'){
                            Utils.show(data.message);
                            this.payPwd="";
                            this.bet_num=1;
                            $("#betTwo").val("");
                            $("#payPwdTwo").val("");
                            timeLotteryPage.jumpPage();
                            //location.reload();
                        }else if(data.code==='9999'){
                            Utils.show(data.message);
                        }else{
                            Utils.show("登录失败，请联系管理员");
                        }
                    });
                }else if(gameType == 3){
                    alert("快打");
                }
            }
        });
    }

    //跳转页面
    jumpPage(){
        localStorage.setItem("gameType","21");
        mainPage.showStyle("","/desktop/userOrder",".leftPanel_3");
        //mainPage.loadUserInfo();
    }

    //取消投注
    bettingCacle(){
        mainPage.showStyle("","/desktop/blank",".leftPanel_2");
    }

    //快选界面js
    judgeNumBlur(judgeId:string){
        var judgeNum = $("#"+judgeId).val();
        var judgeCount = this.judgeList.indexOf(judgeId);
        //console.log("judgeCount:"+judgeCount);

        if(judgeCount < 0){
            if(Utils.isNotEmpty(judgeNum)){
                if(judgeNum.indexOf("-") >= 0){
                    $("#"+judgeId).val("");
                    return false;
                }
                if(this.judgeList.length >= 2){
                    $("#"+judgeId).val("");
                    return false;
                }
                this.judgeList.push(judgeId);
            }
        }else{
            if(Utils.isEmpty(judgeNum)){
                this.judgeList.splice(judgeCount,1);
            }
        }
        //console.log(this.judgeList);
    }

    judgeNumFocus(judgeId:string){
        this.keyCodeList = new Array();
        $("#"+judgeId).val("");
    }

    judgeNumDown($event:any,judgeId:string){
        var judgeNum = $("#"+judgeId).val();
        var keyCodeNum = $event.keyCode;
        //console.log(keyCodeNum);
        if(Utils.isEmpty(judgeNum)){
            //this.oldCodeList = new Array();
            this.keyCodeList = new Array();
        }

        if((keyCodeNum >= 48 && keyCodeNum <=57) || (keyCodeNum >= 96 && keyCodeNum <=105)){
            if(keyCodeNum > 58){
                keyCodeNum = keyCodeNum - 48;
            }

            var charCode = String.fromCharCode(keyCodeNum);

            var judgeCount = this.keyCodeList.indexOf(keyCodeNum);
            //console.log("judgeCount:"+judgeCount);
            if(judgeCount < 0){
                this.keyCodeList.push(keyCodeNum);
                //this.oldCodeList = this.keyCodeList;
                //console.log("judgeNum:"+judgeNum);
            }else{
                //console.log(String.fromCharCode(65));
                //this.oldCode
                return false;
            }

            //$("#"+judgeId).val(this.oldCode);

            //console.log("keyCodeNum:"+keyCodeNum);
        }

        if(keyCodeNum == 8 || keyCodeNum == 46){
            this.keyCodeList = new Array();
            $("#"+judgeId).val("");
            return false;
        }

    }

    generatingNumber(){
      if(this.judgeList.length <= 1){
          Utils.show("请从【万千百十个】中任意选两种组合");
          return false;
      }
      this.judgeList.sort();
      var quickMap = {};
      var quickKey;
      var quickNum;
      //console.log(this.judgeList.length);
      for(var i=0;i<this.judgeList.length;i++){
          //console.log(this.judgeList[i]);
          //console.log(this.judgeList[i].substring(this.judgeList[i].length-1,this.judgeList[i].length));
          quickNum = $("#"+this.judgeList[i]).val();
          quickKey = this.judgeList[i].substring(this.judgeList[i].length-1,this.judgeList[i].length);
          quickMap[quickKey]=quickNum;
          //quickMap.put(this.judgeList[i].substring(this.judgeList[i].length-1,this.judgeList[i].length),quickNum);
      }

      //console.log(quickMap);
      //console.log("this.kindType:"+this.kindType);
      this.httpService.post({
          url:'/time/quickChoose',
          data:{
              betType:2,
              multiple:0,
              kindType:this.kindType,
              map:quickMap
          }
      }).subscribe((data:any)=>{
          if(data.code==='0000'){
              Utils.show(data.message);
              this.quickNumberList = data.data;
          }else if(data.code==='9999'){
              Utils.show(data.message);
              this.cacleNumber();
          }else{
              Utils.show("登录失败，请联系管理员");
          }
      });
    }

    cacleNumber(){
        this.quickNumberList = new Array();
        for(var i=0;i<this.judgeList.length;i++){
            $("#"+this.judgeList[i]).val("");
        }
        this.judgeList = new Array();
        this.keyCodeList = new Array();
        $("#exceptNumber").prop("checked","");
        $("#takeNumber").prop("checked","");
        this.kindType = 1;
    }

    doubleNumber(doubleType:number){
        var doubleId;
        var checkState;
        if(doubleType == 2){
          doubleId = "takeNumber";
          $("#exceptNumber").prop("checked","");
        }else if(doubleType == 3){
          doubleId = "exceptNumber";
          $("#takeNumber").prop("checked","");
        }

        checkState = $("#"+doubleId).prop("checked");
        //console.log("checkState:"+checkState);
        if(checkState){
            this.kindType = doubleType;
        }else{
            this.kindType = 1;
        }
        //console.log("kindType:"+this.kindType);
    }

    quickChooseSubmit(){

        if(Utils.isEmpty(this.quickNumberList)){
            Utils.show("请选择投注的号码");
            return false;
        }
        //获取倍数
        this.sumNumber = 0;
        this.bet_num = $("#quickSelectionBetMoney").val();

        if(Utils.isEmpty(this.bet_num) || this.bet_num == 0){
            Utils.show("投注金额不规范");
            return false;
        }

        //校验小数点
        var bet_num_back = this.bet_num + "";
        if(bet_num_back.indexOf(".") >= 0){
            layer.tips('投注金额不合法', '#quickSelectionBetMoney',{tips: 1});
            $("#quickSelectionBetMoney").focus();
            return false;
        }

        //this.payPwd = $("#payPwdTwo").val();

        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          payPwd:this.payPwd,
          betType:20,
          timeList:new Array()
        };

        var quickStr;
        for(var i=0;i<this.quickNumberList.length;i++){
            for(var j=0;j<this.quickNumberList[i].length;j++){
                var row={
                    lotteryOne:"",
                    lotteryTwo:"",
                    lotteryThree:"",
                    lotteryFour:"",
                    lotteryFive:"",
                    multiple:0,
                    bettingContent:""
                };
                quickStr = this.quickNumberList[i][j];
                this.sumNumber ++;
                var d = [];
                for(var k=0;k<quickStr.length;k++){
                    d.push(quickStr.charAt(k).replace(/X/g,"-1"));
                }
                //quickStr = quickStr.replace(/X/g,"-1");
                //console.log("quickStr:"+quickStr);
                row.lotteryOne=d[0];
                row.lotteryTwo=d[1];
                row.lotteryThree=d[2];
                row.lotteryFour=d[3];
                row.lotteryFive=d[4];
                row.bettingContent=this.quickNumberList[i][j];
                row.multiple=this.bet_num;
                //console.log(row);
                subData.timeList.push(row);
            }
      }

      //计算总金额
      this.sumMoney = this.sumNumber * this.bet_num;

      //提交表单
      this.submitQuickChooseData(subData);
  }

  submitQuickChooseData(subData:any){
      layer.confirm('已选中'+this.sumNumber+'组号码，投注金额为'+this.sumMoney+'，是否确认下注', {
          btn: ['确定','取消'] //按钮
      }, function(idx:number){
        layer.closeAll();
        //提交表单
        timeLotteryPage.httpService.post({
            url:"/time/twoTimeBetting",
            data:subData
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                Utils.show(data.message);
                timeLotteryPage.payPwd = "";
                $("#quickSelectionBetMoney").val("");
                timeLotteryPage.jumpPage();
                //location.reload();
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("登录失败，请联系管理员");
            }
        });
      }, function(){
          //取消
      });
  }
}
