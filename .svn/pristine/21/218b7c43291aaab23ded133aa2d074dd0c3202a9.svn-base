(function () {
    var app = angular.module("angularApp");

    app.controller('scoreManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-积分管理";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 100
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/integral/rule/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });

        };
        $scope.getStatus = function () {
            fac.getResult("/ovu-park/backstage/integral/convert/get", {text: "获取兑换规则状态"}, function (data) {
                $scope.ruleTab2Info = data
                $scope.search.convertRatio = data.convertRatio
            });
        }
        $scope.getStatus();
        $scope.showEditModal = function (item) {

            item = item || {createrId: app.user.ID};
            var copy = angular.extend({}, item);

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/scoreManage/modal.categorySetting.html',
                controller: 'modal.categorySetting',
                resolve: {categorySetting: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.save = function (type) {
            var param = {
                status: type == 'start' ? 1 : 0,
                convertRatio: parseInt($scope.search.convertRatio)
            };
            fac.getResult("/ovu-park/backstage/integral/convert/edit", param, function (service) {
                $scope.getStatus();
                window.msg("修改成功!");
            });
        };

        $scope.switch = function (item) {
            console.log(item);
            if (item.status == 1) {
                var status = 0;
            } else {
                var status = 1;
            }

            var param = {
                status: status,
                id: item.id
            };
            fac.getResult("/ovu-park/backstage/integral/rule/status", param, function (service) {
                window.msg("修改成功!");
                $scope.find();
            });
        }

        $scope.cancel = function () {
            $scope.ruleTab = 1
        };

        $scope.find();

    });

    app.controller('modal.categorySetting', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, categorySetting) {
        $scope.item = categorySetting;

        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请确认输入格式是否正确")
                return;
            }
            console.log($scope.item);

            $.post("/ovu-park/backstage/integral/rule/edit", $scope.item, function (resp) {

                if (resp.code==0) {
                    $uibModalInstance.close();
                    window.msg("操作成功!");
                } else {
                    window.alert(resp.message);
                }
            });
        };

        $scope.mintvalue = function (value) {
            if (value < -1) {
                $scope.item.limitNum = ""
            } 
            
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
