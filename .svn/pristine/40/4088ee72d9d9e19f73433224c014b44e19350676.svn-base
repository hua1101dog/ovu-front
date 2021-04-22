(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('attendanceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "考勤管理";
        $scope.search = {fromDate:new Date().format("yyyy-MM-dd")};
        $scope.pageModel = {};
        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/megvii/listAttendance', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        if($rootScope.megviiUrls){
            $scope.search.dataPointId = $rootScope.megviiUrls[0].id;
            $scope.find(1);
        }else{
            $http.get("/middleware/dataPoint/list?dataPointType=megvii&pageSize=1000").success(function(resp){
                if(resp.code ==0){
                    $rootScope.megviiUrls = resp.data.data;
                    if($rootScope.megviiUrls.length){
                        $scope.search.dataPointId = $rootScope.megviiUrls[0].id;
                        $scope.find(1);
                    }
                }
            })
        }



    });
})()
