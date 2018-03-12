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
    showTime:any = new Date();
    //定义号码
    haomas:any = [0,1,2,3,4,5,6,7,8,9];
    lotteryList:any = [10,10,10,10,10];

    //定义开奖时间
    openTime: any="2018-01-01 00:00:00";
    //定义当前期数
    currentIssuNo:string="20180101001";
    //定义上期期数
    preIssuNo:string="20180101000";
    //定义下期期数
    lotteryInfo:any;
    //定义定时器
    timer:any;
    //定义数据定时器
    timerData:any;
    countDown = 120;

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
            }else if(this.dataInfo.restTime == 0){
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
          }else if(data.code==='9999'){
              Utils.show(data.message);
          }else{
              Utils.show("网络异常");
          }
        });
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
                Utils.show("最多选取个"+this.dataRuleInfo.maxBetDigitalNoPerSeat+"位");
                return false;
            }
            if(this.bettingOneRule_list[index].length>this.dataRuleInfo.maxBetDigitalNoPerSeat){
                Utils.show("单个位,最多选取个"+this.dataRuleInfo.maxBetDigitalNoPerSeat+"不同的号码");
                return false;
            }
          }

          var betNum = $("#betOne").val();
          if(betNum < this.dataRuleInfo.minBetNoPerDigital || betNum > this.dataRuleInfo.maxBetNoPerDigital){
              Utils.show("单注投注范围【"+this.dataRuleInfo.minBetNoPerDigital+","+this.dataRuleInfo.maxBetNoPerDigital+"】");
              return false;
          }
       }
       return true;
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

        //计算封盘时间
        var diff = this.dataInfo.restTime;
        //var diff = 1646;
        if(diff != 0){
            diff = diff / 1000;
            this.fengpan_feng = Math.floor(diff/ 60);
            this.fengpan_miao = Math.floor(diff % 60);
            this.timer = setInterval(() => {
                this.fengpan_miao = this.fengpan_miao - 1;
  //              clearInterval(this.timerData);
                //如果秒减完，就减分
                if(this.fengpan_miao == 0){
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
        if(this.validatorBetOne()){
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
        if(Utils.isEmpty(this.sumMoney) || this.sumMoney == 0){
            layer.tips('投注金额不合法', '#betOne',{tips: 1});
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

    //二字定投注
    bettingTwoSubmit(){
        //获取倍数
        this.sumNumber = this.bettingTwo_list.length;
        this.bet_num = $("#betTwo").val();
        this.payPwd = $("#payPwdTwo").val();
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
        if(this.validatorBetTwo()){
            this.openBettingPrompt(2,subData);
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
            Utils.show("二字定选定两个位后,最多选"+this.dataRuleInfo.maxBetDigitalNoPerSeat+"种组合");
            this.bettingTwoRule_list[twoBettingIndex] = this.bettingTwoRule_list[twoBettingIndex] - 1;
            return false;
        }

        var betNum = $("#betTwo").val();
        if(betNum > this.dataRuleInfo.timeDoubleMaxBetNoPerKind || betNum < 1){
            Utils.show("二字定每种组合投注范围【1-"+this.dataRuleInfo.timeDoubleMaxBetNoPerKind+"】");
            return false;
        }

        return true;
   }


    //验证表单数据
    validatorBetTwo(){
        if(Utils.isEmpty(this.bettingTwo_list) || this.sumNumber == 0){
            Utils.show("请选择投注的号码");
            return false;
        }
        if(Utils.isEmpty(this.sumMoney) || this.sumMoney == 0){
            layer.tips('投注金额不合法', '#betTwo',{tips: 1});
            $("#betTwo").focus();
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
        // if(Utils.isEmpty(this.payPwd)){
        //     layer.tips('支付密码不能为空', '#payPwdQuickPlay',{tips: 1});
        //     $("#payPwdQuickPlay").focus();
        //     return false;
        // }
        return true;
    }

    //提交快打数据
    subQuickToBack(backUrl:string,subData:any){
        //提交表单
        this.httpService.post({
            url:backUrl,
            data:subData
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
                Utils.show(data.message);
                this.payPwd = "";
                $("#quickPlayBetNum").val("");
                $("#quickPlayBetMoney").val(1);
                $("#payPwdQuickPlay").val("");
                timeLotteryPage.jumpPage();
                //location.reload();
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("登录失败，请联系管理员");
            }
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
                            $("#betOne").val(1);
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
                            $("#betTwo").val(1);
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
        mainPage.showStyle("","/desktop/userOrder",".leftPanel_3");
        //mainPage.loadUserInfo();
    }

    //取消投注
    bettingCacle(){
        mainPage.showStyle("","/desktop/blank",".leftPanel_2");
    }

}
