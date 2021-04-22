
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('takingTwiceInitCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac,$location) {
        document.title ="二次承接初始化";
        $scope.search={};
		$scope.pageModel={};
    $scope.search.type=1;
    $scope.search.source=2;
    loadDeptTree();

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
				data.data.forEach(function(item){
					if(item.image){
						item.photos=item.image.split(',');
					}
				});
				$scope.pageModel = data;
			});
		};

    //从多项目跳转过来
    if ($location.search().projectId) {
      $scope.search.projectId=$location.search().projectId;
      $scope.search.projectName=$location.search().projectName;
      $scope.find(1);
    }

		//点击列表项
		$scope.clicktr=function(item){
			if($scope.typeId!=item.id){
				$scope.typeId=item.id;
				$scope.find(1);
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
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		//编辑
		$scope.showEditModal = function(item){
			var modal = $uibModal.open({
				animation: false,
				size:'',
				templateUrl: 'undertaking/twice/modal.takingInit.html',
				controller: 'takingTwiceInitModalCtrl'
				,resolve: {item:function(){return  angular.extend({},item);}}
			});
			modal.result.then(function (data) {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		//确认
		$scope.doConfirm = function(item){
			confirm("是否确认完成?",function(){
				$http.post("/ovu-pcos/taking/init/confirm.do", {id:item.id},fac.postConfig).success(function (data) {
					if (data.success) {
						$scope.find();
					} else {
						alert(data.error);
					}
				})
			});
		};

		function loadDeptTree(){
			$scope.typeId='';
			$http.get("/ovu-pcos/taking/type/tree.do").success(function(data) {
				$scope.list=data;
			});
		};

	});
	app.controller('takingTwiceInitModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
		$scope.item = item || {};
		item.photos=[];
		if(item.image){
			item.photos=item.image.split(',');
		}

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			if(item.way==2){
				item.image=item.photos.join();
			}
			$http.post("/ovu-pcos/taking/init/save.do", item,fac.postConfig).success(function(data) {
				if (data.success) {
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert(data.error);
				}
			})
		}


		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
