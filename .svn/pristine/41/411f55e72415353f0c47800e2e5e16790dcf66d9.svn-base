//车辆进出记录
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('inoutCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = "车辆进出记录表";
        $scope.pageModel = {};
        $scope.search = {};

        /**
         * 城市
         */
        $scope.cities = [["武汉", "武汉"]];

        /**
         * 车场
         */
        $scope.parklots = [];

        /**
         * 1：优惠放行 2：异常放行 3：免费放行 4：现金放行 5：储值卡放行 6：月卡放行
         * 7：POS支付 8：线上支付
         * @type {*[]}
         */
        $scope.typeList = [
            {"id": 1, "text": "优惠放行", "chosen": false},
            {"id": 2, "text": "异常放行", "chosen": false},
            {"id": 3, "text": "免费放行", "chosen": false},
            {"id": 4, "text": "现金放行", "chosen": false},
            {"id": 5, "text": "储值卡放行", "chosen": false},
            {"id": 6, "text": "月卡放行", "chosen": false},
            {"id": 7, "text": "POS支付", "chosen": false},
            {"id": 8, "text": "线上支付", "chosen": false},
        ];

        /**
         * 1：VIP车 2：月卡车 3：临时车 4：其它
         * @type {*[]}
         */
        $scope.carTypeList = [
            {"id": 1, "text": "VIP车", "chosen": false},
            {"id": 2, "text": "月卡车", "chosen": false},
            {"id": 3, "text": "临时车", "chosen": false},
            {"id": 4, "text": "其它", "chosen": false},
        ];

        /**
         * 初始化车场信息
         *
         * @param parkId
         */
        var initParklots = function (parkId) {
            var param = {
                parkId: parkId
            };
            $http.post("/ovu-pcos/pcos/parklot/park/getParklots.do", param, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    var datas = data.data;
                    datas.forEach(function (e) {
                        var parklot = [];
                        parklot.push(e.parklotId);
                        parklot.push(e.parklotName);
                        $scope.parklots.push(parklot);
                    });
                } else {
                    msg(data.message);
                }
            })
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {//项目
                //初始化车场信息
                initParklots($scope.search.parkId);
                $scope.find(1);
            }, function () {//集团
                //初始化车场信息 默认没有项目查询该集团下的全部车场
                initParklots("");
                $scope.find(1);
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
            $scope.search.types = "";
            $scope.search.carTypes = "";
            $scope.typeList.forEach(function (type) {
                if(type.chosen){
                    $scope.search.types += type.id+",";
                }
            });
            if($scope.search.types.length > 0){
                $scope.search.types = $scope.search.types.substr(0,$scope.search.types.length-1);
            }
            $scope.carTypeList.forEach(function (type) {
                if(type.chosen){
                    $scope.search.carTypes += type.id+",";
                }
            });
            if($scope.search.carTypes.length > 0){
                $scope.search.carTypes = $scope.search.carTypes.substr(0,$scope.search.carTypes.length-1);
            }
            fac.getPageResult("/ovu-pcos/pcos/parklot/inout/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

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

        /**
         * 批量导出
         * @param item
         */
        $scope.export = function () {
            var elemIF = document.createElement("iframe");
            var param = encodeURIComponent(encodeURIComponent(JSON.stringify($scope.search)));
            elemIF.src = "/ovu-pcos/pcos/parklot/inout/export.do?json=" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }


    });

    app.controller('detailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {};
        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/parklot/inout/getDetail.do?id=" + param.id).success(function (data) {
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
