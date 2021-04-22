(function () {
    var app = angular.module("angularApp");
    app.controller('receivableFinacialCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        document.title = "OVU-收款明细";
        $scope.search = {}
        $scope.status = [{
                value: "1",
                text: "已复核"
            },
            {
                value: "0",
                text: "未复核"
            }
        ]
        // 排序状态值
        $scope.sortStatusCopy = {
            receiveDateSort: -1
        }
        $scope.sortStatus = {
            receiveDateSort: -1
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
            fac.getPageResult("/ovu-park/backstage/rental/receivable/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.receiveSort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.receiveDateSort;
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
            if (status === 1) {
                change = "复核";
            } else if (status === 2) {
                change = "作废";
            }
            confirm("确定" + change + "当前收款吗？", function () {
                if (status == 1) {
                    $http.post("/ovu-park/backstage/rental/receivable/check?id=" + id, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("状态保存成功");
                            $scope.find();
                        } else {
                            window.alert(resp.message);
                        }
                    });
                } else if (status == 2) {
                    $http.post("/ovu-park/backstage/rental/receivable/invalidate?id=" + id, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("状态保存成功");
                            $scope.find();
                        } else {
                            window.alert(resp.message);
                        }
                    });
                }
            })
        }
        //查看
        $scope.receivCheck = function (id) {
            //  $location.url('/rental/finacial/receivCheck')
            //  $location.search({ "id": id });
            $rootScope.target("rental/finacial/receivCheck", "查看收款明细", false, '', {
                "id": id
            }, "rental/finacial/receivCheck");
        };
        //预收冲抵、保证金冲抵
        $scope.flush = function (id, status) {
            //  $location.url('/rental/finacial/advanceFlush')
            //  $location.search({ "receivableHeadId": id, "chargeType": status });
            $rootScope.target("rental/finacial/advanceFlush", "冲抵", false, '', {
                "receivableHeadId": id,
                "chargeType": status
            }, "rental/finacial/advanceFlush");
        }
        //退款
        $scope.refund = function (id) {
            //  $location.url('/rental/finacial/contractRefund')
            //  $location.search({ "receivableHeadId": id});
            $rootScope.target("rental/finacial/contractRefund", "退款", false, '', {
                "receivableHeadId": id
            }, "rental/finacial/contractRefund");
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });
    });
    app.filter("receivStatus", function () {
        return function (status) {
            switch (status) {
                case 0:
                    return '未复核';
                    break;
                case 1:
                    return '已复核';
                    break;
            }
        }
    });
    app.filter("pamodel", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '现金';
                    break;
                case 2:
                    return '刷卡';
                    break;
                case 3:
                    return '转账';
                    break;
            }
        }
    });
    // 复核、作废
    //app.controller('viodCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
    //    $scope.status = param.status;
    //    $scope.sure = function () {
    //        if (param.status == 1) {
    //            $http.post("/ovu-park/backstage/rental/receivable/check?id=" + param.id).success(function (resp) {
    //                $uibModalInstance.close("1");
    //            });
    //        } else if (param.status == 2) {
    //            $http.post("/ovu-park/backstage/rental/receivable/invalidate?id=" + param.id).success(function (resp) {
    //                $uibModalInstance.close("1");
    //            });
    //        }
    //    }
    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss('cancel');
    //    }
    //});
})()
