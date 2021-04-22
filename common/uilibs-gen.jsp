<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
	<!-- Bootstrap -->
    <link href="${gen}/vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="${gen}/vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="${gen}/vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="${gen}/vendors/iCheck/skins/flat/green.css" rel="stylesheet">
    <!-- bootstrap-progressbar
    <link href="${gen}/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet"> -->
    <!-- JQVMap -->
    <link href="${gen}/vendors/jqvmap/dist/jqvmap.min.css" rel="stylesheet"/>

	<!-- smartmenus -->
	<link href="${js}/smartmenus-0.9.7/jquery.smartmenus.bootstrap.css"></script>
    <!-- treeview Style -->
    <link href="${js}/treeview/bootstrap-treeview.min.css" rel="stylesheet">
    <!-- Custom Theme Style-->
    <link href="${gen}/build/css/custom.min.css" rel="stylesheet">
    <!-- bootstrap-wysiwyg -->
    <link href="${gen}/vendors/google-code-prettify/bin/prettify.min.css" rel="stylesheet">
    <!-- Select2 -->
    <link href="${gen}/vendors/select2/dist/css/select2.min.css" rel="stylesheet">
    <!-- message -->
    <link href="${res}/css/jquery.toastmessage.css" rel="stylesheet">    
    <!-- Switchery -->
    <link href="${gen}/vendors/switchery/dist/switchery.min.css" rel="stylesheet">
    <!-- starrr -->
    <link href="${gen}/vendors/starrr/dist/starrr.css" rel="stylesheet">
    <!-- Datatables -->
    <link href="${gen}/vendors/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="${gen}/vendors/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="${gen}/vendors/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="${gen}/vendors/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="${gen}/vendors/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">
	
	<!-- fileinput -->	
	<link href="${gen}/vendors/bootstrap-fileinput/fileinput.css" media="all" rel="stylesheet" type="text/css" />
	
	
    <!-- Dropzone -->
    <link href="${gen }/vendors/dropzone/dist/min/dropzone.min.css" rel="stylesheet">
    <!-- jQuery custom content scroller -->
    <link href="${gen}/vendors/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet"/>
	<!-- jQuery -->
	<script src="${gen}/vendors/jquery/dist/jquery.min.js"></script>
	<!-- 百度MapApi -->
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=n8DSDKS8sHrOCCb0yUIVWzkR"></script>
    <!-- js -->
	<script src="${js}/common.js"></script>
    
    <link href="${js}/jquery-confirm.min.css" rel="stylesheet">
    <link href="/ovu-pcos/js/angular.css" rel="stylesheet">
    <link href="/ovu-pcos/umeditor/themes/default/css/umeditor.css" type="text/css" rel="stylesheet">
    <link href="/ovu-pcos/res/js/jquery-address/css/jquery-address.css" rel="stylesheet">
<style>
<!--
/* .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover{
background-color: #1ABB9C;
border-color: #1ABB9C;
} */
html,body * {
	font-family: 微软雅黑;
}
.pagination{margin:0px;}
.pagination>li{cursor: pointer;}
body::-webkit-scrollbar,.modal::-webkit-scrollbar,.overflow-gen::-webkit-scrollbar{
	width: 6px;
	height: auto;
	background-color: #ffffff;
}
.nav.child_menu li{
	padding-left:12px;
}
/*定义滚动条轨道 内阴影+圆角*/
body::-webkit-scrollbar-track,.modal::-webkit-scrollbar-track,.overflow-gen::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	border-radius: 10px;
	background-color: #ffffff;
}
/*定义滑块 内阴影+圆角*/
body::-webkit-scrollbar-thumb,.modal::-webkit-scrollbar-thumb,.overflow-gen::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
	background-color: rgba(0, 0, 0, .2);
}
.modal{
	overflow-y: auto; 
}
-->
</style>
<script>
//获取数据字典的信息
function getDictValue(e,dictJson){
    for (var i = 0, l = dictJson.length; i < l; i++) {
        if (dictJson[i].id == e.value) return dictJson[i].text;
    }
    return "";
}
//******************页面组件权限控制*****start********************
//组件权限控制
function renderPageControls(){
	var controls = [];
	$(".sys-permission").each(function(){
		var classstr = $(this).attr("class");
		var domid = $(this).attr("id");
		classstr = classstr.split(" ");
		for(var i=0;i<classstr.length;i++){
			if(typeof classstr[i] == 'string' 
					&& classstr[i]!="sys-permission" 
					&& classstr[i].indexOf("sys-permission")>=0){
				var pkey = classstr[i].substring(15);
				if(pkey && pkey.length>0)controls.push(pkey);
				break;
			}
		}
	});
	getPageComponents("${sys_pagecontrols}",controls);
	
}
//设置页面控件可用状态  componentsProperty后台传递的权限字符串   components页面设置的可控组件([{id:所属权限描述字段,name:控件名},{..}])
function getPageComponents(componentsProperty,components){
	//console.log("componentsProperty>>>>"+componentsProperty);
	var c = componentsProperty.split(',');
	if(componentsProperty == "all"){
		return;
	}
	if(components && components.length > 0){
		for(var i=0;i<components.length;i++){
			if(componentsProperty.indexOf(components[i])!=-1){
				continue;
			}else{
				if(components[i] && components[i]!=""){
					$(".sys-permission-"+components[i]).remove();
				}
			}
		}
	}
}
//******************页面组件权限控制*******end******************
/**
 * 判断用户登录状态
 */
function checkLoginStatus(){
	if("${login_user}"=="" && "${session_login_member}"==""){
		return false;
	}else{
		return true;
	}
}
$(function(){
	renderPageControls();
});
</script>
<!-- page specific plugin scripts -->
