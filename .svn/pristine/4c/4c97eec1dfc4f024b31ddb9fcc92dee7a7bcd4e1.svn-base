(function () {
    "use strict";
    var app = angular.module("angularApp");


    //合同备案管理ctrl
    app.controller("expiredCtrl", function ($scope, $rootScope, $uibModal, $http, $filter, fac, $state) {
        document.title = "到期合同管理";
        $scope.pageModel = {};
        $scope.search = {};

        //判断是集团版还是项目版
        app.modulePromiss.then(function () {
            $scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;
                // parkId = $scope.search.parkId;
                $scope.find();
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        // parkId = $scope.search.parkId;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/info/expire", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log("分页成功");
            })
        };

        //创建合同
        $scope.creatAgreement = function () {
            sessionStorage.setItem('parkId', $scope.search.parkId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementcreat', page: 'agreementcreat' });
        };
        //查看
        $scope.showInform = function (item) {
            sessionStorage.setItem('back','expired');
            sessionStorage.setItem('status', 4);
            sessionStorage.setItem('id', item.infoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementabandoned' });
        };
        //审批流
        $scope.showProcess = function (item) {
            sessionStorage.setItem('back','expired');
            sessionStorage.setItem('id', item.infoId);
            sessionStorage.setItem('compactStatus',item.compactStatus);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementprocess' });
        };

        //合同提醒
        $scope.remind=function (item) {
            sessionStorage.setItem('back','expired');
            sessionStorage.setItem('id',item.infoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementremind' });
        }




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

        //编辑／新增合同分类
        $scope.showModal = function (item) {
            item == undefined ? item = { ss: '新增' } : item.ss = '编辑';
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/agreementexpired/agreementread.html',
                controller: 'editExpiredCtrl',
                resolve: { item: item }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info("Modal dismissed at:" + new Data());
            });

        }

    });


    app.controller("editExpiredCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.item = item;
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $scope.item = item;

            $http.post("/ovu-pcos/pcos/compact/classify/edit", $scope.item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.status) {
                    $uibModalInstance.close();
                    msg("保存成功");
                } else {
                    alert("保存失败");
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        }
    });

})();