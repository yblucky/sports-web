/**
 * Created by qsy on 2017-05-12.
 */
import {Injectable} from '@angular/core';
import {Utils} from "./Utils";
import {RequestOptionsArgs} from '@angular/http';
import { Router } from '@angular/router';
import * as Rx from 'rxjs/Rx';

declare var layer: any;

@Injectable()
export class HttpInterceptHandle {

    constructor(private router:Router) {
    }
    /**
    *  请求前
    */
    httpBefore(url: string, options ?: any){
        Utils.showLoading();
        console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
    }

    /**
    *  请求成功
    */
    httpSuccess(url: string, options ?: any){
        Utils.hideLoading();
        console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options);
    }

    /**
    *  请求异常
    */
    httpError(url: string, options ?: any, status? :number){
        Utils.hideLoading();
        console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options);
        if (status === 0) {
            Utils.show('请求响应错误，请检查网络');
        } else if (status === 404) {
            Utils.show('请求链接不存在，请联系管理员');
        } else if (status === 500) {
            Utils.show('服务器出错，请稍后再试');
        } else if (status === 608) {
            layer.msg("非法访问，与服务器断开连接",{
                icon: '5',
                time: 2000
            },()=>this.router.navigate(['common/login']));
        } else {
            Utils.show('未知错误，请检查网络');
        }
    }

}
