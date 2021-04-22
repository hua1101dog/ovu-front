(function() {
    var app = angular.module("angularApp");
    app.controller('contractCheckCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        var pageParams = $rootScope.pages.params;
        $.post("/ovu-park/backstage/rental/contractAccount/detail?contractId=" + pageParams.contractId, function (resp) {
            $timeout(function () {
                $scope.list = resp.data;
            }, 1);
            $scope.billPriceTotal = 0.00;
            $scope.receiveAmountTotal = 0.00;
            $scope.reliefAmountTotal = 0.00;
            $scope.unreceiveAmountTotal = 0.00;
            for (var i = 0; i < resp.data.billList.length; i++) {
                $scope.billPriceTotal += resp.data.billList[i].billPrice;
                $scope.receiveAmountTotal += resp.data.billList[i].receiveAmount;
                $scope.reliefAmountTotal += resp.data.billList[i].reliefAmount;
                $scope.unreceiveAmountTotal += resp.data.billList[i].unreceiveAmount;
            }
        });
        $scope.back = function () {
            // $location.url('/rental/finacial/contractFinacial');
            $scope.$emit("needToClose", curPage);
        };
    });
    
})()
