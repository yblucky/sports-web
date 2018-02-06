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

    showTime:any = new Date();
    //定义号码
    haomas:any = [1,2,3,4,5,6,7,8,9,10];
    kaijianghaomas:any = [1,4,3,2,7,6,5,9,10,8];

    //定义开奖时间
    openTime: any = "2017-01-30 17:40:00";
    diff:any;
    shijian:any;

    //定义封盘时间的分
    fengpan_feng:any = 2;
    fengpan_miao:any = 30;

    //定义数组保存号码列表
    betting_list:any=[];
    betting_list_row:any=[];
    dingwei_row:any=["one","two","three","four","five","six","seveen","eight","nine","ten"]; //个  十  百  千  万
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

    constructor(private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        //this.path = Utils.FILE_SERVE_URL;
        //this.httpService.currentPage=1;
        //this.loadData();
        this.init();
        this.initnumsArray();
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
          alert("投注位置错了啊");
          return;
        }

        //[-1,-1,-1,-1,-1,0]
        //判断是否有添加过
        if(this.betting_list.length==0){
          //直接增加投注
          // for(var j=0;j<this.dingwei_row.length;j++){
            clickArr[n]=num;
            clickArr[10]=this.inputMultiplier;
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
            if(countPerNum>=this.maxNumsPerWeizhi){
               alert("单个位只能最多投注"+this.maxNumsPerWeizhi+"个不同的数字");
               return;
            }
            if(this.dingwei_nums[n].indexOf(num)>-1){
              alert("此位对应的数字已经添加过投注,请直接加倍");
              return;
            }
            //}
            //var n=this.dingwei_row.indexOf(className);

          //}
          clickArr[n]=num;
          clickArr[10]=this.inputMultiplier;
          this.betting_list.push(clickArr);
          this.dingwei_nums[n].push(num);
        }

        //投注颜色变红
        elm.css("background-image","url('/assets/pkImg/haoma_blue.png')");
        //计算金额
        this.calculateAmount();
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
    }

    //添加列表
    addBettingList(){
        this.betting_list_display = this.betting_list;
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
              $("#two_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==2){
              $("#three_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==3){
              $("#four_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==4){
              $("#five_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==5){
              $("#six_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==6){
              $("#seveen_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==7){
              $("#eight_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==8){
              $("#nine_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }else if(i==9){
              $("#ten_"+del_betting_list_row[i]).css("background-image","url('/assets/pkImg/haoma_yellow.png')");
            }
            //console.log("定位数前:"+this.dingwei_nums);
            var n = this.dingwei_nums[i].indexOf(parseInt(del_betting_list_row[i]));
            this.dingwei_nums[i].splice(n,1);
            //console.log("定位数后:"+this.dingwei_nums);
            this.betting_list.splice(index,1);
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
          $("#one_"+i).css("background-image","url('/assets/img/haoma_yellow.png')");
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
        this.dingwei_nums.splice(0,this.dingwei_nums.length);
        //console.log(this.betting_list.length);
        //初始化
        this.initnumsArray();
        this.sumMoney = 0;
    }
}
