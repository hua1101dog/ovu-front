(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('strangerHistoryCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "陌生人记录";
        $scope.pageModel = {};
        $scope.search={};
        app.modulePromiss.then(function(){
            getDoors();
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept=fac.getParkDept(null,deptId);
                    if(parkDept){
                        $scope.search.parkId=parkDept.parkId;
                        $scope.search.parkName=parkDept.parkName;
                    }
                    $scope.find(1);
                }
            })
        });

        //列表查询
        $scope.find = function (pageNo) {
            //项目判断
            if(!fac.hasSpecialPark($scope.search)){
                $scope.pageModel = {};
                return;
            }

            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/face/strangerHistory.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.findParkCallback=function () {
            $scope.find(1);
            if(fac.hasSpecialPark($scope.search)){
                getDoors();
            }
        }

        function getDoors() {
            var ds=[4,5,19,22,24,10,23,26];
            $http.get("/ovu-pcos/face/doors").success(function (resp) {
                if (resp.code == 0) {
                    $scope.doors=resp.data.filter(function (item) {
                        return ds.indexOf(item.id)!=-1;
                    });
                }
            })
        }
    });
})();
