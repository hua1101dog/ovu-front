/**
 * 知识库管理
 */
(function() {
	'use strict';

	
	var app = angular.module("angularApp");

	app.controller('RepositoryCtl',RepositoryCtl);
	function RepositoryCtl($scope,$timeout,$uibModal,$http,fac){
		var vm = this;
		document.title = "知识库管理";
        $scope.pageModel = {};
		$scope.search = {};
		vm.typeList=[[1,"作业指南 "],[2,"规章制度"],[3,'安全技术档案库']];
		//分页表格
	    $scope.find = function(pageNo){
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/knowledge/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
	    }
	    $scope.find();
	    //新增修改弹出框
	    vm.showEditModal = function(id){
	    	var modal = $uibModal.open({
				animation: false,
				templateUrl: '../view/elevator/repository/modal.addOrEdit.html',
				controller: 'repositoryEditModalCtrl',
				resolve: {
					id: id
				}
			});
			modal.result.then(function () {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
	    }

	    vm.del = function(id){
	    	confirm("确认删除该记录?",function(){
	    		$http.get("/ovu-pcos/pcos/knowledge/delete.do?kb_id="+id).success(function (data, status, headers, config) {
					if (data.success) {
						$scope.find();
						msg(data.msg);
					} else {
						alert(data.msg);
					}
				})
			});
	    }

	    vm.download = function(id){
    		window.location.href = "/ovu-pcos/pcos/knowledge/download.do?kbId="+id;
	    }

	}
	 //新增修改弹出框控制器
	app.controller('repositoryEditModalCtrl',repositoryEditModalCtrl);
	function repositoryEditModalCtrl($scope,$timeout,$uibModalInstance,$http,RepositoryService,fac,id){
		var vm = $scope.vm = this;
		vm.typeList=[[1,"作业指南 "],[2,"规章制度"],[3,'安全技术档案库']];
		vm.item={};
		if(fac.isNotEmpty(id)){
			$http.get("/ovu-pcos/pcos/knowledge/get.do?kb_id="+id).success(function (data, status, headers, config) {
				if (data.success) {
					vm.item = data.data;
				} else {
					alert();
				}
			})
		}

		vm.save = function (form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			$http.post("/ovu-pcos/pcos/knowledge/save.do", item,fac.postConfig).success(function (data, status, headers, config) {
				if (data.success) {
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert(data.msg);
				}
			})
		}
		vm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		/*//选择文档
		vm.selectDoc =function (item){
			var param={url:"/ovu-pcos/upload/document.do",accept:'*'};
			fac.upload(param,function(resp){
				if(resp.status==1){
					vm.item.path=resp.url;
					vm.item.name=resp.fileName;
					$scope.$apply();
				}else{
					alert(resp.error);
				}
			})
		}*/

	}
	/**
	 * Service
	 */
	app.service('RepositoryService',['$http', function ($http) {
        this.getChart = function(param){
        	return $http.get('/ovu-pcos/pcos/liftreport/stats/lift/chart.do?timeDim='+param).then(function(resp) {
        		return resp.data;
        	});
        }


	 }]);

})()
