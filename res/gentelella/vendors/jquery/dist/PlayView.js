function trim(str)
{
	return (str || "").replace( /^\s+|\s+$/g, "" );
}

function validateInteger(value, label){
	if (value.length == 0 || isNaN(value)) {
		alert(label + "必须是一个整数.");
		return false;
	} else {
		var re = /^[0-9]+[0-9]*]*$/;   //判断正整数 
		if (!re.test(value)){
			alert(label + "必须是一个整数.");
	        return false;
	    }
		 
		var isNumber = false;
		for (var count = 0; count<value.length; count++) {
	       var code = value.charCodeAt(count);
	       if ((48 > code && code >57)) {
				alert(label + "必须是一个整数.");
				return false;
	       }
	   }
	}
	return true;
}
	
function validateIntegerRange(value, min, max, label) {
	if (value.length == 0 || isNaN(value)) {
		alert(label + "必须是一个整数.");
		return false;
	} else {
		var re = /^[0-9]+[0-9]*]*$/;   //判断正整数 
		if (!re.test(value)){
			alert(label + "必须是一个整数.");
	        return false;
	    }
		 
		var isNumber = false;
		for (var count = 0; count<value.length; count++) {
	       var code = value.charCodeAt(count);
	       if ((48 > code && code >57)) {
				alert(label + "必须是一个整数.");
				return false;
	       }
	   }
	}
	if (value < min || value > max){
		alert(label + "的取值范围:在" + min + "-" + max + "之间.");
		return false;
	}
	return true;
}

function validateAddress(ipAddress) {
	if (ipAddress.length == 0) {
		alert("IP地址不能为空！");
		return false;
	}
	var tokens = trim(ipAddress).split(".");
	if (tokens.length < 4 || tokens.length > 4) {
		alert("IP地址输入不正确！");
		return false;
	}
	if (tokens[0] == 0)
	{
	    alert("IP地址输入不正确！");
		return false;
	}
	for (var k=0; k<4; k++) {
		if (isNaN(tokens[k])|| (tokens[k].length ==0) || (tokens[k].length >3) ||tokens[k]>255 || tokens[k]<0) {
			alert("IP地址输入不正确！");
			return false;
		}
		if (tokens[k].length > 1 && tokens[k].indexOf("0")==0) {
			alert("IP地址输入不正确！");
			return false;
		}
		if ((tokens[k].indexOf(" ")>-1)) {
			alert("IP地址输入不正确！");
			return false;
		}
	}
	return true;
}

    /*****实时预览******/
    function StartPlayView()
    {
        var OCXobj = document.getElementById("PreviewOcx");
		CameraID = document.getElementById("TextCameraId").value;
		if(!(parseInt(CameraID)>=1 && parseInt(CameraID)<=2147483647)){
		showMethodInvokedInfo("CameraID介于1到2147483647之间！");
		return;
	}
		//if(""==CameraID){
		//	alert("请选择一个监控点！");
		//	return;
		//}
		if (CameraID.length == 0 || isNaN(CameraID) || ""==CameraID) {
		showMethodInvokedInfo("请选择监控点，且监控点必须是一个整数！");
		//alert("必须是一个整数.");
		return ;
}
		var ret = OCXobj.StartTask_Preview(CameraID);
                //var ret1 = OCXobj.StartFreeWndByIndexCode("076a48e02668446d90ecfe54c1cab3af");
		switch(ret){
		case 0:
			showMethodInvokedInfo("StartTask_Preview接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("StartTask_Preview接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
		}
    }
    /*****指定窗口实时预览******/
    function StartPlayView_InWnd()
    {
        var OCXobj = document.getElementById("PreviewOcx");
		CameraID = document.getElementById("TextCameraId").value;
		WndIndex = document.getElementById("SelectWnd").value;
		WndNum=OCXobj.GetWndNum();
		if(WndIndex>=WndNum){
			if(WndIndex>3&&WndIndex<=8){
				OCXobj.SetWndNum(9); 
			}else if(WndIndex>9&&WndIndex<=15){
				OCXobj.SetWndNum(16);
			}else{
				OCXobj.SetWndNum(25);
			}
		}
          if(""==CameraID){
			alert("请选择一个监控点！");
			return;
		}
		if (CameraID.length == 0 || isNaN(CameraID)) {
		alert("必须是一个整数.");
		return ;
		}
		var ret = OCXobj.StartTask_Preview_InWnd(CameraID,WndIndex);
		switch(ret){
		case 0:
			showMethodInvokedInfo("GetWndNum、SetWndNum、StartTask_Preview_InWnd接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("StartTask_Preview_InWnd接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
		}
    }
    /*****空闲窗口实时预览******/
    function StartPlayView_Free()
    {
        var OCXobj = document.getElementById("PreviewOcx");
		CameraID = document.getElementById("TextCameraId").value;
          if(""==CameraID){
			alert("请选择一个监控点！");
			return;
		  }
		  if (CameraID.length == 0 || isNaN(CameraID)) {
		  alert("必须是一个整数.");
		  return ;
		  }
		var ret = OCXobj.StartTask_Preview_FreeWnd(CameraID);
		switch(ret){
		case 0:
			showMethodInvokedInfo("StartTask_Preview_FreeWnd接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("StartTask_Preview_FreeWnd接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
		}
}
/*****根据索引预览******/
function StartPreviewByIndexCode() {
    var OCXobj = document.getElementById("PreviewOcx");
    CameraIndex = document.getElementById("CamerIndexCode").value
    if ("" == CameraIndex) {
        alert("请选择一个监控点！");
        return;
    }
    var ret = OCXobj.StartPreviewByIndexCode(CameraIndex);
    switch(ret) {
    case 0:
        showMethodInvokedInfo("StartPreviewByIndexCode接口调用成功！");
    	break;
    case -1:
        showMethodInvokedInfo("StartPreviewByIndexCode接口调用失败！错误码：" + OCXobj.GetLastError());
    	break;
    default:
        break;
    }
    }
    /*****根据索引指定预览******/
    function StartInWndByIndexCode() {
        var OCXobj = document.getElementById("PreviewOcx");
        CameraIndex = document.getElementById("CamerIndexCode").value;
        WndIndex = document.getElementById("IndexCodePreview").value;
        WndNum = OCXobj.GetWndNum();
        if (WndIndex >= WndNum) {
            if (WndIndex > 3 && WndIndex <= 8) {
                OCXobj.SetWndNum(9);
            } else if (WndIndex > 9 && WndIndex <= 15) {
                OCXobj.SetWndNum(16);
            } else {
                OCXobj.SetWndNum(25);
            }
        }
        if ("" == CameraIndex) {
            alert("请选择一个监控点！");
            return;
        }
        var ret = OCXobj.StartInWndByIndexCode(WndIndex, CameraIndex);
        switch (ret) {
            case 0:
                showMethodInvokedInfo("GetWndNum、SetWndNum、StartInWndByIndexCode接口调用成功！");
                break;
            case -1:
                showMethodInvokedInfo("StartInWndByIndexCode接口调用失败！错误码：" + OCXobj.GetLastError());
                break;
            default:
                break;
        }
    }
    /*****根据索引空闲预览******/
    function StartFreeWndByIndexCode() {
        var OCXobj = document.getElementById("PreviewOcx");
        CameraIndex = document.getElementById("CamerIndexCode").value;
        if ("" == CameraIndex) {
            alert("请选择一个监控点！");
            return;
        }
        var ret = OCXobj.StartFreeWndByIndexCode(CameraIndex);
        switch (ret) {
            case 0:
                showMethodInvokedInfo("StartFreeWndByIndexCode接口调用成功！");
                break;
            case -1:
                showMethodInvokedInfo("StartFreeWndByIndexCode接口调用失败！错误码：" + OCXobj.GetLastError());
                break;
            default:
                break;
        }
    }
    /*****停止所有预览******/
    function StopPlayView()
    {
        var OCXobj = document.getElementById("PreviewOcx");
        var ret = OCXobj.StopAllPreview();
		switch(ret){
		case 0:
			showMethodInvokedInfo("StopPlayView接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("StopPlayView接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
		}
    }

     /*****停止某一窗口预览*****/
     function StopPreviewInWnd()
     {
	 WndIndex = document.getElementById("StopWnd").value;
 	 var OCXobj = document.getElementById("PreviewOcx");
	 var ret = OCXobj.StopPreview(WndIndex);
         switch(ret){
         case 0:
                showMethodInvokedInfo("StopPreviewInWnd接口调用成功！");
                break;
         case -1:
                showMethodInvokedInfo("StopPreviewInWnd接口调用失败！错误码："+ OCXobj.GetLastError());
                break;
         default:
                break;
         }
     }

/******得到窗口数目******/
function GetWndNum()
{
    var OCXobj = document.getElementById("PreviewOcx");
    WndNum = OCXobj.GetWndNum();
    document.getElementById("TextGetWindowNum").value = WndNum;
}

function SetWndNum()
{
   var OCXobj = document.getElementById("PreviewOcx");
   var WndNum = document.getElementById("TextSetWindowNum").value;
   if (WndNum == "") {
       alert("请设置窗口数目");
       return;
   }
   OCXobj.SetWndNum(WndNum);
}

function PTZControl(funcName){
	var OCXobj = $("#PreviewOcx").get(0);
	if(OCXobj == null){
		alert("控件未安装！");
		return;
	}else{
		var res = null;
		switch(funcName){
			case "PTZLeftUp":
				res = OCXobj.StartTask_PTZ(25,4);	//云台：左上
				break;
			case "PTZUp":
				res = OCXobj.StartTask_PTZ(21,4);	//云台：上
				break;
			case "PTZRightUp":
				res = OCXobj.StartTask_PTZ(26,4);	//云台：右上
				break;
			case "PTZLeft":
				res = OCXobj.StartTask_PTZ(23,4);	//云台：左
				break;
			case "PTZAuto":
				res = OCXobj.StartTask_PTZ(29,4);	//云台：自转
				break;
			case "PTZRight":
				res = OCXobj.StartTask_PTZ(24,4);	//云台：右
				break;
			case "PTZLeftDown":
				res = OCXobj.StartTask_PTZ(27,4);	//云台：左下
				break;
			case "PTZDown":
				res = OCXobj.StartTask_PTZ(22,4);	//云台：下
				break;
			case "PTZRightDown":
				res = OCXobj.StartTask_PTZ(28,4);	//云台：右下
				break;
			case "PTZStop":
				res = OCXobj.StartTask_PTZ(1,4);	//云台：停止
				break;
			case "PTZAddTimes":
				res = OCXobj.StartTask_PTZ(11,4);	//云台：焦距+
				break;
			case "PTZMinusTimes":
				res = OCXobj.StartTask_PTZ(12,4);	//云台：焦距-
				break;
			case "PTZFarFocus":
				res = OCXobj.StartTask_PTZ(13,4);	//云台：焦点+
				break;
			case "PTZNearFocus":
				res = OCXobj.StartTask_PTZ(14,4);	//云台：焦点-
				break;
			case "PTZLargeAperture":
				res = OCXobj.StartTask_PTZ(15,4);	//云台：光圈+
				break;
			case "PTZSmallAperture":
				res = OCXobj.StartTask_PTZ(16,4);	//云台：光圈-
				break;
		}
		
		if(res == 0){
			showMethodInvokedInfo("StartTask_PTZ接口调用成功！");
		}else{
			showMethodInvokedInfo("StartTask_PTZ接口调用失败！错误码：" + OCXobj.GetLastError());
		}
	}
}
    
    /*****云台：调用预置点******/
    function GetPt()
    {
        var OCXobj = document.getElementById("PreviewOcx");
        var ptNum = document.getElementById("usePreset").value;
		if(isNaN(ptNum)){
			showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
			return;
		}
		var tempPtNum = parseInt(ptNum);
		if(!(tempPtNum>=0&&tempPtNum<=999)){
			showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
			return;
		}
        var ret = OCXobj.PTZCtrlGotoPreset(ptNum); 
        switch(ret){
		case 0:
			showMethodInvokedInfo("PTZCtrlGotoPreset接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("PTZCtrlGotoPreset接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
		}      
    }
    /*****云台：设置预置点******/
    function SetPt()
    {
        var OCXobj = document.getElementById("PreviewOcx");
        var ptNum = document.getElementById("setPreset").value;
		if(isNaN(ptNum)){
			showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
			return;
		}
		var tempPtNum = parseInt(ptNum);
		if(!(tempPtNum>=0&&tempPtNum<=999)){
			showMethodInvokedInfo("参数错误：预置点是介于0到999之间的整数！");
			return;
		}
        var ret = OCXobj.PTZCtrlSetPreset(parseInt(ptNum));
        switch(ret){
		case 0:
			alert("预置点设置成功！");
			showMethodInvokedInfo("PTZCtrlSetPreset接口调用成功！");
			break;
		case -1:
			alert("预置点设置失败！");
			showMethodInvokedInfo("PTZCtrlSetPreset接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
		}      
    }
    /*****获取视频参数******/
    function GetVideoEffect()
    {
        var OCXobj = document.getElementById("PreviewOcx");
        retXML = OCXobj.GetVideoEffect();
		if(""==retXML){
			alert("获取参数失败！");
			showMethodInvokedInfo("GetVideoEffect接口调用失败！错误码："+ OCXobj.GetLastError())
			return;
		}
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(retXML);
        document.getElementById("TextBright").value = xmlDoc.documentElement.childNodes[0].childNodes[0].nodeValue;
        document.getElementById("TextConstrast").value = xmlDoc.documentElement.childNodes[1].childNodes[0].nodeValue;
        document.getElementById("TextSaturation").value = xmlDoc.documentElement.childNodes[2].childNodes[0].nodeValue;
        document.getElementById("TextHue").value = xmlDoc.documentElement.childNodes[3].childNodes[0].nodeValue;
		showMethodInvokedInfo("GetVideoEffect接口调用成功！");
    }
    /*****设置视频参数******/
    function SetVideoEffect()
    {
        var OCXobj = document.getElementById("PreviewOcx");
        BrightValue = document.getElementById("TextBright").value;
        ContrastValue = document.getElementById("TextConstrast").value;
        SaturationValue = document.getElementById("TextSaturation").value;
        HueValue = document.getElementById("TextHue").value;
		var validateRes = validateIntegerRange(BrightValue,1,10,'亮度') 
							& validateIntegerRange(ContrastValue,1,10,'对比度')
							& validateIntegerRange(SaturationValue,1,10,'饱和度')
							& validateIntegerRange(HueValue,1,10,'色调');
		if(!validateRes){
			return;
		}
                var iRet = OCXobj.SetVideoEffect(parseInt(BrightValue),parseInt(ContrastValue),parseInt(SaturationValue),parseInt(HueValue));
                switch (iRet)
                {
                  case 0:
                         alert("设置成功！");
		         showMethodInvokedInfo("SetVideoEffect接口调用成功！");
                         break;
                  case -1:
                         alert("设置失败！");
                         showMethodInvokedInfo("SetVideoEffect接口调用失败！错误码：" + OCXobj.GetLastError());
                }
    }
    
/*****登录CMS******/
function loginCMS(){
	var userName=document.getElementById("TextName").value;
	var pw=document.getElementById("TextPwd").value;
	var ipAdd=document.getElementById("TextIP").value;
	var port=document.getElementById("TextPort").value;
	//if(!validateAddress(ipAdd))
	//{
	//	return;
	//}
	//if(""==port){
	//	alert("端口号不能为空！");
	//	return;
	//}
	if(!validateInteger(port,"端口"))
	{
		return;
	}
	if(!(parseInt(port)>=0 && parseInt(port)<=2147483647)){
		showMethodInvokedInfo("端口号介于0到2147483647之间！");
		return;
	}
	//if(!validateIntegerRange(port,1,65535,"端口"))
	//{
	//	return;
	//}
	//if(""==userName){
	//	alert("用户名不能为空！");
	//	return;
	//}if(""== pw){
	//	alert("密码不能为空！");
	//	return;
	//}
	var OCXobj = document.getElementById("PreviewOcx");
	//var ret=OCXobj.LoginCMS(userName,pw,ipAdd,port);
	//var ret=OCXobj.Login_V11(userName,pw,ipAdd,port,$("input:[name='dataFetchType']:radio:checked").val());
	var ret=OCXobj.Login(ipAdd,port,userName,pw);
	switch(ret){
	    case 0:
	        //initCameraList();
	        //initTree();
	        clearTree();
	        //alert("登录成功！");
	        showMethodInvokedInfo("Login,GetResourceInfo 接口调用成功！");
	        break;
		case -1:
			clearTree();
			alert("登录失败！");
			showMethodInvokedInfo("Login接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
	}
	
}

/*****登出CMS******/
function logoutCMS(){
	var OCXobj = document.getElementById("PreviewOcx");
	//var ret=OCXobj.LogoutCMS();
	var ret = OCXobj.Logout();
	switch(ret){
		case 0:	
		    OCXobj.StopAllPreview();
			document.getElementById("TextPwd").value="";
			init();
			//alert("退出成功！");
			$("#TextInfo").html("Logout,StopAllPreview接口调用成功！\r");
			break;
		case -1:
			//alert("退出失败！");
			showMethodInvokedInfo("Logout接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
	}
}
    
/*****初始化监控点列表**************/
function initCameraList(){
	var OCXobj = document.getElementById("PreviewOcx");
	var xmlStr=OCXobj.GetResourceInfo(4);
	var htmlStr="";
	var xmldom=getXmlDomFromStr(xmlStr);
	$(xmldom).find("CameraInfo").each(function() {
	htmlStr += "<li ondblclick='startPreview(" + $(this).find("CameraID").text() + ");' onMouseDown='setCameraIndexCode(\"" + $(this).find("CameraIndexCode").text() + "\");' onMouseUp='setCameraId(" + $(this).find("CameraID").text() + ");'><a href='#' style='text-decoration:none'>" + $(this).find("CameraName").text() + "</a></li>" ;
    });
	$("#tree").html(htmlStr); 
}

function initTree(){
	var OCXobj = document.getElementById("PreviewOcx");
	$("#tree").html("");

	//初始化中心节点
	var xmlStr = OCXobj.GetResourceInfo(1);
	var orderdCellIds = initControlUnitNodes(xmlStr);
	
	//初始化区域节点
	if(orderdCellIds.length > 0){
		xmlStr = OCXobj.GetResourceInfo(2);
		var regionIds = initRegionNodes(xmlStr, orderdCellIds);
		
		//初始化监控点节点
		if(regionIds.length > 0){
			xmlStr = OCXobj.GetResourceInfo(4);
			initCameraNodes(xmlStr, regionIds);
		}
	}
	
	$("#tree a").click(function(){
		//找到主菜单项对应的子菜单项
		$(this).next("ul").slideToggle();
		changeIcon($(this).parent("li"));
	});
}
function clearTree(){
	//var OCXobj = document.getElementById("PreviewOcx");
	$("#tree").html("");
}
/**
 * 初始化中心节点
 * @param {} xmlStr
 * @return {}
 */
function initControlUnitNodes(xmlStr){
	var xmldom=getXmlDomFromStr(xmlStr);
	
	//CtrlCell的jQuery对象数组
	var ctrlCells = new Array();
	var orderdCellIds = new Array();
	$(xmldom).find("SubUnitInfo").each(function() {
		ctrlCells.push($(this));
	});
	if(ctrlCells.length > 0){
		var rootUnit = ctrlCells[0];
		
		var curLevelCellIds = new Array();
		var parentCellId = 0;
		var curCellId = 0;
		curLevelCellIds.push($(rootUnit).find("ParentUnitID").text());
		//循环到ctrlCells中不再有任何元素
		while(ctrlCells.length>0){
			//本次for循环查找所用parentCellId
			parentCellId = curLevelCellIds.pop();
			
			//循环查找父中心Id=parentCellId的CtrlCell
			for(var i=0; i<ctrlCells.length; ){
			    if ($(ctrlCells[i]).find("ParentUnitID").text() == parentCellId) {
					//子中心Id入栈，下次for循环查找时作为parentCellId
			        curCellId = $(ctrlCells[i]).find("UnitID").text();
					curLevelCellIds.push(curCellId);
					orderdCellIds.push(curCellId);
					//添加子中心节点
					if($("#tree").html()==""){
					    $("#tree").html("<li class='control_unit_li'><a href='#'>" + $(ctrlCells[i]).find("UnitName").text() + "</a><ul id='ul_cell_" + curCellId + "'></ul></li>");
					}else{
						var expr = "#ul_cell_"+parentCellId;
						$(expr).append("<li class='control_unit_li'><a href='#'>" + $(ctrlCells[i]).find("UnitName").text() + "</a><ul id='ul_cell_" + curCellId + "'></ul></li>");
					}
					//从CtrlCell数组中删除已添加的CtrlCell
					ctrlCells.splice(i,1);
				}else{
					i++;
				}
			}
		}
	}
	return orderdCellIds;
}

/**
 * 将区域节点挂到各中心下
 * @param {} xmlStr
 * @param {} orderdCellIds
 * @return {}
 */
function initRegionNodes(xmlStr, orderdCellIds){
	var xmldom=getXmlDomFromStr(xmlStr);
	
	//alert(xmlStr);
	//Region的jQuery对象数组
	var regionIds = new Array();
	var regionsOff = new Array();
	var expr;
	for(var i=0; i<orderdCellIds.length; i++){
		var ctrlCellId = orderdCellIds[i];
		//查找中心下所有的区域
		$(xmldom).find("SubRegionInfo").each(function() {
			//该中心下的区域
		if ($(this).find("CtrlUnitID").text() == ctrlCellId) {
				//该中心下的一级区域
		    if ($(this).find("ParentRegID").text() == 0) {
					//将该中心下的一级区域直接挂到该中心下
					expr = "#ul_cell_" + ctrlCellId;
					$(expr).append("<li class='region_li'><a href='#'>" + $(this).find("RegionName").text() + "</a><ul id='ul_region_" + $(this).find("RegionID").text() + "'></ul></li>");
					//记录一级区域Id
					regionIds.push($(this).find("RegionID").text());
				}else{
					//该中心下的非一级区域入栈
					regionsOff.push(this);
				}
			}
		});

		while(regionsOff.length > 0){
			for(var j=0; j<regionsOff.length; ){
				var regionNode = regionsOff[j];
				expr = "#ul_region_" + $(regionNode).find("ParentRegID").text();
				if($(expr).length > 0){
				    $(expr).append("<li class='region_li'><a href='#'>" + $(regionNode).find("RegionName").text() + "</a><ul id='ul_region_" + $(regionNode).find("RegionID").text() + "'></ul></li>");
					regionsOff.splice(j,1);
					regionIds.push($(regionNode).find("RegionID").text());
				}else{
					j++;
				}
			}
		}
	}
	
	return regionIds;
}

/**
 * 将监控点节点挂到各区域下
 * @param {} xmlStr
 * @param {} regionIds
 */
function initCameraNodes(xmlStr, regionIds){
	var xmldom=getXmlDomFromStr(xmlStr);
	var expr;
	var cameras = $(xmldom).find("CameraInfo");
	for(var i=0; i<cameras.length; i++){
	    expr = "#ul_region_" + $(cameras[i]).find("RegionID").text();
	    $(expr).append("<li class='camera_li' ondblclick='startPreview(" + $(cameras[i]).find("CameraID").text() + ");' onMouseDown='setCameraIndexCode(\"" + $(cameras[i]).find("CameraIndexCode").text() + "\");' onMouseUp='setCameraId(" + $(cameras[i]).find("CameraID").text() + ");'><a href='#'>" + $(cameras[i]).find("CameraName").text() + "</a></li>");
	} 
}

	/*****************设置预览的cameraId**********************/
function setCameraId(cameraId) {
		document.getElementById("TextCameraId").value=cameraId;
	}
	/*****************设置预览的索引*************************/
	function setCameraIndexCode(cameraIndex) {
	    document.getElementById("CamerIndexCode").value=cameraIndex;
	}
    
/*****************调用预览**********************/
	function startPreview(cameraId) {
	var OCXobj = document.getElementById("PreviewOcx");
	var ret=OCXobj.StartTask_Preview_FreeWnd(cameraId);
	switch(ret){
	    case 0:
			showMethodInvokedInfo("StartTask_Preview_FreeWnd接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("StartTask_Preview_FreeWnd接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
}
}
    
var count=0;
function setWndMode(){
	var OCXobj = document.getElementById("PreviewOcx");
	var ret=OCXobj.SetWndMode((count++)%2);
	switch(ret){
		case 0:
			showMethodInvokedInfo("SetWndMode接口调用成功！");
			break;
		case -1:
			showMethodInvokedInfo("SetWndMode接口调用失败！错误码："+ OCXobj.GetLastError());
			break;
		default:
			break;
	}
}

/*****************本地参数设置******************/
function SetlocalParam(){
	var PicType = $("#SelectPicType").val();
	var PicPath = $("#TextPicPath").val();
	var PicCapType = $("#SelectCapMode").val();
	var PicSpanTime = $("#TextTimeSpan").val();
	var PicCounts = $("#TextCapCounts").val();
	//var minSpace4Pic = $("#MinDiskSpaceForCap").val();
	var RecordType = $("#RecordMode").val();
	var MaxRecordTimes = $("#TextMLongTime").val();
	var RecordTimes = $("#TextRecordIime").val();
    var RecordPath = $("#TextRecordPath").val();
    var RecordSize = $("#PreviewPkgSize").val();
    //var minSpace4Rec = $("#MinDiskSpaceForRec").val();
    if(PicPath=="" || RecordPath==""){
		alert("保存路径不能为空！");
	    return;
    }
    
	var OCXobj = document.getElementById("PreviewOcx");

	//设置图片保存路径和格式
	if (PicCapType == 1) {
	    if (PicCounts == "") {
	        PicCounts=1;
	    }
	    var iRet = OCXobj.SetCaptureParam(PicType, PicPath, PicCapType, 0, PicCounts);
	    switch (iRet) {
	        case -1:
	            showMethodInvokedInfo("SetCaptureParam接口调用失败！错误码：" + OCXobj.GetLastError());
	            break;
	        case 0:
	            showMethodInvokedInfo("SetCaptureParam接口调用成功！");
	            break;
	        default:
	            break;
	    }
	}
	else if (PicCapType == 0) {
	    if (PicCounts == "" || PicSpanTime == "") {
	        PicCounts=1000;
	    }
	    var iRet = OCXobj.SetCaptureParam(PicType, PicPath, PicCapType, PicSpanTime, PicCounts);
	    switch (iRet) {
	        case -1:
	            showMethodInvokedInfo("SetCaptureParam接口调用失败！错误码：" + OCXobj.GetLastError());
	            break;
	        case 0:
	            showMethodInvokedInfo("SetCaptureParam接口调用成功！");
	            break;
	        default:
	            break;
	    }
	}
    
    
    //设置保存图片磁盘空间最小值
    //OCXobj.SetPicDiskMinSize(minSpace4Pic);               //0813 zdy
    //showMethodInvokedInfo("SetPicDiskMinSize接口调用成功！"); //0813 zdy
   
       //设置录像保存路径和文件大小
        if (RecordType == 0) {
            if (MaxRecordTimes == "" || RecordTimes == "") {
				MaxRecordTimes=5;
				RecordTimes=5;
           
        }
        var iRet = OCXobj.SetRecordParam(RecordPath, 10, RecordTimes, RecordType);
            switch(iRet) {
                case -1:
                    showMethodInvokedInfo("SetRecordParam接口调用失败！错误码：" + OCXobj.GetLastError());
            	    break;
            	case 0:
            	    showMethodInvokedInfo("SetRecordParam接口调用成功！");
            	    break;
            	default:
            	    break;
            }
       }
       else if (RecordType == 1) {
            if (MaxRecordTimes == "") {
               MaxRecordTimes=5
            }
            var iRet = OCXobj.SetRecordParam(RecordPath, RecordSize, 10, RecordType);
            switch (iRet) {
                case -1:
                    showMethodInvokedInfo("SetRecordParam接口调用失败！错误码：" + OCXobj.GetLastError());
                    break;
                case 0:
                    showMethodInvokedInfo("SetRecordParam接口调用成功！");
                    break;
                default:
                    break;
            }
       }
    
    //设置录像磁盘空间最小值
    //OCXobj.SetRecordDiskMinSize(minSpace4Rec);
    //showMethodInvokedInfo("SetRecordDiskMinSize接口调用成功！");
}

function init(){
	$("#tree").html("");
	$("#TextInfo").html("");
	$("#MsgInfo").html("");
	//$("#TextPwd")[0].focus();
}

function showMethodInvokedInfo(msg){
	$("#TextInfo").prepend(msg+"\r");
}

function changeIcon(mainNode) {
	if (mainNode) {
		if (mainNode.css("background-image").indexOf("Control_area_exp.png") >= 0) {
			mainNode.css("background-image","url('../images/Control_area_col.png')");
		} else if (mainNode.css("background-image").indexOf("Control_area_col.png") >= 0) {
			mainNode.css("background-image","url('../images/Control_area_exp.png')");
		} else if (mainNode.css("background-image").indexOf("Area_exp.png") >= 0) {
			mainNode.css("background-image","url('../images/Area_col.png')");
		} else if (mainNode.css("background-image").indexOf("Area_col.png") >= 0) {
			mainNode.css("background-image","url('../images/Area_exp.png')");
		}
	}
}

function getXmlDomFromStr(xmlStr){
	var xmldom=null;
	if(navigator.userAgent.toLowerCase().indexOf("msie")!=-1){
		xmldom=new ActiveXObject("Microsoft.XMLDOM");
		xmldom.loadXML(xmlStr);
	}else{
		xmldom=new DOMParser().parseFromString(xmlStr,"text/xml");
	}
	return xmldom;
}