(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('rfidCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "Rfid";
        $scope.search = {};
        $scope.pageModel = {};

      

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/rfid/list', $scope.search, function (data) {
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
                templateUrl: "/view/middleware/rfid.modal.html",
                controller: 'rfidEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    rfid: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该记录吗?", function () {
                $http.get("/middleware/rfid/del?id=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('rfidEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, rfid) {
        var vm = $scope.vm = this;
        $scope.item = rfid;

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }

            $http.post('/middleware/rfid/save', item).success(function (res) {
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
