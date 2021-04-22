(function() {    
        var app = angular.module("angularApp");
        //项目架构ctl
        app.controller('custAccountContr', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        	document.title ="OVU-账户信息管理";
            angular.extend($rootScope,fac.dicts);
            $rootScope.search = {};
            $scope.pageModel = {};
            
            //查询
            $scope.find = function(pageNo){
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	$rootScope.search.PARK_ID = app.park.ID;
    			
                $.extend($rootScope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $rootScope.search.pageIndex = $rootScope.search.currentPage-1;
                $rootScope.search.totalCount = $scope.pageModel.totalCount||0;
                fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/accountManager", $rootScope.search, function(data){
                    $scope.pageModel = data;
                });
            };
            
            $scope.del = function (item) {
                confirm("确认删除该账户信息吗?", function () {
                    $.post("/ovu-base/ovupark/backstage/customerUser/delAccount", {"aid": item.ID}, function (resp) {
                    	if(resp.code){
                    		$scope.find();
                    	}else{
                    		window.msg(resp.message);
                    	}
                    });
                })
            };
            
            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find();
                })
            });
            
            //账号升级, 暂不用了
            $scope.upgradeAcount = function (customerUser) {
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	$rootScope.search.PARK_ID = app.park.ID;
            	customerUser.PARK_ID = app.park.ID;
                customerUser = customerUser ||angular.extend({},$scope.search);
                
                $.post("/ovu-base/pcos/ovupark/customerUser/queryCustomerInfos", {"parkId":$rootScope.search.PARK_ID}, function(data){
                    var list = jQuery.parseJSON(data);
                    if(list.success){
                        customerUser.industryList = list.dataList;
                        var copy = angular.extend({},customerUser);
                        var modal = $uibModal.open({
                            animation: false,
                            size: 'md',
                            templateUrl: '/view/parkCustomerManage/accountManage/modal.upgradeAcount.html',
                            controller: 'upgradeAcountCtrl', 
                            resolve: {customerUser: copy}
                        });
                        modal.result.then(function () {
                            if($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1){
                                $scope.pageModel.currentPage = $scope.pageModel.currentPage -1;
                            }
                            $scope.find();
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        });
                    }
                });
            }
            
            //编辑模态框弹出方法
            $scope.editModal = function(item) {
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	$rootScope.search.PARK_ID = app.park.ID;
            	
                var copy = angular.extend({},item);
                copy.PARK_ID = app.park.ID;
                
                var modal = $uibModal.open({
                    animation: false,       
                    templateUrl: '/view/parkCustomerManage/accountManage/modal.editAccount.html',
                    controller: 'editAccountContr',
                    resolve: {account: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };
            
            //查看租户模态框弹出方法
            $scope.rentModal = function(item) {
                var copy = angular.extend({},item);
                var modal = $uibModal.open({
                    animation: false,       
                    size: 'lg',
                    templateUrl: '/view/parkCustomerManage/accountManage/modal.checkTenantModal.html',
                    controller: 'checkTenantContr',
                    resolve: {account: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };
            
            //查看员工模态框弹出方法
            $scope.staffModal = function(item) {
                var copy = angular.extend({},item);
                var modal = $uibModal.open({
                    animation: false,   
                    size: 'lg',
                    templateUrl: '/view/parkCustomerManage/accountManage/modal.staff.html',
                    controller: 'staffContr',
                    resolve: {account: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };
            
        });
        
        //编辑模态框
        app.controller('editAccountContr',function($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac,account) {
            $scope.item = account;
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            
            $scope.save = function(form,item){
                if(!item.LOGIN_NAME){
                    item.LOGIN_NAME = item.PHONE;//当没有填写账号时，则使用手机号作为登录名
                }
                item.PASSWORD = $scope.pwd;
                $http.post('/ovu-base/ovupark/backstage/customerUser/updateAccountInfo', item, fac.postConfig).success(function(resp){
                    if(resp.code) {                     
                        msg("保存成功");
                        $uibModalInstance.close();
                    } else {
                        alert(resp.message);
                    }
                });
            }
            
        });
        
        //查看租户
        app.controller('checkTenantContr',function($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac,account) {
            $scope.account = account;
            $scope.search = {};
            $scope.pageModel = {};
            $scope.search.userType= {};
            $scope.search.accId=account.ID;
            
            //查询
            $scope.find = function(pageNo,userType){
                $scope.search.userType=userType;
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $scope.search.pageIndex = $scope.search.currentPage-1;
                $scope.search.totalCount = $scope.pageModel.totalCount||0;
                fac.getPageResult("/ovu-base/system/leaseRelation/getLeaserList", $scope.search, function(data){
                    /* console.info(data); */
                    
                    $scope.pageModel = data;
                    console.info($scope.pageModel.data);
                });
            }
            
            if($scope.account && $scope.account.ID){
                $scope.search.id = $scope.account.ID;
                $scope.find(1,'company');
            }
            
            
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            
            //查看租户模态框弹出方法
            $scope.getRentInfo = function(item) {
                var copy = angular.extend({},$scope.account);
                var copy1 = angular.extend({},item);
                var modal = $uibModal.open({
                    animation: false,   
                    size: 'lg',
                    templateUrl: '/view/parkCustomerManage/accountManage/modal.rentInfoModal.html',
                    controller: 'rentInfoCtrl',
                    resolve: {account: copy,lease: copy1}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };
            
        });
        

        //查看租赁详情
        app.controller('rentInfoCtrl',function($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac,account,lease) {
            $scope.search = {};
            $scope.search.accId = account.ID;
            $scope.search.acceptId = lease.ID;
            $scope.lease = lease;
            $scope.pageModel = {};
            
            //查询
            $scope.find = function(pageNo){
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $scope.search.pageIndex = $scope.search.currentPage-1;
                $scope.search.totalCount = $scope.pageModel.totalCount||0;
                fac.getPageResult("/ovu-base/system/leaseRelation/findSomeBodyProperties", $scope.search, function(data){
                    $scope.pageModel = data;
                });
            }
            
            $scope.find(1);
            
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });
        
        //查看员工
        app.controller('staffContr',function($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac,account) {
            $scope.account = account;
            $scope.search = {};
            $scope.pageModel = {};
            
            //查询
            $scope.find = function(pageNo){
                $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $scope.search.pageIndex = $scope.search.currentPage-1;
                $scope.search.totalCount = $scope.pageModel.totalCount||0;
                fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/getStuff", $scope.search, function(data){
                    $scope.pageModel = data;
                });
            }
            
            if($scope.account && $scope.account.ID){
                $scope.search.customerUserId = $scope.account.ID;
                $scope.find(1);
            }
            
            
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });
        
        app.filter("convertCusType",function(){//转换企业数值和文字
            return function(value) {
                if(value == "1"){
                    return "个人";
                } else if(value == "2"){
                    return "企业";
                } else if(value == "3"){
                    return "员工";
                } else if(value == "4"){
                    return "普通会员";
                } else{
                    return "";
                }
            }
        }).filter("contactWayFilter",function(){//处理联系方式标记的方法
            //联系方式  0-QQ 1-微信 2-邮箱
            return function(value){
                if(value === 0){//
                    return "(QQ)";
                }else if(value === 1){
                    return "(微信)";
                }else if(value === 2){
                    return "(邮箱)";
                }else{
                    return "--";
                }
            }
        });
        
        app.controller('upgradeAcountCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, customerUser) {
            $scope.item = customerUser;
            
            $scope.saveData = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $.post("/ovu-base/ovupark/backstage/customerUser/upgradeAccont",{"aid":item.ID,"companyId":item.INDUSTRYID},function(data){
                    var data = jQuery.parseJSON(data);
                        if(!data.success){
                            alert("操作失败");
                        }else{
                            $uibModalInstance.close();
                        }
                });
            }
            
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });

    })()