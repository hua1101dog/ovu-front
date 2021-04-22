(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('proxyCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "内网代理管理";
        $scope.search = {};
        $scope.pageModel = {};

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/proxy/list', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        $scope.find(1);

        $scope.showEditModal = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/proxy.modal.html",
                controller: 'proxyEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    proxy: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该代理吗?", function () {
                $http.get("/middleware/proxy/del?ids=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('proxyEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, proxy) {
        var vm = $scope.vm = this;
        $scope.item = proxy;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.optime;

            $http.post('/middleware/proxy/save', item).success(function (res) {
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
