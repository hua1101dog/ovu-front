(function() {
		var app = angular.module("angularApp");
		app.controller('guideCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {		
			document.title ="OVU-公众号管理";
			angular.extend($rootScope,fac.dicts);
			$scope.search = {};
			$scope.pageModel = {};
			
			$scope.find = function(pageNo){
				if(!app.park || !app.park.parkId){
					window.msg("请先选择一个项目!");
					return false;
				}
				if($scope.search.beginOpenTime && $scope.search.beginOpenTime.length <= 15){
					$scope.search.beginOpenTime = $scope.search.beginOpenTime+' 00:00:00'
				}
				if($scope.search.endOpenTime && $scope.search.endOpenTime.length <= 15){
					$scope.search.endOpenTime = $scope.search.endOpenTime+' 23:59:59'
				}
				$scope.search.parkId = app.park.parkId;
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				fac.getPageResult("/ovu-park/weixin/openLog/getOpenLogList",$scope.search,function(data){		
					console.log(data);
					$scope.pageModel = data;
				});
			};										
			
			
			app.modulePromiss.then(function() {
	            fac.initPage($scope,function(){
	            	$scope.find();
	            })
	        });
		});	
		
	})()