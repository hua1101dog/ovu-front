(function() {
		var app = angular.module("angularApp");
		app.controller('userCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {		
			document.title ="OVU-公众号管理";
			angular.extend($rootScope,fac.dicts);
			$scope.search = {};
			$scope.pageModel = {};
			
			$scope.find = function(pageNo){
				if(!app.park || !app.park.parkId){
					window.msg("请先选择一个项目!");
					return false;
				}
				if($scope.search.beginCreateTime && $scope.search.beginCreateTime.length <= 15){
					$scope.search.beginCreateTime = $scope.search.beginCreateTime+' 00:00:00'
				}
				if($scope.search.endCreateTime && $scope.search.endCreateTime.length <= 15){
					$scope.search.endCreateTime = $scope.search.endCreateTime+' 23:59:59'
				}
				$scope.search.parkId = app.park.parkId;
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				fac.getPageResult("/ovu-park/weixin/user/listUser",$scope.search,function(data){		
					console.log(data);
					$scope.pageModel = data;
				});
				$http.post("/ovu-park/weixin/user/countNewUser", {}, fac.postConfig).success(function(resp){
		            if(resp.code){
		            	$scope.countUsers = resp.data;
		            }
		        });
			};										
			
			
			app.modulePromiss.then(function() {
	            fac.initPage($scope,function(){
	            	$scope.find();
	            })
	        });
		});	
		
		app.filter("sexType",function(){//转换问卷状态数字
			return function(item) {
				var value = item;
				if(value == "2"){
					return "女";
				} else if(value == "1"){
					return "男";
				} else if(value == "0"){
					return "未填写";
				}
		    }
	    });
		
	})()