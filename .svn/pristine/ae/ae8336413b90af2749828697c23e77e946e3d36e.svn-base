/**
 * 合同创建管理
 */
(function() {
	'use strict';

	document.title = "合同创建管理";
	var app = angular.module("angularApp");

	app.controller('ContractCreateCtl',ContractCreateCtl);
	function ContractCreateCtl($scope,$timeout,$http,$uibModal,fac){
		var vm = this;
        $scope.pageModel = {};
		$scope.search = {};
		//分页表格
	    $scope.find = function(pageNo){
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/contractManagement/allList.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
	    }
	    //$scope.find();
	    //新增修改弹出框
	    vm.showEditModal = function(item){
	    	var modal = $uibModal.open({
				animation: false,
				templateUrl: '../view/contract/create/modal.addOrEdit.html',
				controller: 'EditModalCtrl',
				resolve: {
					contract: item
				}
			});
			modal.result.then(function (){
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
	    }
	    //状态详情
	    vm.showDetail = function(item){
	    	if(item.auditingStatus == 0){
	    		return;
	    	}
	    	var param={id: item.contractId,isPass:(item.auditingStatus == 2?true:false)};
	    	var modal = $uibModal.open({
	    		animation: false,
	    		templateUrl: '../view/contract/create/modal.statusDetail.html',
	    		controller: 'DetailModalCtrl',
	    		resolve: {
	    			param: param
	    		}
	    	});
	    	modal.result.then(function () {
	    		//$scope.find();
	    	}, function () {
	    		console.info('Modal dismissed at: ' + new Date());
	    	});
	    }
	    //提交
	    vm.submit = function(id){
	    	$http.get("/ovu-pcos/pcos/contractManagement/submit.do?contractId="+id).success(function (data, status, headers, config) {
				if (data.success) {
					msg("操作成功!");
					$scope.find();
				} else {
					alert();
				}
			})
	    }
	    //删除
	    vm.del = function(id){
			confirm("确认删除该记录?",function(){
				$http.get("/ovu-pcos/pcos/contractManagement/delete.do?contractId="+id).success(function (data, status, headers, config) {
					if (data.success) {
						msg("操作成功!");
						$scope.find();
					} else {
						alert();
					}
				})
			});
	    }
	    $scope.find();
	}
	 //新增修改弹出框控制器
	app.controller('EditModalCtrl',EditModalCtrl);
	function EditModalCtrl($scope,$timeout,$uibModalInstance,$http,fac,contract){
		var vm = $scope.vm = this;
		vm.item=angular.copy(contract) || {};
		//vm.item.fileName=contract && contract.docUrl.substring(contract.docUrl.lastIndexOf('/')+1);

		vm.save = function (form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}
			var param=angular.copy(item);
			delete param.createTime;
			delete param.auditingTime;
			$http.post("/ovu-pcos/pcos/contractManagement/edit.do", param, fac.postConfig).success(function (data, status, headers, config) {
				if (data.success) {
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert();
				}
			})
		}
		vm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		//选择合同
		/*vm.selectDoc =function (item){
			var param={url:"/ovu-pcos/upload/document.do",accept:'*'};
			fac.upload(param,function(resp){
				if(resp.status==1){
					vm.item.docUrl=resp.url;
					vm.item.fileName=resp.fileName;
					$scope.$apply();
				}else{
					alert(resp.error);
				}
			})
		}*/

	}
	//新增修改弹出框控制器
	app.controller('DetailModalCtrl',DetailModalCtrl);
	function DetailModalCtrl($scope,$uibModalInstance,$http,fac,param){
		var vm = $scope.vm = this;
		//是否通过
		vm.isPass=param && param.isPass;
		if(fac.isNotEmpty(param)){
			$http.get("/ovu-pcos/pcos/contractManagement/auditingStatus.do?contractId="+param.id).success(function (data, status, headers, config) {
				if (fac.isNotEmpty(data)) {
					vm.item = data;
				} else {
					alert();
				}
			})
		}

		vm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}
})()
