(function () {
    var app = angular.module("angularApp");
    app.controller('rentDerateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
    	document.title = "OVU-减免明细"; 
    	$scope.search = {}
        $scope.status = [
                   { value: "2", text: "已驳回" },
                   { value: "1", text: "已审批" },
                   { value: "0", text: "待审批" }
        ]
        // 排序状态值
        $scope.sortStatusCopy = {
            reliefDateSort: -1
        }
        $scope.sortStatus = {
            reliefDateSort: -1
        }
        // 获取列表
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.parkId;
            fac.getPageResult("/ovu-park/backstage/rental/relief/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.derateSort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.reliefDateSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
        //作废
        $scope.vido = function (id, status) {
            confirm("确定作废当前减免单吗？", function () {
                $http.post("/ovu-park/backstage/rental/relief/invalidate?id=" + id, fac.postConfig).success(function (resp) {
                    if (resp.code==0) {
                        window.msg("状态保存成功");
                        $scope.find();
                    } else {
                        window.alert(resp.message);
                    }
                });
            })
        }
        //审核
        $scope.examine = function (id) {
            $location.url('/rental/finacial/derateExamine')
            $location.search({ "id": id, "check": false });
        };
        //审核查看
        $scope.check = function (id) {
            // $location.url('/rental/finacial/derateExamine')
            // $location.search({ "id": id, "check": true });
            $rootScope.target("rental/finacial/derateExamine", "查看减免明细", false, '', { "id": id, "check": true }, "rental/finacial/derateExamine");
        };
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });
    });
    //作废
    //app.controller('viodCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
    //    $scope.status = param.status;
    //    $scope.sure = function () {
    //        $http.post("/ovu-park/backstage/rental/relief/invalidate?id=" + param.id).success(function (resp) {
    //            $uibModalInstance.close("1");
    //        });
    //    }
    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss('cancel');
    //    }
    //});
})()
