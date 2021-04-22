(function () {
    var app = angular.module("angularApp");
    app.controller('parameterSetCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "租约参数设置";
        $scope.search = [];
        $scope.searchCache = [];
        // 列表
        $scope.find = function () {
            $http.post("/ovu-park/backstage/rental/contractParam/selectParam?parkId="+app.park.parkId, fac.postConfig).success(function (resp) { 
                if (resp.code === 0) {
                    $scope.search = resp.data;
                    $scope.searchCache = angular.copy($scope.search);
                } else {
                    window.alert(resp.message);
                }
            });
        };
        // 保存
        $scope.save = function (item, index) {
            if (item.value === $scope.searchCache[index].value) {
                return false;
            }
            if (!item.value) {
                window.alert("此项不能为空!");
                return false;
            }
            $http.post("/ovu-park/backstage/rental/contractParam/saveParam", $scope.search[index], fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.searchCache[index] = angular.copy($scope.search[index]);
                    window.msg(resp.message);
                } else {
                    window.alert(resp.message);
                }
            })
        }

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });
})()
