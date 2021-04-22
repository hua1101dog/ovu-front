
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('takingSpotCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="现场承接";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.search = {isGroup:fac.isGroupVersion()};
			$scope.search.type=1;
			$scope.passStatus=2;
			loadDeptTree();
		});

		//查询
		$scope.find = function(pageNo) {
			if(!$scope.search.projectId){
				alert('请选择项目！');
				return;
			}
			$scope.search.typeId = $scope.typeId;
			$scope.search.STATUS = $scope.passStatus;
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
        alert('请先选择项目！');
				return;
			}
			$scope.passStatus=status;
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
				templateUrl: 'undertaking/modal.takingSpot.html',
				controller: 'takingSpotModalCtrl'
				,resolve: {item:function(){return  angular.extend({},item);}}
			});
			modal.result.then(function (data) {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.pass=function(item){
			confirm("确认通过吗?",function(){
				$http.post("/ovu-pcos/taking/init/pass.do", {id:item.id,way:$scope.search.type},fac.postConfig).success(function (data) {
					if (data.success) {
						$scope.find();
					} else {
						alert(data.error);
					}
				})
			});
		};
		$scope.noPass=function(item){
			confirm("确认不通过吗?",function(){
				$http.post("/ovu-pcos/taking/init/nopass.do", {id:item.id,way:$scope.search.type},fac.postConfig).success(function (data) {
					if (data.success) {
						$scope.find();
					} else {
						alert(data.error);
					}
				})
			});
		};

		$scope.build=function(){
			var obj={};
			obj.projectId=$scope.search.projectId;
			obj.way=$scope.search.type;
			confirm("确认生成问题清单吗?",function(){
				$http.post("/ovu-pcos/taking/init/buildTakingProblem.do", obj,fac.postConfig).success(function (data) {
					if (data.success) {
						msg('生成成功！');
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
	app.controller('takingSpotModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,item) {
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
			$http.post("/ovu-pcos/taking/init/spotSave.do", item,fac.postConfig).success(function(data) {
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
