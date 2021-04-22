(function () {
    var app = angular.module("angularApp");
    app.controller('houseSourceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "房源查询";
        var saleStatus=['销控','待售','认购','签约']
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.showRoom = false
            $scope.showOrder = false;
            $scope.houseInfo={}
            $scope.orderInfo={}
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId='';
                    $scope.search.stageId='';
                    $scope.search.buildId='';
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                    if ($rootScope.project.buildId) {
                        $scope.name=$rootScope.project.parkName+'-'+$rootScope.project.stageName+'-'+$rootScope.project.buildName
                        $scope.search.buildId = $rootScope.project.buildId
                        $scope.queryStageHouse()
                    }
                }
            })
        });

        $scope.queryStageHouse = function () {

            $http.post("/ovu-park/backstage/house/resource/displayBuildHouseAll",$scope.search, fac.postConfig).success(function (res) {
                if (res.code == 0) {
                    $scope.unitList = res.data.unit;
                    $scope.groundList = res.data.ground;
                    $scope.numberList = res.data.nubmer;
                    $scope.houseList = res.data.houseCode;
                    $scope.radio=res.data.radio;
                    $scope.numberArr = []
                    for (var obj in $scope.numberList) {
                        var tempArr = $scope.numberList[obj];
                        tempArr.forEach(e => {
                            $scope.numberArr.push(e)
                        });
                    }
                }
            })

        }
        $scope.clickRoom = function (house) {
            if(!house|| !house.houseId){
                 return
            }
           
        
            $scope.groundList.forEach(function(n){
                $scope.houseList[n].forEach(function(h){
                    h.checked=false
                })
            })
            $scope.showRoom=false
            $scope.showOrder=false
            house.checked = !house.checked;
            if(house.saleStatus==5){
                alert("该房屋为非售类型！")
                return 
            }
            $http.post("/ovu-park/backstage/house/resource/houseMessageByHouseId", { houseId: house.houseId}, fac.postConfig).success(function (res) {
                if (res.code == 0) {
                    if(res.data){
                        $scope.showRoom=true
                        $scope.houseInfo=res.data
                        $scope.houseInfo.sale_statuStr=saleStatus[$scope.houseInfo.sale_status]
                        $scope.houseInfo.area_statusStr=$scope.houseInfo.area_status==0?'待售':'已售';
                        $scope.houseInfo.standardPricingStr=$scope.houseInfo.standardPricingMannerNew==1?'建筑面积':'套内面积';
                        $scope.houseInfo.rentTypeStr=$filter('toRentSaleType')($scope.houseInfo.rent_sale_type);
                    }
                }else{
                    alert("该房屋为非售类型！")
                }
            })
            $http.post("/ovu-park/backstage/house/resource/orderMessageByHouseId", { houseId: house.houseId}, fac.postConfig).success(function (res) {
                if (res.code == 0) {
                    if(res.data){
                        $scope.showOrder=true
                        $scope.orderInfo=res.data
                    }
                
                }
            })
        }
    });

})();
