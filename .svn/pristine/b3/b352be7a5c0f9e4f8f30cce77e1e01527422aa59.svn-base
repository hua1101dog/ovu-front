(function() {
    var app = angular.module("angularApp");
    app.controller('messageCtrl',function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title ="OVU-通知管理";
        $scope.current=1;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.stateOut = [
            {
                value:0,text:"未发送"
            },
            {
                value:1,text:"已发送"
            }
        ];
        $scope.stateIn = [
            {
                value:0,text:"未查看"
            },
            {
                value:1,text:"已查看"
            }
        ]
        // 查看外部消息
        $scope.find = function(pageNo){
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/parkMessage/list",$scope.search,function(resp){
                $scope.pageModel = resp;
            });
        };
        $scope.search2 = {
            readStatus:0
        };
        $scope.pageModel = {};





        
        // 查看外部消息
        $scope.find2 = function(pageNo){
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search2,{
                currentPage:pageNo||$scope.pageModel.currentPage||1,
                pageSize:$scope.pageModel.pageSize||10});
            $scope.search2.pageIndex = $scope.search2.currentPage-1;
            $scope.search2.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/customerMessage/list",$scope.search2,function(resp){
                $scope.pageModel = resp;
            });
        };
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find(1);
            })
        });
        $scope.query = function(){
        	fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        $scope.del= function(ids){
            $.post("/ovu-park/backstage/parkMessage/remove",{ids: ids},function(resp){
                if(resp.code == 0){
                    window.msg("删除成功!");
                    $scope.find();
                }else{
                    window.alert(resp.message);
                }
            });
        };

        $scope.send= function(ids){
            $.post("/ovu-park/backstage/parkMessage/send",{ids: ids, optUserId: app.user.id},function(resp){
                if(resp.code == 0){
                    window.msg("发送成功!");
                    $scope.find();
                }else{
                    window.msg(resp.message);
                }
            });
        };

        //批量操作
        $scope.batchOpt = function(pageModal, optType){
            var showStr = optType == "del" ? "删除" : "发送";
            var ids="";
            confirm("确定"+showStr+"所选择通知吗?",function(){
                var datas = pageModal.data;
                for(var i=0; i<datas.length;i++){
                    if(datas[i].checked && datas[i].sendStatus != 1){//过滤掉已发送的通知
                        ids += datas[i].id;
                        if(i<datas.length-1){
                            ids += ",";
                        }
                    }
                }

                if(optType == "del"){
                    if(ids == ""){
                        window.alert("没有可供删除的未发送消息!");
                        return false;
                    }
                    $scope.del(ids);
                }else if(optType == "send"){
                    if(ids == ""){
                        window.alert("没有未发送的消息!");
                        return false;
                    }
                    $scope.send(ids);
                }
            });
        };
        
        //删除通知信息
        $scope.delItem= function(message){
            confirm("确定删除 ["+message.title+"]",function(){
                $scope.del(message.id);
            })
        };
        
        //发送通知信息
        $scope.sendItem= function(message){
            var to = "";
            if(message.sendType == 0) {
                to="全部企业";
            } else if(message.sendType == 1) {
                to=message.sendCustomerNames;
            }
            confirm("确定发送["+message.title+"]给" + to,function(){
                $scope.send(message.id);
            })
        };

        $scope.showEditModal = function (message) {
        	// if(!app.park){
			// 	window.msg("请先选择一个项目!");
			// 	return false;
			// }
        	message = message || {sendType:0, creatorId : app.user.id};
        	// message.parkId = app.park.parkId;
        	message.updatorId = app.user.id;
            var E;
            var editor;
            var copy = angular.extend({},message);
            if(fac.isEmpty(message.sendCustomers)){
            	var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/integratManage/messageManage/modal.addNotice.html',
                    controller: 'addNoticeCtrl'
                    , resolve: {message: copy},
                    backdrop: 'static',
                    keyboard: false
                });
                modal.rendered.then(function(){
                    //初始化UM
                    E = window.wangEditor;
                    editor = new E('#editor');
                    editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                    editor.create();
                    if(message.content){
                    	/*
                         um.ready(function(){
                            um.setContent(message.content);
                        });
                        */
                        editor.txt.html(message.content);
                    }
                    //初始化发送类型
                    if(message.sendType == 0){
                        $(".chooseCompanyPanle").css("display", "none");
                    }else{
                        $(".chooseCompanyPanle").css("display", "block");
                        //TODO 初始化发送企业
                        if(resp.data && resp.data.length > 0){
                            var cNames = "";
                            for(var i=0; i<resp.data.length;i++){
                                cNames += resp.data[i].customerName;
                                if(i < resp.data.length-1){
                                    cNames += ",";
                                }
                            }

                            $(".chooseCompanyPanle input").val(cNames);
                        }
                    }
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    // console.info('Modal dismissed at: ' + new Date());
                });
            }else{
            	$.post("/ovu-base/ovupark/backstage/customer/getUserListByIds", {'loginId':message.sendCustomers}, function(resp){
            		if(resp.code == 0){
                        copy.customers = resp.data;
                    }else{
                        copy.customers = [];
                    }
                    var modal = $uibModal.open({
                        animation: false,
                        size: 'lg',
                        templateUrl: '/view/integratManage/messageManage/modal.addNotice.html',
                        controller: 'addNoticeCtrl'
                        , resolve: {message: copy},
                        backdrop: 'static',
                        keyboard: false
                    });
                    modal.rendered.then(function(){
                        //初始化UM
                        E = window.wangEditor;
                        editor = new E('#editor');
                        editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                        editor.create();
                        if(message.content){
                        	/*
                             um.ready(function(){
                                um.setContent(message.content);
                            });
                            */
                            editor.txt.html(message.content);
                        }
                        //初始化发送类型
                        if(message.sendType == 0){
                            $(".chooseCompanyPanle").css("display", "none");
                        }else{
                            $(".chooseCompanyPanle").css("display", "block");
                            //TODO 初始化发送企业
                            if(resp.data && resp.data.length > 0){
                                var cNames = "";
                                for(var i=0; i<resp.data.length;i++){
                                    cNames += resp.data[i].nickname;
                                    if(i < resp.data.length-1){
                                        cNames += ",";
                                    }
                                }

                                $(".chooseCompanyPanle input").val(cNames);
                            }
                        }
                    });
                    modal.result.then(function () {
                        $scope.find();
                    }, function () {
                        // console.info('Modal dismissed at: ' + new Date());
                    });
                });
            }
            
        };
        // 查看外部消息
        $scope.showLookModal = function (message) {
            message = message || {};
            //var um;
            var copy = angular.extend({},message);

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                templateUrl:'/view/integratManage/messageManage/modal.showNotice.html',
                controller: 'lookNoticeCtrl'
                , resolve: {message: copy}
            });
            modal.rendered.then(function(){
                if(message.content){
                    $(".showMessage").html(message.content);
                    $(".showMessage").find("a").click(function() {
                        $rootScope.target('operationManage/assetManage/assetManage','资产安全管理')
                        modal.dismiss('cancel');
                    })
                }
            });
        };
        // 查看内部消息
        $scope.showLookModal2 = function (message) {
            message = message || {};
            //var um;
            var copy = angular.extend({},message);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                templateUrl:'/view/integratManage/messageManage/modal.showNotice.html',
                controller: ['$scope','$rootScope','message','$uibModalInstance','$location',
                    function($scope,message,$uibModalInstance,$location){
                        $scope.item = message;
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $.post("/ovu-park/backstage/customerMessage/read", {id:message.id}, function(resp){
                            if(resp.code == 0){
                                // $scope.cancel();
                            }else{
                                alert(resp.message);
                            }
                        });
                        
                        $scope.goAssets = function(){
                            $rootScope.target('operationManage/assetManage/assetManage','资产安全管理')
                            //$location.path("/operationManage/assetManage/assetManage");
                            $scope.cancel()
                        }
                    }

                ]
                , resolve: {message: copy}
            });
            modal.result.then(function (result) {			
                $scope.find2();
            }, function (reason) {
                $scope.find2();
            });
            modal.rendered.then(function(){
                if(message.content){
                    $(".showMessage").html(message.content);
                    $(".showMessage").find("a").click(function() {
                        $rootScope.target('operationManage/assetManage/assetManage','资产安全管理')
                        modal.dismiss('cancel');
                    })
                }
            });
        };
    });

   app.filter("convertSendType",function(){//转换发送范围数字
        return function(value) {
            if(value == "0"){
                return "全部用户";
            } else if(value == "1"){
                return "指定用户";
            } else {
                return "--";
            }
        }
    });
   
    app.filter("convertSendStatus",function(){//转换发送状态数字
        return function(value) {
            if(value == "0"){
                return "未发送";
            } else if(value == "1"){
                return "已发送";
            } else {
                return "--";
            }
        }
    });

    app.filter("convertTitle",function(){//转换标题
        return function(title) {
        	if(angular.isUndefined(title) || title == ''){
        		title = '--';
        	}else{
                
        		if(title&&title.length > 16){
                    title = title.substring(0, 16) + "...";
                }
        	}
            return title;
        }
    });
    // 内部消息状态
    app.filter("readStatus",function(){//转换标题
        return function(value) {
            if(value == 0){
                return "未查看";
            } else if(value == 1){
                return "已查看";
            } else {
                return "未查看";
            }
        }
    });



    app.controller('addNoticeCtrl',function($scope, $http, $uibModalInstance, $filter, fac,message, $uibModal){
        $scope.item = message;
        $scope.selectedReceiver = '';
        var  temp = [];
        if($scope.item.sendType == 1){
        	$scope.customers = message.customers;
        	angular.forEach($scope.customers,function(customerObj){
        		temp.push(customerObj.nickname);
            });
        	$scope.selectedReceiver = temp.join(',');
        }
        
        $scope.sendTypeChange = function(sendType){
            if(sendType == "0"){
                $(".chooseCompanyPanle").css("display", "none");
            }else{
                $(".chooseCompanyPanle").css("display", "block");
            }
        };

        $scope.saveMessage = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            var content = $(".w-e-text").html()+"";
            if(!content || content== '<p><br></p>'){
                alert("通知内容不能为空!");
                return false;
            }
            $scope.item.content = content;
            $scope.item.parkId = app.park.parkId;
            $.post("/ovu-park/backstage/parkMessage/saveOrEdit", $scope.item, function(resp){
                if(resp.code == 0){
                    window.msg("操作成功!");
                    $uibModalInstance.close();
                }else{
                    alert(resp.message);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };


        






        $scope.chooseCompany= function () {
            var params = {
            	parkId : app.park.parkId,
                currentPage:1,
                pageSize:10,
                pageIndex:0
            };
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew",params,function(resp){
            	for(var i=0;i<resp.data.length;i++){
                    if($scope.item.sendCustomers && $scope.item.sendCustomers.indexOf(resp.data[i].id) != -1){
                    	resp.data[i].disabled = true;
                    }else{
                    	resp.data[i].disabled = false;
                    }
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'md',
                    templateUrl: '/view/integratManage/messageManage/modal.chooseCompany.html',
                    controller: 'chooseCompanyCtrl',
                    resolve: {chooseCompany: {pages:resp, customers:$scope.item.customers, ids:$scope.item.sendCustomers}}
                });
                modal.result.then(function (r) {
                    $scope.item.sendCustomers = r.pIds;
                    $scope.item.customers = r.tempAddedCustomers;
                    $(".chooseCompanyPanle input").val(r.pNames);
                    $scope.$applyAsync();

                }, function (reason) {
                    console.info('Modal chooseCompany dismissed at: ' + new Date());
                });
            });
            
        };
    });

    app.controller('lookNoticeCtrl',function($scope, $rootScope,$http, $uibModalInstance, $filter, fac,message, $uibModal,$location){
        $scope.item = message;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    app.controller('chooseCompanyCtrl',function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal){
        $scope.pageModel = chooseCompany.pages;
        $scope.customers = chooseCompany.customers;
        $scope.ids = chooseCompany.ids;
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            parkId : app.park.parkId,
            currentPage:1,
            pageSize:10,
            pageIndex:0,
            totalCount:0,
            nickname:"",
            userType:"",
        }
        $scope.userType = [
            {value:1,text:"个人用户"},
            {value:2,text:"企业用户"},
            {value:3,text:"员工用户"},
        ]
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew",$scope.search,function(cInfos){
                for(var i=0;i<cInfos.data.length;i++){
                    if($scope.ids && $scope.ids.indexOf(cInfos.data[i].id) != -1){
                        cInfos.data[i].disabled = true;
                    }else{
                        cInfos.data[i].disabled = false;
                    }
                }
                $scope.pageModel = cInfos;
                $scope.$applyAsync();
            });
        };

        $scope.query = function(){
        	$scope.pageModel.currentPage = 0;
        	$scope.pageModel.pageSize = 10;
        	$scope.pageModel.pageIndex = 0;
        	$scope.pageModel.totalCount = 0;
        	$scope.find();
        }
        $scope.removePersonItem = function(personId,personName){
            $("#selectTable  #"+personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #"+personId).removeAttr("disabled");
            $("#selectTable  #"+personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function(cus){
            $scope.removePersonItem(cus.id, cus.nickname);
            $("li[personId="+cus.id+"]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function(item, bool){
            // loginId
            var personId = item.id,
                personName = item.nickname;
            if($("#selectTable  #"+personId).attr("disabled") || $("#selectTable  #"+personId).attr("ng-disabled") == "true"){
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
           if($("#selectForm #PER_TYPE").val()=="1"){
               $(".ul-persons .item").each(function(){
                    var id=$(this).attr("personId");//获取原来的人员id
                    var name=$(this).attr("personName");//原来的人员姓名，状态改为可选
                    $("#selectTable  #"+id).removeAttr("disabled");
                    $(".ul-persons .item").remove();
               });
           }

            var li = $("<li ></li>");
            $(li).addClass("item");
            $(li).attr("personId",personId);
            $(li).attr("personName",personName);
            $(li).text(personName);
            var a = $('<a href="javascript:void(0);"></a>');
            $(a).append("<i class='fa fa-remove'></i>");
            $(li).append(a);
            $(".ul-persons").append(li);
            if(bool){//添加人员，状态改为已添加
                $("#selectTable  #"+personId).html("<span class='glyphicon'></span>已添加");
                $("#selectTable  #"+personId).attr("disabled", "disabled");
            }

            $(a).bind("click",function(){
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        $scope.checkPerson = function(){
            var checkedP = $(".ul-persons .item");
            if(checkedP.length <=0 ){
                window.msg("请至少添加一个用户!");
                return false;
            }
            var pIds = "", pNames = "";
            var tempAddedCustomers = [];
            checkedP.each(function(index){
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                tempAddedCustomers.push({'id':$(this).attr("personId"),'nickname':$(this).attr("personName")});
                if(index < checkedP.length -1){
                    pIds += ",";
                    pNames += ",";
                }
            });
       
            $uibModalInstance.close({pIds: pIds, pNames: pNames,tempAddedCustomers:tempAddedCustomers});
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

  });

})()
