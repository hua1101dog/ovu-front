	(function() {
		"use strict";
		var app = angular.module("angularApp");
		app.controller('customerTypeCtl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
			document.title ="客户类型";

			$scope.pageModel = {};

			app.modulePromiss.then(function(){
				$scope.search = {
					isGroup: fac.isGroupVersion()
				};
				if(app.park){
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
				fac.getPageResult("/ovu-pcos/expand/customerType/list.do",$scope.search,function(data){
					$scope.pageModel = data;
					
				});
			};

			//删除
			$scope.del = function(item){
				dodel(item.id);
			}
			function dodel(ids){
				confirm("确认删除这个客户类型吗?",function(){
					$http.post("/ovu-pcos/expand/customerType/delete.do",{id:ids},fac.postConfig).success(function(resp){
						if (resp.success) {
							if (resp.error) {
								alert(resp.error);
							}
							$scope.find();
						} else {
							alert('删除失败');
						}
					})
				});
			}

			$scope.showEditModal = function(group){
				if(!fac.hasActivePark($scope.search)){
					return;
				}
				var modal = $uibModal.open({
					animation: false,
					size:'',
					templateUrl: '../view/expand/customer/modal.customerType.html',
					controller: 'customerTypeModalCtrl'
					,resolve: {group: $.extend(true,{},group)}
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}


		});
		app.controller('customerTypeModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group) {
			$scope.item = group;
			//保存
			$scope.save = function(form,item){
				form.$setSubmitted(true);
				if(!form.$valid) {
					return;
				}
				if (angular.isNumber(item.createTime)) {
					item.createTime = $filter('date')(item.createTime, 'yyyy/MM/dd HH:mm:ss');
				}
				if (angular.isNumber(item.updateTime)) {
					item.updateTime = $filter('date')(item.updateTime, 'yyyy/MM/dd HH:mm:ss');
				}
				$http.post("/ovu-pcos/expand/customerType/save.do",item,fac.postConfig).success(function(data, status, headers, config) {
					if(data.success){
						$uibModalInstance.close();
						msg("保存成功!");
					} else {
						alert(data.error+" 保存失败.");
					}
				})
			}

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

		});
	})()