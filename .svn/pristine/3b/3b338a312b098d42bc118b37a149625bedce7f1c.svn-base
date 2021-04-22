//editor控件中checkbox的属性设置
var EDITOR_OPTIONS_CHECKBOX = {on:'1',off:'0'};

$.fn.serializeJson= function (){
	var serializeObj={};
	$( this .serializeArray()).each( function (){
	serializeObj[ this .name]= this .value;
	});
	return serializeObj;
};
//******************根据字符串创建并返回日期对象*************
function createDateFormat(dateStr,format){
	if(format && format != ''){
		return new Date(dateStr.substring(0,format.length));
	}else{
		return new Date(dateStr.substring(0,10));//默认yyyy-MM-dd
	}
}
//扩展时间类 添加月份
Date.prototype.addMonth = Date.prototype.addMonth || function(month){
	this.setMonth(this.getMonth() + month);
	return this;
}
//扩展时间类 添加月份
Date.prototype.addDays = Date.prototype.addDays || function(day){
	this.setDate(this.getDate() + day);
	return this;
}

//调用数据导出功能
function exprotXLS(filename,sql,params,titles,fields){
	sql=fmtUrlParam(sql);
	params=fmtUrlParam(params);
	titles=fmtUrlParam(titles);
	fields=fmtUrlParam(fields);
	
	var path = CONST_EXPORT_URL + "?fileName="+filename
			+"&params="+params+"&sql="+sql
			+"&titles="+titles+"&fields="+fields;
	var ifrm = $("<iframe/>");
	$(ifrm).css("display","none");
	$(ifrm).attr("src",path);
	$('body').append(ifrm);
}
//跳转页面
function toPage(url,isnew){
	if(!isnew){
		window.location.href = url;
	}else{
		window.open(url);
	}
}
//格式化url中的参数str
function fmtUrlParam(str){
	str=str.replace(/\%/g,"%25");
	str=str.replace(/\#/g,"%23");
	str=str.replace(/\&/g,"%26");
	str=str.replace(/\ /g,"%20");
	return str;
}
function parseDate(val,fmt){
	if(!fmt || fmt=='')fmt="yyyy-MM-dd";
	var y = '';
	var M = '';
	var d = '';
	var h = '';
	var m = '';
	var s = '';
	for(var i=0;i<fmt.length,i<val.length;i++){
		var fm = fmt.substring(i,i+1);
		var v = val.substring(i,i+1);
		switch(fm){
		case "y":y+=v;
			break;
		case "M":M+=v;
			break;
		case "d":d+=v;
			break;
		case "h":h+=v;
			break;
		case "H":h+=v;
			break;
		case "m":m+=v;
			break;
		case "s":s+=v;
			break;
		}
	}
	//if(y==""||M==""||d==""){
	//	return new Date();
	//}
	var now = new Date();
	if(y=="")y=now.getFullYear();
	if(M=="")M="1";
	if(d=="")d="1";
	if(h=="")h="0";
	if(m=="")m="0";
	if(s=="")s="0";
	return new Date(parseInt(y,10),parseInt(parseInt(M,10)-1,10),parseInt(d,10),parseInt(h,10),parseInt(m,10),parseInt(s,10));
}

/**  
 * Simple Map  
 *   
 *   
 * var m = new Map();  
 * m.put('key','value');  
 * ...  
 * var s = "";  
 * m.each(function(key,value,index){  
 *      s += index+":"+ key+"="+value+"/n";  
 * });  
 * alert(s);  
 *   
 * @author Neo  
 * @date 2013-11-24
 */  
function Map() {   
    /** 存放键的数组(遍历用到) */  
    this.keys = new Array();   
    /** 存放数据 */  
    this.data = new Object();   
       
    /**  
     * 放入一个键值对  
     * @param {String} key  
     * @param {Object} value  
     */  
    this.put = function(key, value) {   
        if(this.data[key] == null){   
            this.keys.push(key);   
        }   
        this.data[key] = value;   
    };   
       
    /**  
     * 获取某键对应的值  
     * @param {String} key  
     * @return {Object} value  
     */  
    this.get = function(key) {   
        return this.data[key];   
    };   
       
    /**  
     * 删除一个键值对  
     * @param {String} key  
     */  
    this.remove = function(key) {   
        this.keys.remove(key);   
        this.data[key] = null;   
    };   
       
    /**  
     * 遍历Map,执行处理函数  
     *   
     * @param {Function} 回调函数 function(key,value,index){..}  
     */  
    this.each = function(fn){   
        if(typeof fn != 'function'){   
            return;   
        }   
        var len = this.keys.length;   
        for(var i=0;i<len;i++){   
            var k = this.keys[i];   
            fn(k,this.data[k],i);   
        }   
    };   
       
    /**  
     * 获取键值数组(类似Java的entrySet())  
     * @return 键值对象{key,value}的数组  
     */  
    this.entrys = function() {   
        var len = this.keys.length;   
        var entrys = new Array(len);   
        for (var i = 0; i < len; i++) {   
            entrys[i] = {   
                key : this.keys[i],   
                value : this.data[i]   
            };   
        }   
        return entrys;   
    };   
       
    /**  
     * 判断Map是否为空  
     */  
    this.isEmpty = function() {   
        return this.keys.length == 0;   
    };   
       
    /**  
     * 获取键值对数量  
     */  
    this.size = function(){   
        return this.keys.length;   
    };   
       
    /**  
     * 重写toString   
     */  
    this.toString = function(){   
        var s = "{";   
        for(var i=0;i<this.keys.length;i++,s+=','){   
            var k = this.keys[i];   
            s += k+"="+this.data[k];   
        }   
        s+="}";   
        return s;   
    };   
}   

/**
 * Set 实现去重数组
 * @returns {Set}
 */
function Set(){
	this.data = new Array();
	this.index = 0;
	this.hash = {};

	this.add = function(value) {
		var key = typeof(value) + value;
		if (this.hash[key]!==1)
		{
			this.data[this.index++] = value;
			this.hash[key]=1;
		}

	};

	this.size = function() {
		return this.index;
	};

	this.get = function(index){
		return this.data[index];
	};
}
