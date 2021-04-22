(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('spaceIntroduceCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $state, $location) {

        $scope.params = {};
$scope.search = {};
        $scope.pics1 = [];
        $scope.pics2 = [];
        var park;
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName;
                        if ($scope.search.parkId) {
                            $http.post("/ovu-base/system/park/getWithPath", {
                                ids: $scope.search.parkId
                            }, fac.postConfig).success(function (resp) {
                                if (resp.data && resp.data.length > 0) {
                                    park = resp.data[0];
                                }
                            })
                        } else {
                            park = undefined;
                        }
                    } else {
                        $scope.search = {};
                    }
                } else {
                    $scope.search = {};
                }
                $scope.find();
            })
        });

        $scope.find = function () {
            $scope.params = {};
            $scope.pics1 = [];
            $scope.pics2 = [];
            var parkId = $scope.search.parkId || app.park.parkId || app.park.id;
            $http.get('/ovu-base/system/park/viewParkIntroduce?parkId=' + parkId).success(function (resp) {
                if (resp.code === 0) {
                    if (resp.data) {
                        $scope.params = resp.data;
                        if ($scope.params.createTime)
                            delete $scope.params.createTime;
                        if ($scope.params.updateTime)
                            delete $scope.params.updateTime;
                        if ($scope.params.parkSupport)
                            $scope.pics1 = [$scope.params.parkSupport];
                        if ($scope.params.parkService)
                            $scope.pics2 = [$scope.params.parkService]
                    }
                } else {
                    alert(resp.msg)
                }
            });
        }
        $scope.find()
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if ($scope.pics1[0])
                $scope.params.parkSupport = $scope.pics1[0];
            if ($scope.pics2[0])
                $scope.params.parkService = $scope.pics2[0];
            $scope.params.parkId = $scope.search.parkId || app.park.parkId || app.park.id;

            var reg01 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
            var reg02 = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
            if (!reg01.test($scope.params.phone) && !reg02.test($scope.params.phone)) {
                alert('请输入正确联系方式')
                return;
            }



            $http.post('/ovu-base/system/park/saveParkIntroduce', $scope.params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    msg(resp.msg);
                } else {
                    alert(resp.msg)
                }
            })
        };
    });
})();
