(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('suntransCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "三川电量";
        $scope.search = {};
        $scope.pageModel = {};

      

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/screen-api/list', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        $scope.find(1);
        //添加
        $scope.showEditModal = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/suntrans.modal.html",
                controller: 'suntransEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    suntrans: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该记录吗?", function () {
                $http.get("/middleware/screen-api/del?id=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('suntransEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, suntrans) {
        var vm = $scope.vm = this;
        $scope.item = suntrans;

        fac.getPageResult('/middleware/screen-api/dataPoints', {}, function (pageModel) {
            $scope.dpIds = pageModel.data;
        })

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }

            $http.post('/middleware/screen-api/save', item).success(function (res) {
                if (res.code == 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(res.msg);
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })

})()
