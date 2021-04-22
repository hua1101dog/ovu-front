(function() {
    var app = angular.module("angularApp");
    app.controller('parkProfileCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,$location, fac) {
    	document.title = "OVU-园区概况";
    	$scope.parkParams = {};
    	//保存园区信息
        $scope.savePark = function(form){
        	if(!form.$valid) {
                window.alert('请根据类别填写正整数或者最多两位小数的正数！');
                return false;
            }
        	if($scope.parkParams.isEnabled){
				$scope.parkParams.isEnabled = 1;
			}else{
				$scope.parkParams.isEnabled = 0;
			}
        	$http.post("/ovu-park/backstage/enterprise/park/saveOrUpdate",$scope.parkParams,fac.postConfig).success(function(resp){
        		if(resp.code == 0){
                	window.msg("保存成功！");
                	if($scope.parkParams && $scope.parkParams.isEnabled){
        				$scope.parkParams.isEnabled = true;
        			}else{
        				$scope.parkParams.isEnabled = false;
        			}
                }else{
                    window.alert(resp.message);
                }
            });
        }
        //获取园区信息
        $scope.findPark = function(){
        	$http.post("/ovu-park/backstage/enterprise/park/getParkInfo",$scope.parkParams,fac.postConfig).success(function(resp){
        		if(resp.code == 0){
        			if(resp.data){
        				$scope.parkParams = resp.data;
        			}
        			if($scope.parkParams && $scope.parkParams.isEnabled){
        				$scope.parkParams.isEnabled = true;
        			}else{
        				$scope.parkParams.isEnabled = false;
        			}
                }
        	});
        }
        //初始或刷新页面
    	app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.parkParams.parkId = app.park.parkId;
            	$scope.parkParams.parkNo = app.park.parkNo;
            	$scope.parkParams.parkName = app.park.parkName;
            	$scope.findPark();
            })
        })
    });
})()