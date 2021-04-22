(function(){
	"use strict";
    var app = angular.module("angularApp");
	
	app.controller('advertisementPubCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
		document.title = '信息预告管理';
        $scope.pageModel = {};
        $scope.search = {};
        
        app.modulePromiss.then(function () {
        	$scope.$watch('dept', function (deptO, oldValue) {
            	var deptCopy = angular.copy(deptO);
                if(deptCopy.id != $scope.search.deptId){
                	$scope.search.deptId = deptCopy.id;
                //	$scope.search.parkId = deptCopy.parkId;
                }
            	$scope.init();
            },true)
        //	$scope.init();
        })
        
        $scope.init = function(){
        	$scope.find();
        }
        
        $scope.find = function (pageNo) {

            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/guideScreen/getGuideADList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        
        // 新增，编辑
        $scope.showEditModal = function (item) {
            var copy = angular.extend({deptId:$scope.search.deptId}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/guideManage/advertiementPub/modal.editAdvertisement.html',
                controller: 'advertisementEditModelCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        
        $scope.del = function(item){
        	confirm("确认删除吗?", function () {
	        	$http.post("/ovu-gallery/guideScreen/deleteGuideAD?ids="+item.id).success(function(result){
	        		if(result.code == 0){
	        			msg("删除成功！");
	        			$scope.find();
	        		}else{
	        			alert("删除失败！");
	        		}
	        	})
	        })
        }
	});
	
	//新增编辑
	app.controller('advertisementEditModelCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
		$scope.item = angular.copy(param);
		$scope.SORT = [1,2,3,4,5]
		$scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            if(!item.imagePath){
            	alert("请选择图片")
            	return;
            }
            
            $http.post('/ovu-gallery/guideScreen/editGuideAD', item,fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        //从资料库中选择
		//type 1-图片,2-音频，3-视频
		$scope.selectFromDb = function(type){
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/publishManagement/modal.materialsSelect.html',
                controller: 'AdvImageSelModelCtrl',
                resolve: {
                    Param: {type:type,deptId:$scope.item.deptId}
                }
            });
            modal.result.then(function (data) {
            	$scope.item.imagePath = data.filePath;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
		}
	});
	
	//从资料库中选择
    app.controller('AdvImageSelModelCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, Param) {
    	$scope.pageModel = {};
    	$scope.searchDbs = {};
    	$scope.search = {};
    	$scope.selectedFile ;
    	$scope.canSelect = true;
    	var param = Param.type;
    	
    	$scope.MATERIALTYPE = [{key:0,value:"图片"},{key:1,value:"画册"},{key:2,value:"音频"},
    		{key:3,value:"视频"},{key:4,value:"文档"}]
    	$scope.init = function(){
    		if(!param || param == 1){
    			$scope.matrialType = 0;
	    	}else if(param == 2){
	    		$scope.matrialType = 2;
	    	}else if(param == 3){
	    		$scope.matrialType = 3;
	    	}
	    	$scope.getMaterialDbs();
    	}
    	
    	app.modulePromiss.then(function(){
    		$scope.init();
    	})
    	
    	//获取资料库下拉
    	$scope.getMaterialDbs = function(pageNo){
    		
    		$.extend($scope.searchDbs, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 1000000
            });
            $scope.searchDbs.pageIndex = $scope.searchDbs.currentPage - 1;
            $scope.searchDbs.type = $scope.matrialType;
            $scope.searchDbs.deptId = Param.deptId;
            fac.getPageResult("/ovu-gallery/docs/getFolderList", $scope.searchDbs, function (data) {
                $scope.MATERIALDBS = data.data;
            });
    	}
    	
    	//获取资料
    	$scope.find = $scope.getMaterials = function(pageNo){
    		
    		$.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/docs/getFileList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
    	}
    	
    	$scope.selectFile = function(o){
    		console.log(o.id);
    		$scope.selectedFile = o;
    	}
    	
    	$scope.save = function () {
    		if(!$scope.selectedFile || !$scope.selectedFile.id){
    			alert("请选择文件");
    			return;
    		}
			$uibModalInstance.close($scope.selectedFile);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
