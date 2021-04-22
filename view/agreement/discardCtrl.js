(function () {
    "use strict";
    var app = angular.module("angularApp");

    //合同备案管理ctrl
    app.controller("discardCtrl", function ($scope, $rootScope, $uibModal, $http, $filter, fac, $state) {
        document.title = "合同废弃管理";
        //判断是集团版还是项目版
        app.modulePromiss.then(function () {
            $scope.search = { isGroup: fac.isGroupVersion() };
            $scope.pageModel = {};
            if ($scope.search.isGroup) {
                $scope.find();
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });

        $scope.del = function (item) {
            confirm("确认删除吗？", function () {
                $http.post('/ovu-pcos/pcos/compact/info/remove', { compactInfoId: item.infoId }, fac.postConfig).success(function (data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })
            })
        };

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/info/list", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        };


        $scope.showInform = function (item) {
            sessionStorage.setItem('back', 'discard');
            sessionStorage.setItem('status', item.compactStatus);
            sessionStorage.setItem('id', item.infoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementabandoned' });
        }
        $scope.showProcess = function (item) {
            sessionStorage.setItem('back', 'discard');
            sessionStorage.setItem('id', item.infoId);
            sessionStorage.setItem('compactStatus',item.compactStatus);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementprocess' });
        }
        $scope.remind = function (item) {
            sessionStorage.setItem('back', 'discard');
            sessionStorage.setItem('id', item.infoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementremind' });
        }

    });
})();
