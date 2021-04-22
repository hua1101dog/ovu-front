/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('WorkOrderCtl', function ($scope,$rootScope, $http,$filter,$uibModal,$location,fac) {
    	var vm= this;
        document.title ="工单管理";
        $scope.pageModel = {};

        app.modulePromiss.then(function(){
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
               /* $scope.search.parkId = app.park.ID;
                $scope.search.PARK_NAME = app.park.PARK_NAME;*/
            }
            $scope.find();
        })

        $scope.find = function(pageNo){
            /*if(!fac.hasActivePark($scope.search)){
                return;
            }*/
            if(!$scope.search.EXEC_NAME){
                delete $scope.search.execPersonId;
            }
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/fire/workunit/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.selectedExecPerson=function(item,search){
            search.execPersonId=item.id;
        }
        //查看图片
        vm.showPhotoModal=function(task){
            var modal = $uibModal.open({
                animation: false,
                size:'md',
                templateUrl: 'fire/modal/modal.showPhoto.html',
                controller: 'showPhotoModalCtrl'
                ,resolve: {task: task}
            });
        }
        vm.del = function(item){
            if(item.status == 4){
                return;
            }
            confirm("确认删除该工单吗?",function(){
            	$http.get("/ovu-pcos/pcos/fire/workunit/delete.do?fireWorkunitId="+item.workunitId).success(function (data, status, headers, config) {
                    if(data.success){
                        $scope.find();
                        msg(data.msg);
                    }else{
                        alert();
                    }
                });
            })
        }
        //编辑
        vm.showEditModal = function (id) {
            if(!fac.hasActivePark($scope.search)){
                return;
            }
            var param = {
            		id:id,
            		isGroup:$scope.search.isGroup,
            		parkId:$scope.search.parkId,
            		showSave:true,
            		title:'编辑工单'
            }
            var modal = $uibModal.open({
                animation: true,
                component:'workOrderModalComponent',
                resolve: {
                	param: param
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //展示状态详情
        vm.showStatusDetail = function (item) {
        	var status=item.status;
        	var param={};
        	//待广播
        	if(status == 1){
                $rootScope.firePointId = item.firePointId;
                // $Scope.firePointId = item.firePointId;
        		$location.path('/fire/fireMonitoring');
        	}
        	//已广播
        	else if(status == 2){
        		/*var modal = $uibModal.open({
            		animation: true,
            		size : 'lg',
            		component: 'messagePushModelComponent', 
            		resolve: {
            			param: param
            		}
            	});
            	modal.result.then(function () {
            		$scope.find();
            	}, function () {
            		console.info('Modal dismissed at: ' + new Date());
            	});*/
        	}
        	//执行中
        	else if(status == 3){
        		 var modal = $uibModal.open({
                     animation: true,
                     templateUrl: 'fire/modal/modal.running.html',
                     controller: 'WorkOrderRunningCtrl'
                     , resolve: {param: angular.copy(item)}
                 });
                 modal.result.then(function () {
                     $scope.find();
                 }, function () {
                     console.info('Modal dismissed at: ' + new Date());
                 });
        		 //消息推送弹出框
        	}
        	// 已解决
        	else if(status == 4){
        		  var param = {
                  		id:item.workunitId,
                  		showSave:false,
                  		title:'处理详情'
                  }
                  var modal = $uibModal.open({
                      animation: true,
                      component:'workOrderModalComponent',
                      resolve: {
                      	param: param
                      }
                  });
                  modal.result.then(function () {
                  }, function () {
                      console.info('Modal dismissed at: ' + new Date());
                  });
        	}
        }
        
        
    });

    app.controller('WorkOrderRunningCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,param) {
    	if(fac.isNotEmpty(param.workunitId)){
    		$http.get("/ovu-pcos/pcos/fire/workunit/state.do?workunitId="+param.workunitId).success(function(data){
    			$scope.item = data;
    		})
    	}
    	
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss('cancel');
    	};
    });
    app.controller('showPhotoModalCtrl', function ($scope, $rootScope, $http,$uibModal, $uibModalInstance, $filter, fac,task) {
        $scope.item=task.imgPaths || "";
       $scope.item=$scope.item.split(",") || [];
       if(!$scope.item){
           alert('该工单没有图片');
       }
       $scope.save = function () {
           $uibModalInstance.close();
       }
       $scope.cancel = function () {
           $uibModalInstance.dismiss('cancel');

       };
           });

})();