// 项目版统计概览 by Cx
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('singleOverviewCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "统计概览";
        $scope.pageModel = {};
        $scope.search={};
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {
            //     $scope.find();
            // }, function () {
            //     $scope.find();
            // })
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.find(deptId);   
                   
                }
            })
        });

        //列表查询
        $scope.find = function (id) {
            $http.get("/ovu-pcos/pcos/reportstatnew/getOverviewProject?deptId="+id).success(function(data){
                $scope.total = data;
                $scope.equipmentRange=Math.round(data.equipments/data.area*100)/100  || 0  //设备比值(设备数量/项目面积)
                $scope.sennorsRange=Math.round(data.sennors/data.area*100)/100  || 0  //传感器比值(传感器数量/项目面积) 
                $scope.equipmentSennorsRange=Math.round(data.sennors/data.equipments*100)/100 || 0   //设备&传感器比值) 
                $scope.personsRange=Math.round(data.persons/data.area*100)/100   || 0  //人员比值(人员数/项目面积)
            });
        };

      

    });

   
})();