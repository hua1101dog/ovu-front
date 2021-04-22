
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('checkItemCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="查验项管理";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.config={edit:true};
			$scope.search = {isGroup:fac.isGroupVersion()};
			loadDeptTree();
		});

		//查询
		$scope.find = function(id) {
			if(!fac.hasActivePark($scope.search)){
				return;
			}

			$scope.search.typeId=id;
			$http.post("/ovu-pcos/taking/item/list.do", $scope.search,fac.postConfig).success(function(data) {
				$scope.treeData=data;
			})
		};

		$scope.clicktr=function(item){
			if($scope.typeId!=item.id){
				$scope.typeId=item.id;
				$scope.find(item.id);
			}else{
				delete $scope.typeId;
				$scope.treeData=[];
			}
		};

		//新增分类
		$scope.addSon= $scope.addTopNode = function(node){
              if(node && node.item_type==2){
                  alert('查验项下不能再添加子节点！');
                  return;
              }
			var type={type_id:$scope.typeId,pid:node?node.id:null};
			var modal = $uibModal.open({
				animation: false,
				size:'',
				templateUrl: 'undertaking/modal.checkItem.html',
				controller: 'checkItemModalCtrl'
				,resolve: {type:function(){return  angular.extend({},type);}}
			});
			modal.result.then(function (data) {
				if(node){
					node.state = node.state || {};
					node.state.expanded = true;
					node.nodes = node.nodes || [];
					node.nodes.push(data);
				}else{
					$scope.treeData.push(data);
				}
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
		//编辑分类
		$scope.editNode = function(node){
			node=node || {};
			var modal = $uibModal.open({
				animation: false,
				size:'',
				templateUrl: 'undertaking/modal.checkItem.html',
				controller: 'checkItemModalCtrl'
				,resolve: {type:function(){return  angular.extend({},node);}}
			});
			modal.result.then(function (data) {
				angular.extend(node,data);
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};
		//删除分类
		$scope.delNode = function(node){
			if(node.nodes && node.nodes.length>0){
				alert('该分类下还有子项，不能删除！');
				return;
			}

			confirm("确认删除["+node.text+"]吗?",function(){
				$http.post("/ovu-pcos/taking/item/remove.do",{id:node.id},fac.postConfig).success(function(data){
					if(data.success){
						if ($scope.curNode == node) {
							delete $scope.curNode;
						}
						var list = fac.treeToFlat($scope.treeData);
						var parent = list.find(function(n){return n.id == node.pid });
						if (parent) {
							parent.nodes.splice(parent.nodes.indexOf(node), 1)
						} else {
							$scope.treeData.splice($scope.treeData.indexOf(node), 1)
						}
					}else{
						alert(data.error);
					}
				});
			})
		};

		function loadDeptTree(){
			$scope.typeId='';
			$http.get("/ovu-pcos/taking/type/tree.do").success(function(data) {
				$scope.list=data;
			});
		};

	});
	app.controller('checkItemModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,type) {
		$scope.item = type || {};
		$scope.itemtypes= [[1, "分类"],[2, "分项"]];

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			$http.post("/ovu-pcos/taking/item/save.do", item,fac.postConfig).success(function(resp) {
				if (resp.success) {
					var type=resp.data;
					$uibModalInstance.close(type);
					msg("保存成功!");
				} else {
					alert(resp.error);
				}
			})
		}


		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})()
