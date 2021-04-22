
(function() {
    var app = angular.module("angularApp");
    app.controller('historyReservePriceCtrl', function ($scope,$rootScope,$http,$filter,$uibModal,fac) {
        document.title = "历史价格查询";
        var width=$(window).width()-300
        $('#table_hi').width(width)
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.park_id=""
                    $scope.search.stage_id=""
                    $scope.search.build_id=""
                    $scope.search.park_id = $rootScope.project.parkId;
                    $rootScope.project.stageId&&($scope.search.stage_id= $rootScope.project.stageId)
                    $rootScope.project.buildId&&($scope.search.build_id= $rootScope.project.buildId)
                    $scope.find(1)
                }
            })
        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-park/backstage/sale/saleMinAdjustmentProject/queryMinPriceHistory", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
     
    });


    //计价方式转换
    app.filter("pricingMannerNew",function(){
        return function(value) {
            if(value == 0){
                return "建筑面积";
            } else if(value == 1){
                return "套内面积";
            }else{
                return "--";
            }
        }
    });

})();
