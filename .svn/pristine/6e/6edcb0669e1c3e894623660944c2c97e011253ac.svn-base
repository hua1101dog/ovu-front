	(function() {
		"use strict";
		var app = angular.module("angularApp");
		app.controller('customerContactCtl', function ($scope, $rootScope, $uibModal, $http, $filter, $location, fac) {
			document.title ="联系人管理";

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
				fac.getPageResult("/ovu-pcos/expand/customerContact/list.do",$scope.search,function(data){
					$scope.pageModel = data;
					
				});
			};

			//删除
			$scope.del = function(item) {
				if (item.keyContact == 1) {
					alert('不能删除主联系人！更换主联系人请在客户信息页面进行。');
				} else {
					dodel(item);
				}
			}
			function dodel(item){
				confirm("确认删除这个联系人吗?",function(){
					if (angular.isNumber(item.createTime)) {
						item.createTime = $filter('date')(item.createTime, 'yyyy/MM/dd HH:mm:ss');
					}
					if (angular.isNumber(item.updateTime)) {
						item.updateTime = $filter('date')(item.updateTime, 'yyyy/MM/dd HH:mm:ss');
					}
					if (angular.isNumber(item.birth)) {
						item.birth = $filter('date')(item.birth, 'yyyy/MM/dd');
					}
					
					var promise = $http.post("/ovu-pcos/expand/customerContact/delete.do", item, fac.postConfig).success(function(resp){});
					
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
				if (group && group.birth) {
					if (angular.isNumber(group.birth)) {
						group.birth = $filter('date')(group.birth, 'yyyy/MM/dd');
					}
				}
				
				var modal = $uibModal.open({
					animation: false,
					size:'',
					templateUrl: '../view/expand/customer/modal.customerContact.html',
					controller: 'customerContactModalCtrl'
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
		app.controller('customerContactModalCtrl', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, $location, fac, group) {
			$scope.item = group;
			
			if (!$scope.item.customerId && $location.search().customerId) {
				$scope.item.customerId = $location.search().customerId;
			}
			
			
			//保存
			$scope.save = function(form, item){
				form.$setSubmitted(true);
				if(!form.$valid) {
					return;
				}
//				if (!item.customerId) {
//					item.customerId = $scope.search.customerId;
//				}
				if (angular.isNumber(item.createTime)) {
					item.createTime = $filter('date')(item.createTime, 'yyyy/MM/dd HH:mm:ss');
				}
				if (angular.isNumber(item.updateTime)) {
					item.updateTime = $filter('date')(item.updateTime, 'yyyy/MM/dd HH:mm:ss');
				}
				if (angular.isNumber(item.birth)) {
					item.birth = $filter('date')(item.birth, 'yyyy/MM/dd');
				}
				var promise = $http.post("/ovu-pcos/expand/customerContact/save.do",item,fac.postConfig).success(function(data, status, headers, config) {});
				
				promise.then(function (result) {  
		            if (result.status == 200) {
		            	var data = result.data;
		            	if(data.success){
							$uibModalInstance.close();
							msg("保存成功!");
						} else {
							alert(data.error);
						}
		            } else {
		            	alert('未知异常');
		            }
				});
			}

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

		});
	})()