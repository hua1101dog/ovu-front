(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('pushUrlCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "推送地址管理";
        $scope.search = {};
        $scope.pageModel = {};


        !$rootScope.companyEnum && $http.get("/middleware/proxy/companyEnum").success(function (resp) {
            if (resp.code == 0) {
                $rootScope.companyEnum = resp.data;
            }
        })

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/middleware/pushUrl/list', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        $scope.find(1);

        $scope.showEditModal = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/pushUrl.modal.html",
                controller: 'pushUrlEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    pushUrl: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该推送地址吗?", function () {
                $http.get("/middleware/pushUrl/del?ids=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }

        $scope.clearRedisById = function (item) {
            item.pushUrlId = item.id;
            confirm("清除redis缓存？", function () {
                $http.post('/middleware/easylinkin/clearRedisById', item).success(function (res) {
                    if (res.code == 0) {
                        msg("清除成功!");
                        $scope.find();
                    } else {
                        alert(res.msg);
                    }
                })
            })
        }
    });
    app.controller('pushUrlEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, pushUrl) {
        var vm = $scope.vm = this;
        $scope.item = pushUrl;

        fac.getPageResult('/middleware/proxy/list', {}, function (pageModel) {
            $scope.proxyList = pageModel.data;
        })

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }

            $http.post('/middleware/pushUrl/save', item).success(function (res) {
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
