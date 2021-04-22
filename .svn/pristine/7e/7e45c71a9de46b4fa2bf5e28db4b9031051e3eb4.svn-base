(function () {
    'use strict';
    var app = angular.module("angularApp");
    app.controller("doorRecordCtl", function ($scope, fac, $filter, $state, $uibModal,$rootScope,$http) {
        document.title = "开门记录";
        $scope.pageModel = [];
        $scope.search={};
        
        $scope.STAGE = {};
    	$scope.BUILD = {};
    	$scope.UNIT = {};
    	$scope.FLOOR = {};
    	$scope.HOUSE = {};

        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {

            //     $scope.find();
            // }, function () {
            //     $scope.find();
            // });
            
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId;
                    $scope.search.parkId=$rootScope.dept.parkId;
                    initSpaceTree();
                    $scope.find();
                }
            })

        });


        $scope.showEditModal = function (task) {

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: 'acs/modal.screenshots.html',
                controller: 'modalScreenshotsCtrl',
                resolve: {
                    task: task
                }
            });
            modal.result.then(function () {
                $scope.find();
            })
        }
        $scope.showPlayback = function (task) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: 'acs/modal.cameraInform.html',
                controller: 'modalCameraInformCtrl',
                resolve: {
                    task: task
                }
            });
            modal.result.then(function () {
                $scope.find();
            })

        }
        $scope.find = function (pageNo) {
            // if (!fac.hasActivePark($scope.search)) {
            //     return;
            // }
            if (!$scope.search.deptId||!$rootScope.dept.id) {
                alert("请选择部门！");
                return ;
            }
            
            //设置空间查询条件
            setSpaceCondtion();
            
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });

            fac.getPageResult("/ovu-pcos/pcos/acs/acs_open/queryPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        
        function initSpaceTree(){
        	$scope.STAGE = {};
        	$scope.BUILD = {};
        	$scope.UNIT = {};
        	$scope.FLOOR = {};
        	$scope.HOUSE = {};
        	$scope.HOUSES = [];
        	if(!$scope.search.parkId){
        	    $scope.treeData = [];
        	    return;
        	}
        	$http.post("/ovu-base/system/parkStage/treeNew",{parkId:$scope.search.parkId,level:4},fac.postConfig).success(function(ret){
        		$scope.treeData = ret;
        	})
        }
        $scope.selectFloor = function(){
        	setSpaceCondtion();
        	$http.post("/ovu-base/system/parkHouse/getHouses",{buildId:$scope.search.buildId,
        		unitNo:$scope.search.unitNo,groundNo:$scope.search.groundNo},fac.postConfig).success(function(ret){
        		$scope.HOUSES = ret.data;
        	})
        }
        
        function setSpaceCondtion(){
        	if($scope.STAGE){
        		$scope.search.stageId = $scope.STAGE.id;
        	}else{
        		delete $scope.search.stageId;
        	}
        	if($scope.BUILD){
        		$scope.search.buildId = $scope.BUILD.id;
        	}else{
        		delete $scope.search.buildId;
        	}
        	if($scope.UNIT && $scope.UNIT.data){
        		$scope.search.unitNo = $scope.UNIT.data.unitNo;
        	}else{
        		delete $scope.search.unitNo;
        	}
        	if($scope.FLOOR && $scope.FLOOR.data){
        		$scope.search.groundNo = $scope.FLOOR.data.floorNo;
        	}else{
        		delete $scope.search.groundNo;
        	}
        	if($scope.HOUSE){
        		$scope.search.houseId = $scope.HOUSE.id;
        	}else{
        		delete $scope.search.houseId;
        	}
        }
    })
    app.controller('modalScreenshotsCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, task) {

        $scope.item = task.imagePaths || "";
        $scope.item = $scope.item.split(",") || [];
        if (!$scope.item) {
            alert('该开门记录没有截图');

        }
        $scope.save = function () {
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');

        };
    });
    //摄像机列表ctrl
    app.controller('modalCameraInformCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, task) {
        $scope.item = task;
        var myJsDate=$filter('date')(task.openerOpenTime,'yyyy-MM-dd HH:mm:ss');
        $scope.endTime= getTime(myJsDate,true);
        $scope.startTime= getTime(myJsDate);
        
        if(fac.isNotEmpty($scope.item.equipmentId) && ($scope.item.equipmentId!=='null')){
            $http.get('/ovu-pcos/api/video/getCameras.do?equipmentId='+$scope.item.equipmentId).success(function(res){
                if(res.code ==0 ){
                    //摄像头列表
                    $scope.pageModel= res || [];
                }
            })
        }else{
            alert("未指定摄像机！")
        }   
        function getTime(startTime ,arithmetic){
            var nd = new Date(Date.parse(startTime.replace(/-/g, "/"))); //改为标准格式：2016/04/05 09:29:15 
            nd = nd.valueOf(); //转换为毫秒数
            if(arithmetic){
                nd = nd +  15  * 1000;
            }else{
                nd = nd -  15  * 1000;
            }
            return  nd; //
        
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');

        };
    });
})()
