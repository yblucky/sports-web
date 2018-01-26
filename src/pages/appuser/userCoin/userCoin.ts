import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;
declare var layer: any;
var userPage: any;

@Component({
    selector   : 'page-userCoin',
    templateUrl: './userCoin.html',
    styleUrls: ['./userCoin.scss']
})
export class UserCoinPage {
    find:any={
      uid:"",
      mobile:"",
      nickName:"",
      name:""
    };
    upUser:any={};
    editDate:any={};
    showTime:any = new Date();
    



    /**
     * 排序条件
     */
    LitecoinCount:number = 0;
    BitcoinCount:number = 0;
    DogecoinCount:number = 0;
    EthereumCount:number = 0;
    VpayCount:number = 0 ; 


    Vpay:any = {
        Vpay:""
    };

    Litecoin:any = { 
       Litecoin:""
    };   
    Bitcoin:any = {
      Bitcoin:""
    }; 
    Dogecoin:any = {
      Dogecoin:""
    }; 
    Ethereum:any = {
      Ethereum:""
    }; 


   



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
    * 加载数据
    */
    loadData(){
        this.httpService.pagination({
            url:'/appUser/appUserCoinAddress',
            data:this.find
        });
    }





    



     /**
     * 币种排序
     * 
     */
    loadVpay(){

        this.VpayCount++;
        if(this.VpayCount % 2 ==1){
            this.Vpay.Vpay = "1";
        }else{
            this.Vpay.Vpay = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/appUserCoinAddress',
            data:this.Vpay
        });
      
    }



    loadLitecoin(){

        this.LitecoinCount++;
        if(this.LitecoinCount % 2 ==1){
            this.Litecoin.Litecoin = "1";
        }else{
            this.Litecoin.Litecoin = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/appUserCoinAddress',
            data:this.Litecoin
        });
      
    }


    loadBitcoin(){
        this.BitcoinCount++;
        if(this.BitcoinCount % 2 ==1){
            this.Bitcoin.Bitcoin = "1";
        }else{
            this.Bitcoin.Bitcoin = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/appUserCoinAddress',
            data:this.Bitcoin
        });
    }

    loadDogecoin(){
        this.DogecoinCount++;
        if(this.DogecoinCount % 2 ==1){
            this.Dogecoin.Dogecoin = "1";
        }else{
            this.Dogecoin.Dogecoin = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/appUserCoinAddress',
            data:this.Dogecoin
        });


    }

    loadEthereum(){
        this.EthereumCount++;
        if(this.EthereumCount % 2 ==1){
            this.Ethereum.Ethereum = "1";
        }else{
            this.Ethereum.Ethereum = "2";
        }
      
        this.httpService.pagination({
            url:'/appUser/appUserCoinAddress',
            data:this.Ethereum
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
    * 弹出编辑面板
    */
    showEditName(item:any){
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
            area: ['350px','auto'],
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
