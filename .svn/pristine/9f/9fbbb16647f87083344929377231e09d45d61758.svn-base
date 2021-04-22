
(function() {
	"use strict";

	var app = angular.module("angularApp");
	app.controller('checkItemContentCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="查验内容管理";
        $scope.search={};
		$scope.pageModel={};
		app.modulePromiss.then(function(){
			$scope.config={edit:false};
			$scope.search = {isGroup:fac.isGroupVersion()};
			loadDeptTree();
		});

		//查询
		$scope.find = function(pageNo) {
			if(!fac.hasActivePark($scope.search)){
				return;
			}
			$.extend($scope.search, {
				currentPage: pageNo || $scope.pageModel.currentPage || 1,
				pageSize: $scope.pageModel.pageSize || 10
			});
			fac.getPageResult("/ovu-pcos/taking/content/list.do", $scope.search, function(data) {
				$scope.pageModel = data;
			});
		};

		//选中分类
		$scope.selectNode= function (search,node) {
			if(node.state.selected){
				$scope.curNode = node;
				if(node.item_type && node.item_type==2){	//分项节点
					$scope.find(1);
				}
			}else{
				delete $scope.curNode;
				$scope.pageModel={};
			}
		};

		//新增内容
		$scope.editPost = function(item){
			if($scope.curNode){
				item=item || {pid:$scope.curNode.id};
				var modal = $uibModal.open({
					animation: false,
					size:'',
					templateUrl: 'undertaking/modal.checkItemContent.html',
					controller: 'checkItemContentModalCtrl'
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
		//删除内容
		$scope.del = function(item){
			confirm("确认删除该查验内容吗?",function(){
				$http.post("/ovu-pcos/taking/content/remove.do",{id:item.id},fac.postConfig).success(function(data){
					if(data.success){
						$scope.find();
					}else{
						alert(data.error);
					}
				});
			})
		};

		$scope.setStandard=function(item,readonly){
			var modal = $uibModal.open({
				animation: false,
				size:'lg',
				templateUrl: 'undertaking/modal.checkStandard.html',
				controller: 'checkStandardModalCtrl'
				,resolve: {content:function(){return  angular.extend({},item);},readonly:readonly}
			});
			modal.result.then(function (data) {

			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
		};

		function loadDeptTree(){
			$http.post("/ovu-pcos/taking/content/tree.do").success(function(data){
				$scope.treeData = data;
			});
		};

	});
	app.controller('checkItemContentModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,post) {
		$scope.item = post || {};

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}

			$http.post("/ovu-pcos/taking/content/save.do", item,fac.postConfig).success(function(data) {
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
	app.controller('checkStandardModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,content,readonly) {
		$scope.readonly=readonly;
		$scope.content = content || {};
		$scope.list=[];
		$scope.attrs=[];

		if(content.id){
			if(content.way==1){
				$http.post("/ovu-pcos/taking/standard/listattrs.do",{way:content.way},fac.postConfig).success(function(data){
					$scope.attrs=data;
					list();
				});
			}else{
				list();
			}
		}

		$scope.add=function(){
			if(content.way==2){
				$scope.list.push({name:null,has_camera:null});
			}else if(content.way==3){
				$scope.list.push({name:null,param_key:null,param_value:null});
			}
		};

		function list(){
			$http.post("/ovu-pcos/taking/standard/list.do",{id:content.id},fac.postConfig).success(function(data){
				$scope.list=data;

				if(content.way==1){
					$scope.attrs.forEach(function(attr){
						attr.checked=false;
						$scope.list.forEach(function(item){
							if(attr.id==item.attr_id){
								attr.checked=true;
							}
						});
					});
				}
			});
		}

		$scope.clickBox=function(attr){
			attr.checked=!attr.checked;
		};

		$scope.del=function(list,item){
			list.splice(list.indexOf(item),1);
		};

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}

			if(content.way==1){
				$scope.list=[];
				$scope.attrs.forEach(function(attr){
					if(attr.checked){
						$scope.list.push({attr_id:attr.id,name:attr.name});
					}
				});
			}

			$http.post("/ovu-pcos/taking/standard/save.do",{pid:content.id,json:JSON.stringify($scope.list)},fac.postConfig).success(function(data) {
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
