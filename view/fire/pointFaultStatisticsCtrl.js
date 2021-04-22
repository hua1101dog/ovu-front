/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('pointFaultStatisticsCtrl', function ($scope,$rootScope, $http,fac) {
        document.title ="消防点故障统计";
        var vm = this;
        /*fac.setParkTree($scope);*/
        $scope.pageModel = {};
        $scope.search = {};
        //项目列表
        $http.get('/ovu-pcos/pcos/liftreport/center/multi/projectlist.do').success(function(resp) {
            $scope.projectsList = resp;
        });
        
        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/fire/workUnitStatistical/getFirepointUnit.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
     
        //根据项目查询
        vm.searchProject = function (id) {
			$scope.search.parkId = id;
            $scope.find();
        }
        $scope.find();
    });


})();