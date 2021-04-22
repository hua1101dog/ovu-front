(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('YBSBCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac){
    $scope.search = {equipType : 1, isHandled : 0, timeType :1};
    $scope.pageModel = {};

    $scope.find = function (pageNo) {
        if (!fac.hasActivePark($scope.$parent.search)) {
            return;
        }
        if (!$scope.search.SOURCE_NAME) {
            delete $scope.search.sourceUserId;
        }
        if (!$scope.search.EXEC_NAME) {
            delete $scope.search.execPersonId;
        }
        $scope.search.equipType = 1;
        $.extend($scope.search, $scope.$parent.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
        fac.getPageResult("/ovu-energy/energy/monitor/alarm/list", $scope.search, function (data) {
            $scope.pageModel = data;
        });
    };
    app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
            $scope.find(1);
        }, function () {
            $scope.find(1);
        })
    })
    $scope.$on("YBSB", function () {
        $scope.find();
    });
   });
    app.controller('BPDCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = {equipType : 2, isHandled : 0 , timeType :1};
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            if (!fac.hasActivePark($scope.$parent.search)) {
                return;
            }
            if (!$scope.search.SOURCE_NAME) {
                delete $scope.search.sourceUserId;
            }
            if (!$scope.search.EXEC_NAME) {
                delete $scope.search.execPersonId;
            }
            $scope.search.equipType = 2;
            $.extend($scope.search, $scope.$parent.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-energy/energy/monitor/alarm/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            }, function () {
                $scope.find(1);
            })
        })
        $scope.$on("BPD", function () {
            $scope.find();
        });
    });
   app.controller('alarmsCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "报警管理";
        $scope.search = { curTab: "YBSB" };
        $scope.setCurTab = function(tab){
            if($scope.search.curTab!=tab){
                $scope.search.curTab = tab;
                $scope.$broadcast($scope.search.curTab);
            }
        };
        app.modulePromiss.then(function() {
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
                $scope.$broadcast($scope.search.curTab);
            })
            /*fac.initPage($scope,function(){
                $scope.$broadcast($scope.search.curTab);
            },function(){

            })*/
        });
        $scope.fn=function(){
            $scope.$broadcast($scope.search.curTab);
        }
    });
  
})();
