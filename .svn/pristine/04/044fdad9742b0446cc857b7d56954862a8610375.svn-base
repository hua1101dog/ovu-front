//现金放行
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('cashReleaseCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = "现金放行";

        $scope.pageModel = {};
        /**
         * 查询现金放行的
         * @type {{type: number}}
         */
        $scope.search = {
            types: 4
        };

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 车场
         */
        $scope.parklots = [];

        /**
         * 初始化车场信息
         *
         * @param parkId
         */
        var initParklots = function (parkId) {
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", {parkId: parkId},fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var data = data.data;
                    data.forEach(function (e) {
                        var parklot = [];
                        parklot.push(e.parklotId);
                        parklot.push(e.parklotName);
                        $scope.parklots.push(parklot);
                    });
                } else {
                    msg(data.message);
                }
            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {//项目
                initParklots($scope.search.parkId);
                $scope.find();
            }, function () {//集团
                initParklots("");
                $scope.find();
            })
        });


        /**
         * 查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/parklot/payment/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
            //统计数据
            var param = $scope.search;
            $http.post("/ovu-pcos/pcos/parklot/payment/countBySearch.do", param, fac.postConfig).success(function (data) {
                if (data.code === 0) {
                    $scope.count = data.data;
                } else {
                    alert(data.message);
                }
            })
        };

        /**
         * 批量导出
         * @param item
         */
        $scope.export = function () {
            var elemIF = document.createElement("iframe");
            var param = encodeURIComponent(encodeURIComponent(JSON.stringify($scope.search)));
            elemIF.src = "/ovu-pcos/pcos/parklot/payment/export.do?json=" + param+"&type=4";
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

        /**
         * 详情
         * @param item
         */
        $scope.detail = function (item) {
            var param = {
                id: item.id,
                parklotId: item.parklotId
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'parklot/modal.inoutDetail.html',
                controller: 'detailCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


    });

    app.controller('detailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {};
        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/parklot/payment/getDetail.do?id=" + param.id).success(function (data) {
                if (data.code === 0) {
                    $scope.item = data.data;

                    if (fac.isNotEmpty(param.parklotId)) {
                        $http.get("/ovu-pcos/pcos/parklot/park/getDetail.do?id=" + param.parklotId).success(function (data) {
                            if (data.code === 0) {
                                $scope.item.address = data.data.address;
                                $scope.item.totalSpaceNum = data.data.totalSpaceNum;
                            } else {
                                alert(data.message);
                            }
                        })
                    }
                } else {
                    alert(data.message);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

})()
