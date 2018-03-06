/**
 * Created by qsy on 2017-05-12.
 */
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Observable,Observer} from "rxjs";
import {Utils} from "./Utils";
import {HttpInterceptHandle} from "./HttpInterceptHandle";
import {Router} from '@angular/router';

@Injectable()
export class HttpService {
    currentPage:number = 1;//默认当前页
    totalPage:number = 1;//默认总页数
    totalCount:number = 0;//默认总记录数
    items:any;//集合对象
    options:any;//请求参数
    constructor(public http: Http,public httpHandle: HttpInterceptHandle,public router:Router) {
    }

    /**
    * http get 请求
    */
    public get(options?: any){
        let url = Utils.APP_SERVE_URL + options.url;
        let headers = new Headers();
        headers.append('token', sessionStorage.getItem('token'));
        let params = new URLSearchParams();
        for(var key in options.data){
            params.set(key, options.data[key]);
        }
        let opt = new RequestOptions({ headers: headers, search: params });
        this.httpHandle.httpBefore(url, options.data);
        return Observable.create((observer: Observer<any>) => {
            this.http.get(url, opt).map(res => res.json()).toPromise().then(result=>{
                this.httpHandle.httpSuccess(url, options.data);
                observer.next(result);
            },err=>{
                this.httpHandle.httpError(url, options.data, err.status);
                observer.error(err);
            });
        });
    }

    /**
    * http post 请求
    */
    public post(options?: any){
        let url = Utils.APP_SERVE_URL + options.url;
        let headers = new Headers();
        headers.append('token', sessionStorage.getItem('token'));
        this.httpHandle.httpBefore(url, options.data);
        return Observable.create((observer: Observer<any>) => {
            this.http.post(url, options.data, new RequestOptions({ headers: headers})).map(res => res.json()).toPromise().then(result=>{
                this.httpHandle.httpSuccess(url, options.data);
                observer.next(result);
            },err=>{
                this.httpHandle.httpError(url, options.data, err.status);
                observer.error(err);
            });
        });
    }

    /**
    * 首页
    */
    toFirstPage(){
        this.currentPage=1;
        if(this.totalCount==0 || this.totalCount==null){
            return;
        }
        this.pagination(this.options);
    }

    /**
    * 上一页
    */
    prev(){
        if (this.currentPage > 1) {
            this.currentPage--;
            this.pagination(this.options);
        }
    }

    /**
    * 下一页
    */
    next(){
        if (this.currentPage < this.totalPage) {
            this.currentPage++;
            this.pagination(this.options);
        }
    }

    /**
    * 末页
    */
    toEndPage(){
        this.currentPage=this.totalPage;
        if(this.totalCount==0 || this.totalCount==null){
            return;
        }
        this.pagination(this.options);
    }

    /**
    * 分页加载数据
    */
    pagination(options?: any){
        this.options = options;
        options.data['pageNumber'] = this.currentPage;
        options.data['pageSize'] = Utils.PAGE_SIZE;
        this.get(options).subscribe((data:any)=>{
            if(data.code==='0000'){
                this.items = data.data;
                console.log(JSON.stringify(data.page));
                this.totalPage = data.page.pageCount || 0;
                this.totalCount = data.page.totalCount || 0;
            }else if(data.code==='9999'){
                Utils.show(data.message);
            }else{
                Utils.show("系统异常，请联系管理员");
            }
        });
    }

    getArray(count:number){
        let rarr = [];
        for(let i=1;i<=count;i++){
            rarr.push(i);
        }
        return rarr;
    }

    public loginOut(){
      this.post({
            url:'/user/loginOut',
            data:{}
      }).subscribe((data:any)=>{
            if(data.code === "0000"){
                this.router.navigate(['common/login']);
            }
      });
    }

}
