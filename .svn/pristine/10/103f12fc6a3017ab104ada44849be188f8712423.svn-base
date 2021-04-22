/**
 * Created by Cx on 2019/4/4.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 缴费Controller
    app.controller('paymentManageCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = 'OVU-缴费管理';
        $scope.pageModel = {};
        $scope.search = {};
        // $scope.search.type=1

        // 页面初始化
            app.modulePromiss.then(function(){
            	$scope.$watch('dept.id', function (deptId, oldValue) {
	                if (deptId) {
	                    if ($scope.dept.parkId) {
	                        $scope.search.parkId = $scope.dept.parkId;
	                        $scope.search.parkName = $scope.dept.parkName;
	                        $scope.init()
	                    } else {
                            alert('请选择跟项目关联的部门');
                            $scope.search.parkId &&  delete $scope.search.parkId
                            $scope.search.parkName &&  delete $scope.search.parkName;

	                    }

	                }
            	})


            })


        $scope.init=function(){
        	// $scope.search.closeStatus=2
            // $scope.search.control=1
            selectClassify();
            $scope.find();
        }


        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
            $http.get("/ovu-energy/energy/point/ratioList?parkId="+$scope.search.parkId).success(function (data) {
                $scope.radioList = data.data;

            });
        }

		$scope.changeCategory = function (id) {
            $http.post("/ovu-energy/energy/item/list", {
                classifyId: id
            }, fac.postConfig).success(function (data) {
                $scope.fenXiangList = data.data;
            });
        }

        // 查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/billing/page", $scope.search, function (data) {
            	var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName =  item.spaceName && $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        }

        //充值缴费
        $scope.showPayModal=function(item){
            var copy=angular.extend(item,{parkId: $scope.search.parkId})
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/energy/chargingManage/payment/modal.payModal.html',
                controller: 'paymentCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
               
            });
        }
        //拉闸合闸
        $scope.showBrakeModal=function(item){

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/energy/chargingManage/payment/modal.Brake.html',
                controller: 'brakeCtrl',
                resolve: {
                    param: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
               
            });
        }

        //充值记录
        $scope.showRecordsModal=function(item){

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/energy/chargingManage/payment/modal.paymentRecord.html',
                controller: 'recordCtrl',
                resolve: {
                    param: item
                }
            });
            modal.result.then(function () {
            }, function () {
                $scope.find();
            });
        }
    });

    app.controller('recordCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac,param){
        var vm = $scope.vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        $scope.item=param || {};
        //点击取消
        $scope.find = function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10,pointId:param.pointId});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/billing/record/page", $scope.search, function (data) {
            	var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        $scope.find()
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('paymentCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac,param){
        var vm = $scope.vm = this;
        //保存编辑结果
        $scope.item=param || {};
        $scope.recharge=function(){
            $scope.item.rechargeCapacity=($scope.item.rechargeMoney/$scope.item.unitPrice)+'';
            if($scope.item.rechargeCapacity.indexOf(".")==-1){
              //整数
              $scope.item.rechargeCapacity= $scope.item.rechargeCapacity-0
            }else{
                // 小数
                var arr=$scope.item.rechargeCapacity.split('.');
                if(arr[1].length>4){
                    arr[1]=arr[1].slice(0,4);
                    $scope.item.rechargeCapacity=arr[0]+'.'+arr[1];
                    $scope.item.rechargeCapacity=$scope.item.rechargeCapacity-0
                }else{
                    $scope.item.rechargeCapacity= $scope.item.rechargeCapacity-0
                }

            }
        }

    	$scope.save = function(form,item){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

    		$http.post("/ovu-energy/energy/billing/record/save",$scope.item,fac.postConfig).success(function (data) {
    			if(data.code === 0){
                    $uibModalInstance.close();
    				msg(data.msg);
    			}else{
    				alert(data.msg);
    			}
    		})
    	}
    	//点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('brakeCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac,param){
        var vm = $scope.vm = this;
        $scope.item=param || {};
        //点击取消
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var url=''
            if($scope.item.closeStatus==2){
                //拉闸操作
                 url='/ovu-energy/energy/billing/close'
            }else{
                url='/ovu-energy/energy/billing/open'
            }
            var params={pointId:param.pointId,password:$scope.item.password}
    		$http.post(url,params,fac.postConfig).success(function (data) {
    			if(data.code === 0){
                    $uibModalInstance.close();
    				msg(data.msg);
    			}else{
    				alert(data.msg);
    			}
    		})
    	}
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
