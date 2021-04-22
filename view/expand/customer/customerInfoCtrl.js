(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('customerCtl', function ($scope, $rootScope, $uibModal, $http, $filter, $location, fac) {
        document.title = "客户信息";

        $scope.pageModel = {};

        $scope.customerTypeList = {};

        app.modulePromiss.then(function () {
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
                $scope.search.parkId = app.park.ID;
            }
            $scope.find(1);
        });

        //查询
        $scope.find = function (pageNo) {
            if (!fac.hasActivePark($scope.search)) {
                return;
            }
            $http.get("/ovu-pcos/expand/customerType/getAll.do", fac.postConfig).success(function (data, status, headers, config) {
                $scope.customerTypeList = data;
            });
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/expand/customer/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.redirectContactPage = function (item) {
            var currentUrl = $location.path();
            var array = currentUrl.split('/');
            var len = array.length;
            if (len > 2) {
                array[len - 1] = 'customerContact';
                var newUrl = array.join('/');
                $location.url(newUrl).search('customerId', item.id);
            }
        }

        $scope.redirectProjectPage = function (item) {
            var currentUrl = $location.path();
            var array = currentUrl.split('/');
            var len = array.length;
            if (len > 2) {
                array[len - 1] = 'customerProject';
                var newUrl = array.join('/');
                $location.url(newUrl).search('customerId', item.id);
            }
        }

        //删除
        $scope.del = function (item) {
            dodel(item);
        }

        function dodel(item) {
            confirm("确认删除客户[" + item.name + "]吗?", function () {
                if (angular.isNumber(item.createTime)) {
                    item.createTime = $filter('date')(item.createTime, 'yyyy/MM/dd HH:mm:ss');
                }
                if (angular.isNumber(item.updateTime)) {
                    item.updateTime = $filter('date')(item.updateTime, 'yyyy/MM/dd HH:mm:ss');
                }

                $http.post("/ovu-pcos/expand/customer/delete.do", item, fac.postConfig).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert('删除失败');
                    }
                });

            });
        }

        $scope.showEditModal = function (group) {
            if (!fac.hasActivePark($scope.search)) {
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '../view/expand/customer/modal.customerInfo.html',
                controller: 'customerModalCtrl'
                , resolve: {group: $.extend(true, {}, group)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


    });
    app.controller('customerModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, group) {
        $scope.item = group;

        $scope.customerTypeList = {};
        $http.get("/ovu-pcos/expand/customerType/getAll.do", fac.postConfig).success(function (data, status, headers, config) {
            $scope.customerTypeList = data;
        });

        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if (angular.isNumber(item.createTime)) {
                item.createTime = $filter('date')(item.createTime, 'yyyy/MM/dd HH:mm:ss');
            }
            if (angular.isNumber(item.updateTime)) {
                item.updateTime = $filter('date')(item.updateTime, 'yyyy/MM/dd HH:mm:ss');
            }
            $http.post("/ovu-pcos/expand/customer/save.do", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error + " 保存失败.");
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

})()
