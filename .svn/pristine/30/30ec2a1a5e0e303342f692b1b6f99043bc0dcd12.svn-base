<%@ page language="java" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="res" value="${ctx}/res"/>
<c:set var="css" value="${res}/css"/>
<c:set var="img" value="${res}/img"/>
<c:set var="js" value="${res}/js"/>
<c:set var="gen" value="${res}/gentelella"/>  
<c:set var="systitle" value="OVU" /><!-- ${projectName } -->
<meta content="${projectName}" name="keywords">
<meta name="description" content="武汉技联运动信息技术有限公司" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- Meta, title, CSS, favicons, etc. -->
<meta charset="utf-8">
<meta name=”renderer” content=”webkit” />
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="Shortcut Icon" href="${res }/favicon.ico" />
<script>

var CONST_EXPORT_URL = "${ctx}/export/run.do";
var CONST_PROJECT = {
		rootPath : "${ctx}/",//项目根目录
		ueditorPath : "${ctx}/ueditor/",//ueditor路径
		ueditorResPath : "${ctx}/document/",//用于ueditor上传文件路径修正
		geoDataPath : "${res}/js/city.min.js",
		fullPath : "http://182.92.107.223:8686/ovu-pcos",//域名路径
		uploadFileMaxSize: "10MB",//上传图片最大尺寸
		uploadFileMaxNumber:5,//上传图片最大数量
		nullimgpath:'${img}/nullimg.png'//图片不存在备用路径
}
if (!window.console || !console.log){
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i){
        window.console[names[i]] = function() {};
    }
}
</script>