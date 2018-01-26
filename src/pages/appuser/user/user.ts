import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;
declare var layer: any;
var userPage: any;

@Component({
    selector   : 'page-user',
    templateUrl: './user.html',
    styleUrls: ['./user.scss']
})
export class UserPage {
    find:any={
      uid:"",
      mobile:"",
      nickName:"",
      name:"",
      state:"",
      credit:""
    };
    upUser:any={};
    editDate:any={};
    showTime:any = new Date();
    showPage:any = 1;  //1:修改 2:显示等级
    userLower:any;
    userParent:any;



    /**
     * 排序条件
     */
    scoreCount:number = 0;
    balanceCount:number = 0;
    shadowScoreCount:number = 0;
    virtualCoinCount:number = 0;


    score:any = { 
      score:""
    };   //积分
    balance:any = {
      balance:""
    }; //余额
    shadowScore:any = {
      shadowScore:""
    }; //影子积分
    virtualCoin:any = {
      virtualCoin:""
    }; //数字资产




    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        userPage=this;
        this.loadDataOne();
    }

    /**
    * 搜索默认第一页
    */
    loadDataOne(){
      this.httpService.currentPage=1;
      this.loadData();
    }

    /**
     * 积分排序
     * 
     */
    loadDataScore(){

        this.scoreCount++;
        if(this.scoreCount % 2 ==1){
            this.score.score = "1";
        }else{
            this.score.score = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/userTab',
            data:this.score
        });
      
    }


    loadbalance(){
        this.balanceCount++;
        if(this.balanceCount % 2 ==1){
            this.balance.balance = "1";
        }else{
            this.balance.balance = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/userTab',
            data:this.balance
        });
    }

    loadshadowScore(){
        this.shadowScoreCount++;
        if(this.shadowScoreCount % 2 ==1){
            this.shadowScore.shadowScore = "1";
        }else{
            this.shadowScore.shadowScore = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/userTab',
            data:this.shadowScore
        });


    }

    loadvirtualCoin(){
        this.virtualCoinCount++;
        if(this.virtualCoinCount % 2 ==1){
            this.virtualCoin.virtualCoin = "1";
        }else{
            this.virtualCoin.virtualCoin = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/userTab',
            data:this.virtualCoin
        });


    }










    /**
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/appUser/userTab',
            data:this.find
        });
    }

    disable(item:any){
      this.upUser.id=item.id;
      if(item.state==10){
        this.upUser.state=20
      }else if(item.state==20){
        this.upUser.state=10
      }else{
        alert("用户状态错误");
        return false;
      }
      this.httpService.post({
          url:'/appUser/upUserState',
          data:this.upUser
      }).subscribe((data:any)=>{
          if(data.code==='0000'){
              //修改成功
             this.loadData();
          }else if(data.code==='9999'){
              Utils.show(data.message);
          }else{
              Utils.show("系统异常，请联系管理员");
          }
      });
    }

    deleteItem(item:any){
      layer.confirm('删除为不可逆操作,您确定要删除此数据吗？', {
          btn: ['确定','取消'] //按钮
      }, function(){
          var upUser:any={};
          upUser.id=item.id;
          if(item.state==10||item.state==20){
            upUser.state=30
          }else{
            alert("用户状态错误");
            return false;
          }
          userPage.httpService.post({
              url:'/appUser/upUserState',
              data:upUser
          }).subscribe((data:any)=>{
              layer.closeAll();
              if(data.code==='0000'){
                  //删除成功
                 layer.msg(data.message,{
                     icon: '1',
                     time: 2000
                 },function(){
                     userPage.loadData();
                 });
              }else if(data.code==='9999'){
                  Utils.show(data.message);
              }else{
                  Utils.show("系统异常，请联系管理员");
              }
          });
      });
    }

     
    /**
    * 弹出等级面板
    */
    showGrade(item:any){
        this.showPage = 2;
        this.editDate = Utils.copyObject(item);
        this.httpService.get({
            url:'/appUser/loadLower',
            data:{parentId:item.id}
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
              this.userLower = data.data;
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });

        this.httpService.get({
            url:'/appUser/loadParent',
            data:{id:item.parentId}
        }).subscribe((data:any)=>{
            if(data.code==='0000'){
              this.userParent = data.data;
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
        
        layer.open({
            title: "查看层级",
            btn: ["确认","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['550px','400px'],
            content: $("#editPanel"),
            yes: function(index:number){
                   layer.closeAll();
            }
        });


    } 









    /**
    * 弹出编辑面板
    */
    showEditName(item:any){
        this.showPage = 1;
        this.editDate = Utils.copyObject(item);
        layer.open({
            title: "修改参数",
            btn: ["保存","退出"],
            type: 1,
            closeBtn: 0,
            shade: 0,
            fixed: true,
            shadeClose: false,
            resize: false,
            area: ['350px','170px'],
            content: $("#editPanel"),
            yes: function(index:number){
              if(Utils.isEmpty(userPage.editDate.name)){
                  layer.tips('姓名不能为空', '#name',{tips: 1});
                  $("#name").focus();
                  return false;
              }
              userPage.httpService.post({
                  url:'/appUser/upUserName',
                  data:userPage.editDate
              }).subscribe((data:any)=>{
                  layer.closeAll();
                  if(data.code==='0000'){
                      //修改成功
                      layer.msg(data.message,{
                          icon: '1',
                          time: 2000
                      },function(){
                          userPage.loadData();
                      });
                  }else if(data.code==='9999'){
                        Utils.show(data.message);
                  }else{
                        Utils.show("系统异常，请联系管理员");
                  }
              });
            }
        });
    }
    bankCard(item:any){
        this.router.navigate(['/common/main/appuser/bankcard'],{relativeTo: this.aroute,queryParams: { uid: item.uid }});
    }
}
