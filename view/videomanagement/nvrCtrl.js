/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('nvrCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "NVR设备管理";
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
            fac.getPageResult('/ovu-camera/pcos/videomanagement/nvr/pageList.do', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        //添加硬盘录像机

        $scope.showEditModal = function (task) {
            var copy = angular.extend({}, task)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/nvr/modal.nvrEdit.html",
                controller: 'nvrEditModalCtrl',
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
                $http.get("/ovu-camera/pcos/videomanagement/nvr/delete.do?id=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();

                    } else {
                        alert();
                    }
                })
            })
        }

    });
    app.controller('nvrEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac,task) {
        var vm = $scope.vm = this;
        $scope.item={};
        if (fac.isNotEmpty(task.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/nvr/get.do', { params: { id: task.id } }).success(function (res) {
                angular.extend($scope.item, res);
            })
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.createTime;
            $http.post('/ovu-camera/pcos/videomanagement/nvr/edit.do', item, fac.postConfig).success(function (res) {
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
