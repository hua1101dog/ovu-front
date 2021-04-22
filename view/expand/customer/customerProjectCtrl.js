	(function() {
		"use strict";
		var app = angular.module("angularApp");
		app.controller('customerProjectCtl', function ($scope, $rootScope, $uibModal, $http, $filter, $location, fac) {
			document.title ="客户管辖项目";

			$scope.pageModel = {};
			
			$scope.customer = null;
			$http.post("/ovu-pcos/expand/customer/get.do",{id:$location.search().customerId},fac.postConfig).success(function(resp){
				$scope.customer = resp;
			})

			app.modulePromiss.then(function(){
				$scope.search = {
					isGroup: fac.isGroupVersion()
				};
				if (app.park) {
					$scope.search.parkId = app.park.ID;
				}
				if ($location.search().customerId) {
					$scope.search.customerId = $location.search().customerId;
				}
				$scope.find(1);
			});

			//查询
			$scope.find = function(pageNo){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				fac.getPageResult("/ovu-pcos/expand/customerProject/list.do",$scope.search,function(data){
					$scope.pageModel = data;
					
				});
			};

			//删除
			$scope.del = function(item) {
				dodel(item);
			}
			function dodel(item){
				confirm("确认删除这个项目吗?",function(){
					if (angular.isNumber(item.createTime)) {
						item.createTime = $filter('date')(item.createTime, 'yyyy/MM/dd HH:mm:ss');
					}
					if (angular.isNumber(item.updateTime)) {
						item.updateTime = $filter('date')(item.updateTime, 'yyyy/MM/dd HH:mm:ss');
					}
					
					var promise = $http.post("/ovu-pcos/expand/customerProject/delete.do", item, fac.postConfig).success(function(resp){});
					
					promise.then(function (result) {  
			            if (result.status == 200) {
			            	var resp = result.data;
			            	if (resp.success) {
								if (resp.error) {
									alert(resp.error);
								}
								$scope.find();
							} else {
								alert('删除失败');
							}
			            } else {
			            	alert('删除失败');
			            }
					});
				});
			}

			$scope.showEditModal = function(group){
				if (!fac.hasActivePark($scope.search)) {
					return;
				}
				
				var modal = $uibModal.open({
					animation: false,
					size:'',
					templateUrl: '../view/expand/customer/modal.customerProject.html',
					controller: 'customerProjectModalCtrl'
					,resolve: {group: $.extend(true,{},group)}
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}

			//返回
			$scope.goback = function() {
				window.history.back();
			};
		});
		app.controller('customerProjectModalCtrl', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, $location, fac, group) {
			
			document.title ="新增客户项目";
			
			var customerId = $location.search().customerId;
			
			$scope.pageModel = {};
			
			app.modulePromiss.then(function(){
				$scope.search = {
					isGroup: fac.isGroupVersion()
				};
				if (app.park) {
					$scope.search.parkId = app.park.ID;
				}
				$scope.find(1);
			});

			//查询
			$scope.find = function(pageNo){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				
				$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				fac.getPageResult("/ovu-pcos/pcos/expand/project/listInfo.do", $scope.search, function (data) {
	                $scope.pageModel = data;
	            });
			};
			//保存
			$scope.save = function() {
				var projectIds = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
				
				var params = {
					customerId:customerId,
					projectIds:projectIds.join(',')
				};
				
				var promise = $http.post("/ovu-pcos/expand/customerProject/save.do", params, fac.postConfig).success(function(data, status, headers, config) {});
				
				promise.then(function (result) {  
		            if (result.status == 200) {
		            	var data = result.data;
		            	if(data.success){
							$uibModalInstance.close();
							msg("保存成功!");
						} else {
							alert(data.error+" 保存失败.");
						}
		            } else {
		            	alert('未知异常。');
		            }
				});
			}

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

		});
	})()