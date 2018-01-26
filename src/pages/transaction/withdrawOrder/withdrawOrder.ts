import { Component } from "@angular/core";
import { HttpService } from "../../../providers/HttpService";
import { Utils } from "../../../providers/Utils";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
declare var $: any;
declare var layer: any;
var withdrawOrder: any;

@Component({
    selector   : 'page-withdrawOrder',
    templateUrl: './withdrawOrder.html',
    styleUrls: ['./withdrawOrder.scss']
})
export class WithdrawOrder {
    find:any={
      uid:"",
      mobile:"",
      orderId:"",
      state:"",
      startTime:"",
      endTime:""
    };
    judge:any={};
    orderType:string;
    editInfo:any={};
    showTime:any = new Date();
    constructor(private router:Router,private httpService:HttpService,private aroute:ActivatedRoute,private utils:Utils) {
        this.aroute.params.subscribe( params  => {
            this.showTime = new Date();
        });
        if(this.aroute.snapshot.queryParams["order"]!=undefined){
          this.find.orderId=this.aroute.snapshot.queryParams["order"];
          this.httpService.currentPage=1;
        }
        if(this.aroute.snapshot.queryParams["state"]!=undefined){
          this.find.state=this.aroute.snapshot.queryParams["state"];
          this.httpService.currentPage=1;
        }
        withdrawOrder=this;
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
            url:'/transactionPage/withdraw',
            data:this.find
        });
    }

    /**
    * 弹出编辑面板
    */
    showEdit(item:any){
        this.editInfo = Utils.copyObject(item);
        this.httpService.get({
              url:'/transactionPage/judge',
              data:{id:this.editInfo.id}
        }).subscribe((data:any)=>{
              if(data.code === "0000"){
                  this.judge=Utils.copyObject(data.data);
                  layer.open({
                      title: "订单纠纷处理",
                      btn: ["保存","取消"],
                      type: 1,
                      closeBtn: 0,
                      shade: 0,
                      fixed: true,
                      shadeClose: false,
                      resize: false,
                      area: ['627px','379px'],
                      content: $("#editPanel"),
                      yes: function(index:number){
                        if(withdrawOrder.orderType==undefined){
                          alert("请选择审判结果!");
                          return;
                        }
                        withdrawOrder.httpService.post({
                              url:'/transactionPage/judgeUser',
                              data:{userid:withdrawOrder.orderType,orderId:withdrawOrder.editInfo.id}
                        }).subscribe((data:any)=>{
                              if(data.code === "0000"){
                                alert(data.message);
                                layer.closeAll();
                                withdrawOrder.loadData();
                              }else{
                                alert(data.message);
                              }
                        });
                      }
                  });
              }
        });
    }

    Goto(item:any){
        this.router.navigate(['/common/main/transaction/rechargeOrder'],{relativeTo: this.aroute,queryParams: { order: item.targetOrder }});
    }
}
