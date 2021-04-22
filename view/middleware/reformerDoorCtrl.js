(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('reformerDoorCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "立方门禁";
        $scope.search = {};
        $scope.pageModel = {};

      

        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/api/reformer/list', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }

        $scope.showHistory = function(item){
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/middleware/reformerDoor.history.html',
                controller: 'reformerDoorHistoryCtrl',
                resolve: {
                    item: function () { return item;}
                }
            });
            modal.result.then(function () {
            }, function () {
            });
        }

        $scope.find(1);
        //添加门禁设备
        $scope.showEditModal = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: "/view/middleware/reformerDoor.modal.html",
                controller: 'reformerDoorEditCtrl',
                controllerAs: 'vm',
                resolve: {
                    reformerDoor: copy
                }
            })
            modal.result.then(function () {
                $scope.find();
            })
        }
        //删除设备
        $scope.del = function (id) {
            confirm("确认删除该记录吗?", function () {
                $http.get("/middleware/api/reformer/del?id=" + id).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            })
        }
    });
    app.controller('reformerDoorEditCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, reformerDoor) {
        var vm = $scope.vm = this;
        $scope.item = reformerDoor;
        $http.post('/middleware/api/reformer/getDataPoint').success(function (res) {
            if (res.code == 0) {
                $scope.codeList=res.data
            } else {
                alert(res.msg);
            }
        })
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }

            $http.post('/middleware/api/reformer/save', item).success(function (res) {
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

    app.controller('reformerDoorHistoryCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, item) {
        var vm = $scope.vm = this;
        $scope.item = item;
        $scope.search = {doorId:item.doorId};
        $scope.pageModel = {};
        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/api/reformer/getReformerRecHistory',$scope.search, function (data) {
                $scope.pageModel = data;
               
            })
        }

        $scope.find();


    })

})()
