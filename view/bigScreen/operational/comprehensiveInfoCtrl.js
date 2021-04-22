(function() {
    var app = angular.module("angularApp");
    app.controller('comprehenInfoCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,$location, fac) {		
    	document.title = "OVU-综合报表";
    	$scope.search = {};
    	$scope.compParams = {};
    	//获得信息
        $scope.getInfo = function(){
        	$http.post("/ovu-park/backstage/operational/comprehensiveInfo/selectByParkId",$scope.search,fac.postConfig).success(function(resp){
                if(resp.code == 0){
                	$scope.compParams = resp.data;
                }else{
                    window.alert(resp.message);
                }
            });
        }
        //计算服务总额
        $scope.getTotal = function(){
        	 $scope.compParams.scServiceTotal =  $scope.compParams.scMarketDocking 
        	 + $scope.compParams.scPublicity
        	 + $scope.compParams.scFinancialService
        	 + $scope.compParams.scTalentService
        	 +  $scope.compParams.scComplaintHandling;
        }
    	//保存信息
        $scope.save = function(form){
        	if(!form.$valid) {
                window.alert('请填写正整数！');
                return false;
            }
        	$scope.compParams.parkId = $scope.search.parkId;
        	$scope.compParams.parkNo = $scope.search.parkNo;
        	$scope.compParams.parkName = $scope.search.parkName;
        	$http.post("/ovu-park/backstage/operational/comprehensiveInfo/saveOrUpdate",$scope.compParams,fac.postConfig).success(function(resp){
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
                $scope.getInfo();
            })
        })
    });
})()
