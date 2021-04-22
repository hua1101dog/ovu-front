//月卡统计
(function () {
    "use strict";

    var app = angular.module("angularApp");
    app.controller('monthCardStatisticsCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = "月卡统计";

        $scope.pageModel = {};

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 车场
         */
        $scope.parklots = [];

        $scope.isvalidList = [[1, "是"], [0, "否"]];

        /**
         * 月卡类型
         * @type {*[]}
         */
        $scope.monthCardTypeList = [[1, "80月卡"], [2, "120月卡"], [3, "150月卡"]];

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

            fac.getPageResult("/ovu-pcos/pcos/parklot/payment/monthcard/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });

            //统计数据
            var param = $scope.search;
            $http.post("/ovu-pcos/pcos/parklot/payment/monthcard/count.do", param, fac.postConfig).success(function (data) {
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
            elemIF.src = "/ovu-pcos/pcos/parklot/payment/exportMonthCard.do?json=" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }


    });
})()
