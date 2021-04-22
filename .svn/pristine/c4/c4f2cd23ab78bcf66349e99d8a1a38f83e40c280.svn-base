(function () {
    var app = angular.module("angularApp");
    app.controller('rentRefundCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        document.title = "OVU-退款明细";
        $scope.search = {}
        $scope.status = [{
                value: "3",
                text: "已复核"
            },
            {
                value: "2",
                text: "已驳回"
            },
            {
                value: "1",
                text: "已审批"
            },
            {
                value: "0",
                text: "待审批"
            }
        ]
        // 排序状态值
        $scope.sortStatusCopy = {
            returnDateSort: -1
        }
        $scope.sortStatus = {
            returnDateSort: -1
        }
        // 获取列表
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            $scope.search.parkId = app.park.parkId;
            console.log($scope.search);
            fac.getPageResult("/ovu-park/backstage/rental/return/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.refundSort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.returnDateSort;
            $scope.search[key] = value;
            $scope.find(1);
        }

        //复核、作废
        $scope.vido = function (id, status) {
            //var modal = $uibModal.open({
            //    animation: false,
            //    size: '',
            //    templateUrl: '/view/rental/finacial/modal.viod.html',
            //    controller: 'viodCtrl',
            //    resolve: { param: { "id": id, "status": status } }
            //});
            //modal.result.then(function (data) {
            //    if (data) {
            //        $scope.find();
            //    }
            //}, function () {
            //});
            var change = "";
            if (status === 4) {
                change = "复核";
            } else if (status === 3) {
                change = "作废";
            }
            confirm("确定" + change + "当前退款吗？", function () {
                if (status == 3) {
                    $http.post("/ovu-park/backstage/rental/return/invalidate?id=" + id, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("状态保存成功");
                            $scope.find();
                        } else {
                            window.alert(resp.message);
                        }
                    });
                } else if (status == 4) {
                    $http.post("/ovu-park/backstage/rental/return/check?id=" + id, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("状态保存成功");
                            $scope.find();
                        } else {
                            window.alert(resp.message);
                        }
                    });
                }

            })
        };
        //复核查看、审批、审批查看
        $scope.refund = function (id, status) {
            //  $location.url('/rental/finacial/refundExamine')
            //  $location.search({ "id": id, "status": status });
            $rootScope.target("rental/finacial/refundExamine", "复核审批查看", false, '', {
                "id": id,
                "status": status
            }, "rental/finacial/refundExamine");
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });
    });
    // 复核、作废
    //app.controller('viodCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
    //    $scope.status = param.status;
    //    $scope.sure = function () {
    //        if (param.status == 3) {
    //            $http.post("/ovu-park/backstage/rental/return/invalidate?id=" + param.id).success(function (resp) {
    //                $uibModalInstance.close("1");
    //            });
    //        } else if (param.status == 4) {
    //            $http.post("/ovu-park/backstage/rental/return/check?id=" + param.id).success(function (resp) {
    //                $uibModalInstance.close("1");
    //            });
    //        }
    //    }
    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss('cancel');
    //    }
    //});
})()
