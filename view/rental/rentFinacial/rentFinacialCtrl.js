(function() {
    var app = angular.module("angularApp");
    app.controller('rentFinacialCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {		
    	 $scope.search = {}
    	 $scope.status = [
    	            {value:"2",text:"欠缴"},
    	            {value:"1",text:"已缴"},
    	            {value:"0",text:"未缴"}
    	        ]
    	 // 获取列表
         $scope.pageModel ={};
         $scope.find = function(pageNo){
 			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
 			$scope.search.pageIndex = $scope.search.currentPage-1;
             $scope.search.totalCount = $scope.pageModel.totalCount||0;
             $scope.search.parkId = app.park.parkId;
 			fac.getPageResult("/ovu-park/backstage/rental/contractBill/list", $scope.search,function(data){	
                 $scope.pageModel = data;
 			});
 		};
        
        //计算月租金
        $scope.getMonthRent = function(averageUnitPrice, contractArea){
        	return parseInt(averageUnitPrice)*parseInt(contractArea);
        }
        //缴费
        $scope.updateStatus = function(id, billDateStart, billDateEnd,status){
            var cache = status==1?'缴费':'欠缴'
             var param ={
                 "id":id,
                 "status":status
             }
             confirm("账单周期"+billDateStart+"至"+billDateEnd+"， 确认"+cache+"?", function () {
                 $.post("/ovu-park/backstage/rental/contractBill/pay", param, function (resp) {
                     if(resp.code==0){
                         window.msg("已"+cache);
                         $scope.find();
                     }else{
                         window.alert(resp.message);
                     }
                 });
             })
         }
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });
    });
    app.filter("finacialStatus", function () {
        return function (status) {
            switch (status) {
                case '0':
                    return '未缴';
                    break;
                case '1':
                    return '已缴';
                    break;
                case '2':
                    return '欠缴';
                    break;
            }
        }
    })
})()
