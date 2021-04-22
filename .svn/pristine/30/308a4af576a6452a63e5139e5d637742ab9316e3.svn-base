
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('takingCompareCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="承接对比";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.search = {isGroup:fac.isGroupVersion()};
			$scope.search.type=1;
			$scope.search.source=-1;
			loadDeptTree();
		});

		//查询
		$scope.find = function(pageNo) {
			if(!$scope.search.projectId){
				alert('请选择项目！');
				return;
			}
			$scope.search.typeId = $scope.typeId;
			$.extend($scope.search, {
				currentPage: pageNo || $scope.pageModel.currentPage || 1,
				pageSize: $scope.pageModel.pageSize || 10
			});
			fac.getPageResult("/ovu-pcos/taking/init/list.do", $scope.search, function(data) {
				$scope.pageModel = data;
			});
		};

		//点击列表项
		$scope.clicktr=function(item){
			if($scope.typeId!=item.id){
				$scope.typeId=item.id;
				$scope.find(1);
				showChart();
			}else{
				delete $scope.typeId;
				$scope.pageModel={};
			}
		};

		//切换Tab
		$scope.switchTab = function (checkType) {
			if(!$scope.search.projectId){
				return;
			}
			$scope.search.type=checkType;
			$scope.find(1);
		};

		$scope.selectProject=function(){
			var modal = $uibModal.open({
				animation: true,
				size: '',
				templateUrl: '/common/modal.project.html',
				controller: 'selectProjectCtrl'
				, resolve: {}
			});
			modal.result.then(function (data) {
				$scope.search.projectId=data.id;
				$scope.search.projectName=data.name;
				$scope.find(1);
				showChart();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		//编辑
		$scope.showEditModal = function(item){
			var modal = $uibModal.open({
				animation: false,
				size:'',
				templateUrl: 'undertaking/twice/modal.takingCompare.html',
				controller: 'takingCompareModalCtrl'
				,resolve: {item:function(){return  angular.extend({},item);}}
			});
			modal.result.then(function (data) {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
		function loadDeptTree(){
			$scope.typeId='';
			$http.get("/ovu-pcos/taking/type/tree.do").success(function(data) {
				$scope.list=data;
			});
		};

	});
	app.controller('takingCompareModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
		$scope.item = item || {};
        item.result='';
        item.result2='';
        if(item.has_done){
            if(item.has_done==1){
                item.result='承接通过';
            }else{
                item.result='承接不通过';
            }
        }else{
            item.result='承接通过';
        }
        if(item.has_confirm){
            if(item.has_confirm==1){
                item.result2='承接通过';
            }else{
                item.result2='承接不通过';
            }
        }

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
