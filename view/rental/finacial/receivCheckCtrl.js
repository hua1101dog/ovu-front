(function () {
    var app = angular.module("angularApp");
    app.controller('receivCheckCtrl', ['$scope', '$rootScope', '$http', '$filter', '$uibModal', 'fac', '$location', '$timeout', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        $scope.receivableObj = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $.post("/ovu-park/backstage/rental/receivable/detail?id=" + $scope.receivableObj.id, function (resp) {
            $timeout(function () {
                $scope.list = resp.data.receivableHead;
                $scope.pageModel = resp.data.receivableItemList;
            }, 1)
            $scope.billPriceTotal = 0.00;
            $scope.lastReceiveAmountTotal = 0.00;
            $scope.lastReliefAmountTotal = 0.00;
            $scope.lastUnreceiveAmountTotal = 0.00;
            $scope.receiveAmountTotal = 0.00;
            $scope.lastArrearsAmountTotal = 0.00;
            for (var i = 0; i < resp.data.receivableItemList.length; i++) {
                $scope.billPriceTotal += resp.data.receivableItemList[i].billPrice;
                $scope.lastReceiveAmountTotal += resp.data.receivableItemList[i].lastReceiveAmount;
                $scope.lastReliefAmountTotal += resp.data.receivableItemList[i].lastReliefAmount;
                $scope.lastUnreceiveAmountTotal += resp.data.receivableItemList[i].lastUnreceiveAmount;
                $scope.receiveAmountTotal += resp.data.receivableItemList[i].receiveAmount;
                $scope.lastArrearsAmountTotal += resp.data.receivableItemList[i].lastArrearsAmount;
            }
        });
        $scope.cancel = function () {
            // $location.url('/rental/finacial/receivablesFinacial');
            $scope.$emit('needToClose', curPage);
        };
    }]);
    
    app.filter("pamodel", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '现金';
                    break;
                case 2:
                    return '刷卡';
                    break;
                case 3:
                    return '转账';
                    break;
            }
        }
    });
    app.filter("invoice", function () {
        return function (status) {
            switch (status) {
                case 0:
                    return '否';
                    break;
                case 1:
                    return '是';
                    break;
            }
        }
    });
})()
