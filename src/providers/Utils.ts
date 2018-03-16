/**
 * Created by qsy on 2017-05-12.
 */
import {Injectable} from '@angular/core';

declare var $: any;//Jquery对象
declare var layer: any;//layer对象

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Utils {

    //static APP_SERVE_URL = 'http://192.168.2.222:8091/api';//请求路径 dev环境
    //static FILE_SERVE_URL = 'http://dev.sutongbao.file.yb.com/';//文件服务器访问路径 开发

    //static APP_SERVE_URL = 'http://127.0.0.1:8080/app';//请求路径 本地环境
    static FILE_SERVE_URL = 'http://dev.sutongbao.file.yb.com/';//文件服务器访问路径 开发

    static APP_SERVE_URL = 'http://120.76.43.39:8091/api';//请求路径 测试环境
    //static FILE_SERVE_URL = 'http://test.sutongbao.file.yb.com/';//文件服务器访问路径 测试

    //static APP_SERVE_URL = 'http://104.37.212.152:8070/web';//请求路径 正式环境
    //static FILE_SERVE_URL = 'http://104.37.212.152:9999/';//文件服务器访问路径 正式
    //static APP_SERVE_URL = '/api/web';//请求路径 prod环境

    static DEFAULT_AVATAR = '/assets/images/avatar.png';//用户默认头像
    static PAGE_SIZE = 15;//默认分页大小

    constructor() {
    }

    /**
    * 保存对象到session
    */
    static setObject(key:string,val:any){
        sessionStorage.setItem(key,JSON.stringify(val));
    }

    /**
    * 从session中获取对象
    */
    static getObject(key:string){
        let obj = sessionStorage.getItem(key);
        if(obj){
            return JSON.parse(obj);
        }else{
            return null;
        }
    }

    /**
    * 对象复制
    */
    static copyObject(value:any){
        var str = JSON.stringify(value);
        return JSON.parse(str);
    }

    /**
    *  显示加载中
    */
    static showLoading(){
        layer.load();
    }

    /**
    *  提示层信息
    */
    static show(msg:string){
        layer.msg(msg);
    }

    /**
    *  关闭加载中
    */
    static hideLoading(){
        layer.closeAll('loading');
    }

    /**
    * 格式“是”or“否”
    * @param value
    * @returns {string}
    */
    formatYesOrNo(value: string): string {
        return value == '10' ? '是' : (value == '20' ? '否' : null);
    }

    /**
    * 格式状态
    * @param value
    * @returns {string}
    */
    formatState(value: string): string {
        return value == '10' ? '正常' : (value == '20' ? '禁用' : '');
    }

    /**
    * 日期格式化
    * @param value
    */
    formatDate(value: number,sformat:string){
        return this.dateFormat(new Date(value),sformat);
    }


  /**
   * 格式化日期
   * sFormat：日期格式:默认为yyyy-MM-dd     年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date(),'yyyy-MM-dd')   "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')   "2017-02-28 09:24:00"
   * @example  dateFormat(new Date(),'hh:mm')   "09:24"
   * @param date 日期
   * @param sFormat 格式化后的日期字符串
   * @returns {String}
   */
  dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }

    /*======================验证===========================*/
    /**
    * 验证字符为空(true:为空|false:不为空)
    */
    static isEmpty(value:any): boolean {
        return value == null || typeof value === 'string' && $.trim(value).length === 0;
    }

    /**
    * 验证字符不能为空(true:不为空|false:为空)
    */
    static isNotEmpty(value:any): boolean {
        return !Utils.isEmpty(value);
    }

    /**
    * 手机号是否正确(true:正确|false:不正确)
    */
    static isMobile(value:any){
        return (/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(value));
    }

    /**
    * 邮箱是否正确(true:正确|false:不正确)
    */
    static isEmail(value:any){
        return ( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value));
    }

    /**
    * 验证是否是数字(true:是|false:否)
    */
    static isNumber(value:any){
        return !isNaN(value);
    }

}
