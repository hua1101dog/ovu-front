(function(){
	"use strict";
    var app = angular.module("angularApp");
	
	app.controller('appointmentCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
		document.title = '预约管理';
        $scope.pageModel = {};
        $scope.search = {};
        $scope.DATEOPTIONS = [{key:1,value:'今天'},{key:2,value:'一周内'},{key:3,value:'一月内'}];
        $scope.COMFIRMSTATUS = [{key:"0",value:'待确认'},{key:"1",value:'已确认'}];
        $scope.RESERVATIONCHANNEL  = [{key:'微信',value:'微信'},{key:'官网',value:'官网'}];
        
        app.modulePromiss.then(function () {
            $scope.init();
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
           fac.getPageResult("/ovu-gallery/art/bespeak/baseListPage",$scope.search,function(data){
            	var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        
        $scope.confirmEdit = function(item){
        	confirm("正在进行确认操作，请确认", function () {
	        	$http.post("/ovu-gallery/art/bespeak/baseUpdate",{id:item.id,state:1}).success(function(result){
	        		if(result.code == 0){
	        			msg("操作成功！");
	        			$scope.find();
	        		}else{
	        			alert("操作失败！");
	        		}
	        	})
	        })
        }
        
        $scope.del = function(item){
        	confirm("确认删除吗", function () {
	        	$http.post("/ovu-gallery/art/bespeak/baseDelete",{id:item.id}).success(function(result){
	        		if(result.code == 0){
	        			msg("删除成功！");
	        			$scope.find();
	        		}else{
	        			alert("删除失败！");
	        		}
	        	})
	        })
        }
	})
})()
