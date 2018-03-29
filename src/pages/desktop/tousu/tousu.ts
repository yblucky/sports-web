import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { MainPage } from '../../common/main/main';

declare var $: any;
declare var layer: any;
var mainPage :any;
var tousuPage : any;

@Component({
    selector   : 'page-tousu',
    templateUrl: './tousu.html',
    styleUrls: ['./tousu.scss']
})
export class TousuPage {

    //定义data
    dataInfo:any;
    showTime:any = new Date();
    //定义号码
    haomas:any = [1,2,3,4,5,6,7,8,9,10];
    lotteryList:any = [];

    //定义开奖时间
    openTime: any = "2017-01-30 17:40:00";
    //定义当前期数
    currentIssuNo:string="XXXXXX";
    //定义上期期数
    preIssuNo:string="XXXXXX";
    //定义下期期数
    lotteryInfo:any;
    //定义定时器
    timer:any;

    //定义封盘时间的分
    fengpan_feng:number = 0;
    fengpan_miao:number = 0;

    //定义数组保存号码列表
    betting_list:any=[];
    betting_list_row:any=[];
    dingwei_row:any=["one","two","three","four","five","six","seveen","eight","nine","ten"]; //个  十  百  千  万
    dingwei_nums:any =[];
    numsArr:any = [];
    dataRuleInfo:any;
    maxBetNoPerRrack:number =3;
    racingOdds:number;
    //每期最多下注多少个不同的赛道
    maxBetRracks:number = 3;
    //单注最小下注数量
    minBetNoPerDigitalRace:number=10;
    //单注最大下注数量
    maxBetNoPerDigitalRace:number=100;
    betting_list_display:any=[];
    doubling_index:number;
    target_elm:any;
    sumMoney:number = 0;
    //定义输入倍数
    inputMultiplier:number = 1;
    inputMultiplier_back:number = 1;

    constructor(private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils,private mPage:MainPage) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        //this.path = Utils.FILE_SERVE_URL;
        //this.httpService.currentPage=1;
        //this.loadData();
        tousuPage = this;
        mainPage = mPage;
        this.loadData();
        this.initnumsArray();
    }

    //验证表单数据
    validatorBetOne(j:number){
        var count=0;
        for(var i=0;i<this.dingwei_nums.length;i++){
          if(this.dingwei_nums[i].length>0 && i!=j){
            count++;
          }
        }
        //console.log("count"+count);
        if(count>=this.maxBetRracks){
            Utils.show("每期最多投注个"+this.maxBetRracks+"赛道");
            return false;
        }

        for(var i=0;i<this.betting_list.length;i++){
            if(this.betting_list[i][10]> this.maxBetNoPerDigitalRace || this.betting_list[i][10]< this.minBetNoPerDigitalRace){
                Utils.show("单注投注范围【"+this.dataRuleInfo.minBetNoPerDigital+"-"+this.dataRuleInfo.maxBetNoPerDigital+"】");
                return false;
            }
        }

        // if(Utils.isEmpty(this.payPwd)){
        //     layer.tips('支付密码不能为空', '#payPwdOne',{tips: 1});
        //     $("#payPwdOne").focus();
        //     return false;
        // }
        return true;
    }

    loadRacingLotteryRule(){
        this.httpService.get({
          url:'/common/regex',
          data:{}
        }).subscribe((data:any)=>{
          if(data.code==='0000'){
              //修改成功
              this.dataRuleInfo = data.data;
              //每个赛道最多选几个数字
              this.maxBetNoPerRrack = this.dataRuleInfo.maxBetNoPerRrack;
              //赔率
              this.racingOdds = this.dataRuleInfo.racingOdds;
              //每期最多下注多少个不同的赛道
              this.maxBetRracks = this.dataRuleInfo.maxBetRracks;
              //单注最小下注数量
              this.minBetNoPerDigitalRace = this.dataRuleInfo.minBetNoPerDigitalRace;
              //单注最大下注数量
              this.maxBetNoPerDigitalRace = this.dataRuleInfo.maxBetNoPerDigitalRace;
          }else if(data.code==='9999'){
              Utils.show(data.message);
          }else{
              Utils.show("网络异常");
          }
        });
    }

    //获取时时彩信息
    loadData(){
      this.httpService.get({
        url:'/racing/racingInfo',
        data:{}
      }).subscribe((data:any)=>{
        if(data.code==='0000'){
            //修改成功
            this.dataInfo = data.data;
            this.init();
            this.loadRacingLotteryRule();
            //console.log(this.dataInfo);
        }else if(data.code==='9999'){
            Utils.show(data.message);
        }else{
            Utils.show("系统异常，请联系管理员");
        }
      });
    }

    //封盘时间倒计时
    init(){
        this.currentIssuNo = this.dataInfo.historyIssuNo;
        this.preIssuNo = this.dataInfo.appRacingLotteryPo.issueNo;
        this.lotteryInfo = this.dataInfo.appRacingLotteryPo;
        this.openTime = this.dataInfo.bettingOpen;
        $("#shuru").val(this.minBetNoPerDigitalRace);

        //获取开奖号码
        this.lotteryList = new Array();
        this.lotteryList.push(this.lotteryInfo.lotteryOne);
        this.lotteryList.push(this.lotteryInfo.lotteryTwo);
        this.lotteryList.push(this.lotteryInfo.lotteryThree);
        this.lotteryList.push(this.lotteryInfo.lotteryFour);
        this.lotteryList.push(this.lotteryInfo.lotteryFive);
        this.lotteryList.push(this.lotteryInfo.lotterySix);
        this.lotteryList.push(this.lotteryInfo.lotterySeven);
        this.lotteryList.push(this.lotteryInfo.lotteryEight);
        this.lotteryList.push(this.lotteryInfo.lotteryNine);
        this.lotteryList.push(this.lotteryInfo.lotteryTen);

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
        }
    }


    //投注
    bettingSubmit(){
        var subData={
          issueNo:this.dataInfo.historyIssuNo,
          serialNumber:this.dataInfo.currentIssueNo,
          betType:10,
          payPwd:"123456",
          raingList:new Array()
        };
        //console.log(this.betting_list);
        for(var i=0;i<this.betting_list.length;i++){
          var row={
              lotteryOne:"",
              lotteryTwo:"",
              lotteryThree:"",
              lotteryFour:"",
              lotteryFive:"",
              lotterySix:"",
              lotterySeven:"",
              lotteryEight:"",
              lotteryNine:"",
              lotteryTen:"",
              multiple:"",
              bettingContent:""
          };
          row.lotteryOne=this.betting_list[i][0];
          row.lotteryTwo=this.betting_list[i][1];
          row.lotteryThree=this.betting_list[i][2];
          row.lotteryFour=this.betting_list[i][3];
          row.lotteryFive=this.betting_list[i][4];
          row.lotterySix=this.betting_list[i][5];
          row.lotterySeven=this.betting_list[i][6];
          row.lotteryEight=this.betting_list[i][7];
          row.lotteryNine=this.betting_list[i][8];
          row.lotteryTen=this.betting_list[i][9];
          row.multiple=this.betting_list[i][10];
          row.bettingContent=this.betting_list[i][11];
          subData.raingList.push(row);
        }
        if(this.validator()){
            this.httpService.post({
                url:'/racing/oneRaceBetting',
                data:subData
            }).subscribe((data:any)=>{
                if(data.code==='0000'){
                    Utils.show(data.message);
                    tousuPage.jumpPage();
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
        if(this.betting_list.length == 0){
            Utils.show("请选择投注号码");
            return false;
        }
        return true;
    }

    //封装初始化每个投注的数组
    initClickArray(){
      var clickArr=new Array();
      for(var i=0;i<11;i++){
        clickArr[i]=-1;
        if(i==10){
          clickArr[i]=0;
        }
      }
      return clickArr;
    }

    //封装初始化每个投注的数组
    initContentArray(){
      var clickArr=new Array();
      for(var i=0;i<10;i++){
        clickArr[i]="X";
      }
      return clickArr;
    }

    //封装初始化每个不同的个十百千万对应的位置上投注的数字集合
    initnumsArray(){
      var numsArr=new Array();
      for(var i=0;i<10;i++){
        numsArr=[];
        this.dingwei_nums.push(numsArr);
      }
      return this.dingwei_nums;
    }

    //点击号码生成投注列表
    createTouzhu($event:any){
      //clickArr[0] 个位  clickArr[1] 十位 clickArr[2] 百位 clickArr[3] 千位 clickArr[4] 万位 clickArr[5] 投注倍数;
        var clickArr=this.initClickArray();
        var elm = $($event.target);
        //获取点击事件的各个参数
        var className = elm.attr("class");
        var num =  parseInt(elm.text());

        //获取输入倍数框
        //改变加倍
        $("#inputMultiplier1").css("display","block");
        $("#inputMultiplier2").css("display","none");

        //获取倍数
        this.inputMultiplier = $("#shuru").val();

        //判断是否投错位置
        var n=this.dingwei_row.indexOf(className);
        if(n==-1){
          Utils.show("操作错误");
          return;
        }

        if(!this.validatorBetOne(n)){
            return false;
        }

        var contentArr = this.initContentArray();
        contentArr[n] = num;
        var contentStr = (contentArr.toString()).replace(/,/g,"");
        console.log("contentStr:"+contentStr);
        //[-1,-1,-1,-1,-1,0]
        //判断是否有添加过
        if(this.betting_list.length==0){
          //直接增加投注
          // for(var j=0;j<this.dingwei_row.length;j++){
            clickArr[n]=num;
            clickArr[10]=this.inputMultiplier;
            clickArr[11]=contentStr;
            this.betting_list.push(clickArr);
            this.dingwei_nums[n].push(num);
            //恢复默认数组
            clickArr=this.initClickArray();
            //显示就好
          // }
        }else{
          //for(var k=0;k<this.betting_list.length;k++){
            //for(var j=0;j<5;j++){
            var countPerNum=this.dingwei_nums[n].length;
            if(countPerNum>=this.maxBetNoPerRrack){
               Utils.show("单个位只能最多投注"+this.maxBetNoPerRrack+"个不同的数字");
               return;
            }
            if(this.dingwei_nums[n].indexOf(num)>-1){
              Utils.show("此位对应的数字已经添加过投注,请直接加倍");
              return;
            }
            //}
            //var n=this.dingwei_row.indexOf(className);

          //}
          clickArr[n]=num;
          clickArr[10]=this.inputMultiplier;
          clickArr[11]=contentStr;
          this.betting_list.push(clickArr);
          //console.log(this.betting_list);
          this.dingwei_nums[n].push(num);
        }

        console.log(this.betting_list);

        //投注颜色变红
        elm.css("background-image","url('/assets/pkImg/haoma_blue.png')");
        //刷新列表
        this.addBettingList();
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
    }

    //针对某一号码用的
    shurubeishu1(flag:number){
        //获取输入框中的参数
        this.inputMultiplier_back = parseInt($("#shuru1").val());

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

        this.doubling(this.target_elm,this.doubling_index,2);

        this.addBettingList();
    }

    //添加列表
    addBettingList(){

        this.betting_list_display =Utils.copyObject(this.betting_list);
        for(var i=0;i<this.betting_list_display.length;i++){
            var row=this.betting_list_display[i];
            for(var j=0;j<row.length;j++){
              if(row[j]==-1){
                row[j]='X';
              }
            }
            //console.log("###################"+row);
            this.betting_list_display[i]=row;
        }
        this.calculateAmount();
    }

    //删除号码
    delBettingRow(index:number){
        //新的
      var del_betting_list_row=this.betting_list[index];
      for(var i=0;i<del_betting_list_row.length-1;i++){
        if(del_betting_list_row[i]!=-1){
            if(i==0){
              $("#one_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==1){
              $("#two_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==2){
              $("#three_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==3){
              $("#four_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==4){
              $("#five_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==5){
              $("#six_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==6){
              $("#seveen_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==7){
              $("#eight_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==8){
              $("#nine_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==9){
              $("#ten_"+(parseInt(del_betting_list_row[i])-1)).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }
            //console.log("定位数前:"+this.dingwei_nums);
            var n = this.dingwei_nums[i].indexOf(parseInt(del_betting_list_row[i]));
            this.dingwei_nums[i].splice(n,1);
            //console.log("定位数后:"+this.dingwei_nums);
            this.betting_list.splice(index,1);
            this.betting_list_display.splice(index,1);
            break;
        }
      }

      this.calculateAmount();
    }

    //点击加倍数（接着昨天做）
    doubling($event:any,index:number,flag:number){
        //改变加倍
        $("#inputMultiplier1").css("display","none");
        $("#inputMultiplier2").css("display","block");
        //获取点击事件
        this.doubling_index = index;
        this.target_elm = $($event.target);
        this.target_elm.parent().siblings("tr").css("background-color","");
        this.target_elm.parent().css("background-color","#95928E");

        //新的
        var betting_row =this.betting_list[index] ;
        if(flag == 2){
            //获取倍数
            betting_row[10] = parseInt($("#shuru1").val());
        }
        //赋值给加倍框
        $("#shuru1").val(betting_row[10]);

        // this.addBettingList();
        //计算金额
        this.calculateAmount();
    }

    //计算投注总金额
    calculateAmount(){
      this.sumMoney = 0;
      for(var i=0;i<this.betting_list.length;i++){
        this.sumMoney = this.sumMoney + parseInt(this.betting_list[i][10]);
      }
      return this.sumMoney;
    }

    //清空列表
    clearBetList(){
        //循环变颜色
        for(var i=0;i<10;i++){
          $("#one_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#two_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#three_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#four_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#five_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#six_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#seveen_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#eight_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#nine_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
          $("#ten_"+i).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
        }

        //清除列表
        this.betting_list.splice(0,this.betting_list.length);
        this.betting_list_display.splice(0,this.betting_list_display.length);
        this.dingwei_nums.splice(0,this.dingwei_nums.length);
        //console.log(this.betting_list.length);
        //初始化
        this.initnumsArray();
        this.sumMoney = 0;
    }

    //显示开奖动画
    startGame(){
        $(".saicheshiping").show();
    }

    closeGame(){
        $(".saicheshiping").hide();
    }

    //跳转页面
    jumpPage(){
        mainPage.showStyle("","/desktop/userOrder",".leftPanel_3");
        //mainPage.loadUserInfo();
    }

}
