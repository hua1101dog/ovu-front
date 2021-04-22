/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('imosCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "监控服务设备管理";

        $scope.search = {};
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        })
        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/imos/pageList.do', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        //添加监控服务设备管理

        $scope.showEditModal = function (task) {

            var copy=angular.extend({},task)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/imos/modal.imosEdit.html",
                controller: 'imosEditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    task: copy
                }
            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该设备吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/imos/delete.do?id=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
            })
        }

    });
    app.controller('imosEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac, task) {
        var vm = $scope.vm = this;
        $scope.item={}
        $http.get("/ovu-camera/pcos/videomanagement/hardware/list.do").success(function (data, status, headers, config) {
            $scope.hardwareList = data;

        });
        if (fac.isNotEmpty(task.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/imos/get.do', { params: { id: task.id } }).success(function (res) {
                angular.extend($scope.item, res);
            })
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.createTime;
            $http.post('/ovu-camera/pcos/videomanagement/imos/edit.do', item, fac.postConfig).success(function (res) {
                if (res.success) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    $uibModalInstance.close();
                    msg("操作失败!");
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
})();
