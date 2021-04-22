
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('takingProblemCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="问题清单";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.search = {isGroup:fac.isGroupVersion()};
			$scope.search.type=1;
			$scope.doneStatus=2;
			loadDeptTree();
		});

		//查询
		$scope.find = function(pageNo) {
			if(!$scope.search.projectId){
				alert('请选择项目！');
				return;
			}
			$scope.search.typeId = $scope.typeId;
			$scope.search.operateType = $scope.doneStatus;
			if($scope.doneStatus==1){
				$scope.search.source=-1;
			}else{
				$scope.search.source=null;
			}
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

		$scope.clickPassTab = function (status) {
			if(!$scope.search.projectId){
				return;
			}
			$scope.doneStatus=status;
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
				templateUrl: 'undertaking/result/modal.takingProblem.html',
				controller: 'takingProblemModalCtrl'
				,resolve: {item:function(){return  angular.extend({},item);}}
			});
			modal.result.then(function (data) {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		//处理通过
		$scope.yesDone = function(item){
			confirm("确认通过?",function(){
				$http.post("/ovu-pcos/taking/init/yesdone.do", {id:item.id},fac.postConfig).success(function (data) {
					if (data.success) {
						$scope.find();
					} else {
						alert(data.error);
					}
				})
			});
		};
		//处理整改
		$scope.noDone = function(item){
			confirm("确认整改?",function(){
				$http.post("/ovu-pcos/taking/init/nodone.do", {id:item.id},fac.postConfig).success(function (data) {
					if (data.success) {
						$scope.find();
					} else {
						alert(data.error);
					}
				})
			});
		};

		//日志
		$scope.showlog = function(item){
			var modal = $uibModal.open({
				animation: false,
				size:'',
				templateUrl: 'undertaking/result/modal.takingProLog.html',
				controller: 'takingProLogModalCtrl'
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
	app.controller('takingProblemModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
		$scope.item = item || {};

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}

			$http.post("/ovu-pcos/taking/init/doneSave.do", item,fac.postConfig).success(function(data) {
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
	app.controller('takingProLogModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
		$scope.item = item || {};
        item.result='';
        if(item.has_done){
            if(item.has_done==1){
                item.result='承接通过';
            }else{
                item.result='承接不通过';
            }
        }

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
