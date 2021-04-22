/* 
 * 明细         
*/

(function () {
    var app = angular.module("angularApp");
    app.controller('detailCtrl', function ($scope, $rootScope, $http, $uibModal, $location, fac, $window) {
        $scope.params = $rootScope.pages.params;
        $scope.itemId = $scope.params.id;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })

        $scope.rentalHousesMsg = [];
        $scope.houseList = [];
        $scope.$watch('window.innerWidth', function () {
            $scope.width = $window.innerWidth - 230;
            $scope.width = {
                "width": $window.innerWidth - 270
            }
            console.log($window.innerWidth - 230);
        });
        // 获取房屋列表
        $http.post("/ovu-park/backstage/rental/project/getProjectDetail", $scope.params, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.rentalHousesMsg = resp.data;
                // 当前tab页
                $scope.currentBulid = $scope.rentalHousesMsg.floorList[0];
                //房屋列表数据结构
                $scope.houseList = $scope.rentalHousesMsg.houseList;
                //项目房屋定价
                $scope.pHouses = $scope.rentalHousesMsg.pHouses;
                // console.log($scope.houseList);
                $scope.selectTotle();
            } else {
                window.alert(resp.message);
            }
        });
        // 切换楼栋
        $scope.selBuliding = function (x) {
            $scope.currentBulid = x;
        }
        // 计算标准年租金
        $scope.selectTotle = function () {
            $scope.actualRentalPrice = 0;

            angular.forEach($scope.houseList, function (value1, key1) {
                angular.forEach(value1, function (value2, key2) {
                    angular.forEach(value2, function (value3, key3) {
                        if ($scope.rentalHousesMsg.project.dataValid != 1) {
                            angular.forEach($scope.pHouses, function (valuePhouse, keyPhouse) {
                                if ($scope.itemId == valuePhouse.projectId && value3.houseId == valuePhouse.houseId) {
                                    value3.validRentPrice = valuePhouse.rentalPrice;
                                }
                            })
                        }
                        if ($scope.itemId == value3.validProjectId) {
                            $scope.actualRentalPrice = parseFloat($scope.actualRentalPrice + value3.area * value3.validRentPrice * 12 / 10000);
                            //console.log($scope.actualRentalPrice);
                        }
                    })
                })
            });
            $scope.actualRentalPrice = $scope.actualRentalPrice.toFixed(2);
        }
        // 返回
        $scope.back = function () {
            $scope.$emit('needToClose',curPage);
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {

            })
        });
        $scope.$on('$destroy', function () {
            console.log($rootScope.pages)
        })
    });
})()
