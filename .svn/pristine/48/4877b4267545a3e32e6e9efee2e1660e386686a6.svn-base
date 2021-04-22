/**
 * 维保工单统计表.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('maintenanceWorkCtrl', function ($scope, $rootScope, $uibModal, $location, $http, $filter, fac) {
        $scope.search = {};
        document.title = "维保工单统计表";
        $scope.pageModel = {};
        $scope.search.workUnitType = "1,2";
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {
            //     $scope.find();
            // }, function () {
            //     $scope.find();
            // });
            $scope.find(1);

        })

        //分页
        $scope.find = function (pageNo) {
           
            if ($scope.parks.length !== 0) {
                var ids = $scope.parks.reduce(function (ret, n) {
                    ret.push(n.id);
                    return ret
                }, []);
                $scope.search.parkId = ids.join(",");
            }
            var ids = $scope.parks.reduce(function (ret, n) {
                ret.push(n.id);
                return ret
            }, []);
            $scope.search.parkId = ids.join(",");
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,

            });
            $scope.search.startTime && ($scope.search.startTime = $scope.search.startTime + " 00:00:00");
            $scope.search.endTime && ($scope.search.endTime = $scope.search.endTime + " 23:59:59");
            fac.getPageResult('/ovu-pcos/pcos/reportstat/other/statmaintenance.do', $scope.search, function (data) {
                $scope.pageModel = data
            });

        }
        $scope.parks = [];
        $scope.parksList = [];
        $scope.choosePark = function () {
            if (!$scope.parks == []) {
                $scope.parks = [];
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl',
                resolve: {
                    data: function () {
                        return {};
                    }
                }
            });
            modal.result.then(function (data) {
                if ($scope.parks && $scope.parks.length > 0) {
                    data.forEach(function (part) {
                        $scope.parks.forEach(function (item) {
                            if (part.id == item.id) {
                                part.isExist = true;
                            }
                        });
                    });
                }

                data.forEach(function (part) {
                    if (!part.isExist) {
                        $scope.parks.push({
                            id: part.id,
                            parkName: part.parkName
                        });
                    }
                });
                if ($scope.parks.length > 3) {
                    $scope.parkList = $scope.parks.slice(0, 3);
                } else {
                    $scope.parkList = $scope.parks;
                }
            });
        };
        $scope.show = ""
        $scope.getmore = function () {
            $scope.parkList = $scope.parks;
            $scope.show = true;
        }
        $scope.getless = function () {
            $scope.parkList = $scope.parks.slice(0, 3);
            $scope.show = false;
        }

        $scope.delpark = function (parks, p) {

            if ($scope.parkList.length <= 3) {
                parks.splice(parks.indexOf(p), 1);
                $scope.parkList = parks.slice(0, 3);
                $scope.show = ""
            } else {
                parks.splice(parks.indexOf(p), 1);
            }


        };
        /**
         * 批量导出
         * @param item
         */
        $scope.export = function () {
            var elemIF = document.createElement("iframe");
            var param = encodeURIComponent(encodeURIComponent(JSON.stringify($scope.search)));
            // var param=JSON.stringify($scope.search)
            elemIF.src = "/ovu-pcos/pcos/reportstat/export/maintenance.do?json=" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
    });

})();