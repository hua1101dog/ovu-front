(function () {
    var app = angular.module("angularApp");
    app.controller('detailFlushCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        document.title = "OVU-冲抵明细";
        $scope.search = {}
        $scope.status = [{
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
            chargeDateSort: -1
        }
        $scope.sortStatus = {
            chargeDateSort: -1
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
            fac.getPageResult("/ovu-park/backstage/rental/charge/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.detailSort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.chargeDateSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
        //作废
        $scope.viod = function (id, status) {
            confirm("确定作废当前冲抵单吗？", function () {
                $http.post("/ovu-park/backstage/rental/charge/invalidate?id=" + id, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("状态保存成功");
                        $scope.find();
                    } else {
                        window.alert(resp.message);
                    }
                });
            })
        };
        //审批、查看
        $scope.flush = function (id, status) {
            //  $location.url('/rental/finacial/flushExamine')
            //  $location.search({ "id": id, "pageType": status });
            $rootScope.target("rental/finacial/flushExamine", "冲抵明细查看", false, '', {
                "id": id,
                "pageType": status
            }, "rental/finacial/flushExamine");
        }

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });
    });
    app.filter("chargeType", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '保证金冲抵';
                    break;
                case 2:
                    return '预收冲抵';
                    break;
            }
        }
    })
    // 作废
    //app.controller('viodCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
    //    $scope.status = param.status;
    //    $scope.sure = function () {
    //        $http.post("/ovu-park/backstage/rental/charge/invalidate?id=" + param.id).success(function (resp) {
    //            $uibModalInstance.close("1");
    //        });
    //    }
    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss('cancel');
    //    }
    //});
})()
