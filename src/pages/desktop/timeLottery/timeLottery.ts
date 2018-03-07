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
    bettingOne_list:any=[];
    bettingTwo_list:any=[];
    sumMoney:number = 0;
    sumNumber:number = 0;
    //支付密码
    payPwd:string="";
    //投注倍数
    bet_num:number = 1;

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
            //console.log(this.dataInfo);
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
        //获取倍数
        this.sumNumber = this.bettingOne_list.length;
        this.bet_num = $("#betOne").val();
        this.payPwd = $("#payPwdOne").val();
        //计算总金额
        this.sumMoney = this.sumNumber * this.bet_num;

        var row={
            lotteryOne:"",
            lotteryTwo:"",
            lotteryThree:"",
            lotteryFour:"",
            lotteryFive:"",
            multiple:"",
            bettingContent:""
        };

        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          payPwd:this.payPwd,
          timeList:new Array()
        };

        for(var i=0;i<this.bettingOne_list.length;i++){
            row.lotteryOne=this.bettingOne_list[i][0];
            row.lotteryTwo=this.bettingOne_list[i][1];
            row.lotteryThree=this.bettingOne_list[i][2];
            row.lotteryFour=this.bettingOne_list[i][3];
            row.lotteryFive=this.bettingOne_list[i][4];
            row.bettingContent=this.bettingOne_list[i][5];
            row.multiple=this.bettingOne_list[i][6];
            subData.timeList.push(row);
        }
        //console.log("subData:"+subData)
        if(this.validatorBetOne()){
            this.httpService.post({
                url:'/time/oneTimeBetting',
                data:subData
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                    this.payPwd="";
                    this.bet_num=0;
                    $("#betOne").val(1);
                    $("#payPwdOne").val("");
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("登录失败，请联系管理员");
                }
            });
        }
    }

    //验证表单数据
    validatorBetOne(){
        if(Utils.isEmpty(this.bettingOne_list)){
            Utils.show("请选择投注的号码");
            return false;
        }
        if(Utils.isEmpty(this.sumMoney) || this.sumMoney == 0){
            layer.tips('投注金额不合法', '#betOne',{tips: 1});
            $("#betOne").focus();
            return false;
        }
        if(Utils.isEmpty(this.payPwd)){
            layer.tips('支付密码不能为空', '#payPwdOne',{tips: 1});
            $("#payPwdOne").focus();
            return false;
        }
        return true;
    }

    //投注时时彩
    betTimeLotteryOne($event:any,digit:number,betNum:number){
        //获取flag属性
        var flag = $($event.target).attr("flag");
        //获取投注数值
        var clickArr=this.initClickArray();
        var contentArr = this.initContentArray();
        contentArr[digit] = betNum;
        var contentStr = (contentArr.toString()).replace(/,/g,"");
        //定义一个变量保存数组
        var rows;

        if(flag == 1){
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
        }else if(flag == 3){
            $($event.target).parent().css("background-color","#FFFF00");
            $($event.target).attr("flag","4");

            //放到服务上去
            clickArr[digit] = betNum;
            clickArr[5] = contentStr;
            //clickArr
            this.bettingOne_list.push(clickArr);
        }else if(flag == 4){
            $($event.target).parent().css("background-color","");
            $($event.target).attr("flag","3");

            for(var i=0;i<this.bettingOne_list.length;i++){
                rows = this.bettingOne_list[i];
                //判断是否该值
                if(contentStr == rows[5]){
                    //console.log("删除前"+this.bettingOne_list);
                    this.bettingOne_list.splice(i,1);
                    //console.log("删除后"+this.bettingOne_list);
                }
            }
        }
    }

    betTimeLotteryTwo($event:any,digit1:number,digit2:number,betNum1:number,betNum2:number){
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

        if(flag == 1){
          $($event.target).css("background-color","#FFFF00");
          $($event.target).attr("flag","2");

          //添加投注号码
          clickArr[digit1] = betNum1;
          clickArr[digit2] = betNum2;
          clickArr[5] = contentStr;
          //clickArr
          this.bettingTwo_list.push(clickArr);
        }else if(flag == 2){
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
        }else if(flag == 3){
          $($event.target).parent().css("background-color","#FFFF00");
          $($event.target).attr("flag","4");

          //添加投注号码
          clickArr[digit1] = betNum1;
          clickArr[digit2] = betNum2;
          clickArr[5] = contentStr;
          //clickArr
          this.bettingTwo_list.push(clickArr);
        }else if(flag == 4){
          $($event.target).parent().css("background-color","");
          $($event.target).attr("flag","3");

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

        var row={
            lotteryOne:"",
            lotteryTwo:"",
            lotteryThree:"",
            lotteryFour:"",
            lotteryFive:"",
            multiple:"",
            bettingContent:""
        };

        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          payPwd:this.payPwd,
          timeList:new Array()
        };

        for(var i=0;i<this.bettingTwo_list.length;i++){
            row.lotteryOne=this.bettingTwo_list[i][0];
            row.lotteryTwo=this.bettingTwo_list[i][1];
            row.lotteryThree=this.bettingTwo_list[i][2];
            row.lotteryFour=this.bettingTwo_list[i][3];
            row.lotteryFive=this.bettingTwo_list[i][4];
            row.bettingContent=this.bettingTwo_list[i][5];
            row.multiple=this.bettingTwo_list[i][6];
            subData.timeList.push(row);
        }
        //console.log("subData:"+subData)
        if(this.validatorBetTwo()){
            this.httpService.post({
                url:'/time/twoTimeBetting',
                data:subData
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                    this.payPwd="";
                    this.bet_num=0;
                    $("#betTwo").val(1);
                    $("#payPwdTwo").val("");
                }else if(data.code==='9999'){
                    Utils.show(data.message);
                }else{
                    Utils.show("登录失败，请联系管理员");
                }
            });
        }
    }

    //验证表单数据
    validatorBetTwo(){
        if(Utils.isEmpty(this.bettingTwo_list)){
            Utils.show("请选择投注的号码");
            return false;
        }
        if(Utils.isEmpty(this.sumMoney) || this.sumMoney == 0){
            layer.tips('投注金额不合法', '#betTwo',{tips: 1});
            $("#betTwo").focus();
            return false;
        }
        if(Utils.isEmpty(this.payPwd)){
            layer.tips('支付密码不能为空', '#payPwdTwo',{tips: 1});
            $("#payPwdTwo").focus();
            return false;
        }
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
            multiple:"",
            bettingContent:""
        };

        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          payPwd:this.payPwd,
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
              }else if(n == 3){
                  backUrl = "/time/twoTimeBetting";
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
        if(Utils.isEmpty(this.payPwd)){
            layer.tips('支付密码不能为空', '#payPwdQuickPlay',{tips: 1});
            $("#payPwdQuickPlay").focus();
            return false;
        }
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
