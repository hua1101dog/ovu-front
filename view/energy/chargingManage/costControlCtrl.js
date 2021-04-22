/**
 * Created by HY on 2018/10/24.
 * no break
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 缴费Controller
    app.controller('costControlCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '费控计算';
        $scope.pageModel = {};
        $scope.search = {};

        // 页面初始化
        app.modulePromiss.then(function () {
            app.modulePromiss.then(function(){
            	$scope.$watch('dept.id', function (deptId, oldValue) {
	                if (deptId) {
	                    if ($scope.dept.parkId) {
	                        $scope.search.parkId = $scope.dept.parkId;
	                        $scope.search.parkName = $scope.dept.parkName;
	                    } else {
                            alert('请选择跟项目关联的部门');
                            $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
	                    }
	                }
	                $scope.init()
            	})
            	
                /*$scope.search = {isGroup:fac.isGroupVersion()};
                if($scope.search.isGroup){
                    $scope.init()
                }else{
                    $scope.$watch('park',function(newValue,oldValue){
                        if(newValue && newValue.id) {
                        	console.log("切换项目")
                            $scope.search.parkId = newValue.id;
                            $scope.search.parkName = newValue.parkName;
                            $scope.init()
                        }else{
                        	//当没有选择项目时，会导致没有表头，需要处理
                        	$scope.init()
                            alert("请先选定一个项目");
                        }
                    })
                }*/
            })
        })
        
        //初始化，获取表头以及下拉选项值
        //列表，默认不展示，选择年份再展示
        $scope.init=function(){
        	$scope.search.time = new Date().getFullYear();
            getFields();
        }
		//初始化表头
		function getFields(){
				if($scope.search.parkId){
					$http.get("/ovu-energy/energy/billing/classify?parkId="+$scope.search.parkId).success(function (resp) {
	                var fields = {classifyId:'month',name:$scope.search.time + "年"};
	                $scope.fields = resp.data;
	                $scope.fields.splice(0,0,fields);
	                $scope.find();
	            });
			}
		}
		
		$scope.$watch("search",function(newValue,oldValue){
        	if(newValue.time != oldValue.time){
        		$scope.changeYears();
        	}
        },true)
		
        $scope.changeYears=function () {
        	if(!$scope.search.time){
        		$scope.search.time = new Date().getFullYear();
        	}
        	getFields();
        }

        // 查询
        $scope.find = function (pageNo) {
        	if(!$scope.search.parkId){
        		alert("请先选定一个项目！");
        		return;
        	}
        	$scope.hasClassify = false;
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/billing/list", $scope.search, function (resp) {
                var pageModel = {};
                //判断是否有分类信息
                if(resp && resp.length>0){
                	var tempMap = resp[0];
                	for(var key in tempMap){
                		if(key != 'month'){
                			$scope.hasClassify = true;
                			break;
                		}
                	}
                }
				pageModel.data = resp;                	
                $scope.pageModel = pageModel;
            });
        }
        // 编辑缴费单
    });
})();
