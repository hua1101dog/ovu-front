
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('checkAttrCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="查验方式管理";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.search = {isGroup:fac.isGroupVersion()};
			loadDeptTree();
		});

		//查询
		$scope.find = function(pageNo) {
			if(!fac.hasActivePark($scope.search)){
				return;
			}
			$scope.search.type = $scope.curNode && $scope.curNode.id;
			$.extend($scope.search, {
				currentPage: pageNo || $scope.pageModel.currentPage || 1,
				pageSize: $scope.pageModel.pageSize || 10
			});
			fac.getPageResult("/ovu-pcos/taking/attr/list.do", $scope.search, function(data) {
				$scope.pageModel = data;
			});
		};

		//选中分类
		$scope.selectNode= function (node) {
			if($scope.curNode != node){
				$scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
			}
			node.state = node.state||{};
			node.state.selected = !node.state.selected;
			if(node.state.selected){
				$scope.curNode = node;
				$scope.find(1);
			}else{
				delete $scope.curNode;
				$scope.pageModel={};
			}

		};

		//新增岗位
		$scope.editPost = function(item){
			if($scope.curNode){
				item=item || {way:$scope.curNode.id};
				var modal = $uibModal.open({
					animation: false,
					size:'',
					templateUrl: 'undertaking/modal.checkAttr.html',
					controller: 'checkAttrModalCtrl'
					,resolve: {post:function(){return  angular.extend({},item);}}
				});
				modal.result.then(function (data) {
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}else{
				alert('请选择一个类型！');
			}
		};
		//删除岗位
		$scope.del = function(item){
			confirm("确认删除该属性吗?",function(){
				$http.post("/ovu-pcos/taking/attr/remove.do",{id:item.id},fac.postConfig).success(function(data){
					if(data.success){
						$scope.find();
					}else{
						alert(data.error);
					}
				});
			})
		};

		function loadDeptTree(){
			var data=[{id:1,text:'盘点'},{id:2,text:'查验'},{id:3,text:'检测'}];
			$scope.treeData = data;
		};

	});
	app.controller('checkAttrModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,post) {
		$scope.item = post || {};

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}

			$http.post("/ovu-pcos/taking/attr/save.do", item,fac.postConfig).success(function(data) {
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
