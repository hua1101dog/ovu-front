/**
 * 在框架页载入页面
 * @param id
 * @param url
 */
function loadPage(id, url) {
    $.ajaxSetup({cache:false});
    $("#" + id).hide().load(url, function () {
        $(this).fadeIn(300);
    });
}
/**
 * 改写url加入?key=value
 * @param destiny
 * @param par
 * @param par_value
 * @returns {String}
 */
function changeURLPar(destiny, par, par_value) {
    var pattern = par+'=([^&]*)';
    var replaceText = par+'='+par_value;
    if (destiny.match(pattern)) {
        var tmp = '/\\'+par+'=[^&]*/';
        tmp = destiny.replace(eval(tmp), replaceText);
        return (tmp);
    } else {
        if (destiny.match('[\?]')) {
            return destiny+'&'+ replaceText;
        } else {
            return destiny+'?'+replaceText;
        }
    }
    return destiny+'\n'+par+'\n'+par_value;
}

/**
 * 删除左右两端的空格
 * @param str
 * @returns
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 删除左边的空格
 * @param str
 * @returns
 */
function ltrim(str) {
    return str.replace(/(^\s*)/g, "");
}
/**
 * 删除右边的空格
 * @param str
 * @returns
 */
function rtrim(str) {
    return str.replace(/(\s*$)/g, "");
}

/**
 * 与Cookies有关的方法
 * author:shaojiang
 */
var Cookies = {};
//设置Cookies
Cookies.set = function(name, value ,expires){
     var argv = arguments;
     var argc = arguments.length;
     var expires = (argc > 2) ? argv[2] : null;
     var path = (argc > 3) ? argv[3] : '/';
     var domain = (argc > 4) ? argv[4] : null;
     var secure = (argc > 5) ? argv[5] : false;
     document.cookie = name + "=" + escape (value) +
       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
       ((path == null) ? "" : ("; path=" + path)) +
       ((domain == null) ? "" : ("; domain=" + domain)) +
       ((secure == true) ? "; secure" : "");
};
//读取Cookies	     
Cookies.get = function(name){
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while(i < clen){
        j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if(i == 0)
            break;
    }
    return null;
};	   
//清除Cookies	     
Cookies.clear = function(name) {
  if(Cookies.get(name)){
    var expdate = new Date(); 
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
    Cookies.set(name, "", expdate); 
  }
};
//获取Cookies值
Cookies.getCookieVal = function(offset){
   var endstr = document.cookie.indexOf(";", offset);
   if(endstr == -1){
       endstr = document.cookie.length;
   }
   return unescape(document.cookie.substring(offset, endstr));
};
