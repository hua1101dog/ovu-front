(function() {
    var app = angular.module("angularApp");
    app.controller('parkInfoCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,$location, fac) {		
    	document.title = "OVU-园区大屏";
    	$scope.search = {};
    	$scope.selectPark = true;
    	$scope.stageId;
    	$scope.checkFlag = 'park';
    	$scope.parkParams = {};
    	$scope.stageParams = {};
    	// 获得分期
        $scope.getStageList = function(){
            $http.post("/ovu-park/backstage/operational/stageInfo/findStagesByParkId", $scope.search, fac.postConfig).success(function (resp) {
                if(resp.code == 0){
                    $scope.stageList = resp.data;
                    console.log(resp.data);
                }else{
                    window.alert(resp.message);
                }
            });
        }
        //点击tab切换
        $scope.checkTab = function(stageId, stageNo, stageName){
        	if(stageId){//选择了分期
        		$scope.search.stageId = stageId;
            	$scope.search.stageNo = stageNo;
            	$scope.search.stageName = stageName;
        		$scope.selectPark = false;
            	$scope.stageId = stageId;
            	$scope.checkFlag = 'stage';
            	$scope.getStage();
        	}else{//选择了园区
        		$scope.selectPark = true;
            	$scope.stageId = null;
            	$scope.checkFlag = 'park';
            	$scope.getPark();
        	}
        }
        //获得园区信息
        $scope.getPark = function(){
        	$http.post("/ovu-park/backstage/operational/parkInfo/selectByParkId",$scope.search,fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.parkParams = resp.data;
                }else{
                    window.alert(resp.message);
                }
            });
        }
        //保存园区信息
        $scope.savePark = function(form){
        	if(!form.$valid) {
                window.alert('请根据类别填写正整数或者最多两位小数的正数！');
                return false;
            }
        	$scope.parkParams.parkId = $scope.search.parkId;
        	$scope.parkParams.parkNo = $scope.search.parkNo;
        	$scope.parkParams.parkName = $scope.search.parkName;
        	$http.post("/ovu-park/backstage/operational/parkInfo/saveOrUpdate",$scope.parkParams,fac.postConfig).success(function(resp){
        		if(resp.code == 0){
                	window.msg("保存成功！");
                }else{
                    window.alert(resp.message);
                }
            });
        }
       //获得分期信息
        $scope.getStage = function(){
        	$http.post("/ovu-park/backstage/operational/stageInfo/selectByParkId",$scope.search,fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.stageParams = resp.data;
                }else{
                    window.alert(resp.message);
                }
            });
        }
        //保存分期信息
        $scope.saveStage = function(form){
        	if(!form.$valid) {
                window.alert('请根据类别填写正整数或者最多两位小数的正数！');
                return false;
            }
        	$scope.stageParams.parkId = $scope.search.parkId;
        	$scope.stageParams.parkNo = $scope.search.parkNo;
        	$scope.stageParams.parkName = $scope.search.parkName;
        	$scope.stageParams.stageId = $scope.search.stageId;
        	$scope.stageParams.stageNo = $scope.search.stageNo;
        	$scope.stageParams.stageName = $scope.search.stageName;
        	$http.post("/ovu-park/backstage/operational/stageInfo/saveOrUpdate",$scope.stageParams,fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	window.msg("保存成功！");
                }else{
                    window.alert(resp.message);
                }
            });
        }
        //初始或刷新页面
    	app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.getPark();
                //接口发生了改变，目前园区大屏不对接新版本
                $scope.getStageList();
            })
        })
    });
})()
