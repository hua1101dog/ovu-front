(function () {
    var app = angular.module("angularApp");
    app.controller('contractReceivCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        var pageParams = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.form = {
            advanceAmount: function () {
                return angular.isDefined(0) ? (_name = 0) : _name;
            }
        }
        $.post("/ovu-park/backstage/rental/receivable/getInfo4Receivable?contractId=" + pageParams.contractId, function (resp) {
            if (resp.code==0) {
                $timeout(function () {
                    $scope.list = resp.data;
                    $scope.pageModel = resp.data.billList;
                }, 1)
                $scope.billPriceTotal = 0;
                $scope.receiveAmountTotal = 0;
                $scope.reliefAmountTotal = 0;
                $scope.unreceiveAmountTotal = 0;
                $scope.unreceiveAmount = [];
                $scope.billId = [];
                $scope.contractId = resp.data.contractId;
                $scope.length = resp.data.billList.length;
                for (var i = 0; i < resp.data.billList.length; i++) {
                    $scope.billPriceTotal += resp.data.billList[i].billPrice;
                    $scope.receiveAmountTotal += resp.data.billList[i].receiveAmount;
                    $scope.reliefAmountTotal += resp.data.billList[i].reliefAmount;
                    $scope.unreceiveAmountTotal += resp.data.billList[i].unreceiveAmount;
                    $scope.arrearsTotal += resp.data.billList[i].unreceiveAmount;
                    $scope.unreceiveAmount[i] = resp.data.billList[i].unreceiveAmount;
                    $scope.billId[i] = resp.data.billList[i].id;
                }
            } else {
                alert(resp.message)
            }
            
        });
        $scope.thisPay = [];
        $scope.thisPayTotal = 0;
        $scope.arrearsTotal = 0;
        $scope.receivechange = function (num) {
            $scope.thisPay = [];
            $scope.receiveAmount = 0;
            $scope.thisPayTotal = 0;
            if (num) {
                $scope.receiveAmount = num;
                if (num > $scope.unreceiveAmountTotal) {
                    // $scope.form.advanceAmount = Math.floor(num * 100 - $scope.unreceiveAmountTotal * 100) / 100
                    $scope.form.advanceAmount = (num - $scope.unreceiveAmountTotal).toFixed(2);
                    $scope.form.advanceAmount = Number($scope.form.advanceAmount);
                } else {
                    $scope.form.advanceAmount = 0.00
                };
                $scope.thisPayTotal = 0;
                if (num > 0) {
                    var amout = 0;
                    for (var i = 0; i < $scope.length; i++) {
                        amout += $scope.unreceiveAmount[i];
                        if (amout < num) {
                            $scope.thisPay[i] = $scope.unreceiveAmount[i]
                        } else if (amout < num + $scope.unreceiveAmount[i]) {
                            // $scope.thisPay[i] = Math.floor(num * 100 + $scope.unreceiveAmount[i] * 100 - amout * 100) / 100
                            $scope.thisPay[i] = (num +$scope.unreceiveAmount[i]-amout).toFixed(2);
                            $scope.thisPay[i] = Number($scope.thisPay[i]);
                        } else {
                            $scope.thisPay[i] = null
                        };
                        $scope.thisPayTotal += $scope.thisPay[i]

                    }

                };
                if ($scope.unreceiveAmountTotal > num) {
                    $scope.arrearsTotal = $scope.unreceiveAmountTotal - num
                } else {
                    $scope.arrearsTotal = 0
                }
            } else {
                window.alert("最多两位小数的正数，不得大于未收总额，请重新填写！");
            }
            
        };
        $scope.addpay = function (num) {
            var adAmout = 0;
            for (var i = 0; i < $scope.thisPay.length; i++) {
                if ($scope.thisPay[i]) {
                    adAmout += $scope.thisPay[i]
                } else {
                    adAmout += 0;
                }
            };
            console.log(adAmout);
            $scope.thisPayTotal = Math.round(adAmout * 100) / 100;
            $scope.receiveAmount = 0;
            if (num) {
                $scope.thisPayTotal = 0;
                $scope.aform = {
                    receiveAmount: function () {
                        return angular.isDefined(0) ? (_name = 0) : _name;
                    }
                };
                for (var i = 0; i < $scope.thisPay.length; i++) {
                    if ($scope.thisPay[i]) {
                        $scope.thisPayTotal += $scope.thisPay[i];
                    } else {
                        $scope.thisPayTotal += 0;
                    }
                };
                $scope.aform.receiveAmount = Math.round($scope.thisPayTotal*100)/100;
                $scope.receiveAmount = $scope.aform.receiveAmount;
                if ($scope.aform.receiveAmount > $scope.unreceiveAmountTotal) {
                    $scope.form.advanceAmount = $scope.aform.receiveAmount - $scope.unreceiveAmountTotal
                } else {
                    $scope.form.advanceAmount = 0.00;
                }
                $scope.arrearsTotal = $scope.unreceiveAmountTotal - $scope.thisPayTotal;
            } else {
                if (adAmout) {
                    $scope.aform.receiveAmount = Math.round(adAmout * 100) / 100;
                    $scope.receiveAmount = Math.round(adAmout * 100) / 100;
                    window.alert("最多两位小数的正数，不得大于未收金额，请重新填写！");
                } else {
                    $scope.aform.receiveAmount = null;
                    window.alert("最多两位小数的正数，不得大于未收金额，请重新填写！");
                };
                if ($scope.aform.receiveAmount > $scope.unreceiveAmountTotal) {
                    $scope.form.advanceAmount = $scope.aform.receiveAmount - $scope.unreceiveAmountTotal
                } else {
                    $scope.form.advanceAmount = 0.00;
                }
                
        }
        };
        var checkSubmitFlg = false;
        $scope.save = function (obj) {
            if (checkSubmitFlg == true) {
                return false;
            } else {
                checkSubmitFlg = true;
                var param = {};
                if (obj) {
                    param = obj;
                };
                param.receiveAmount = $scope.receiveAmount;
                param.contractId = $scope.contractId;

                var arry = [];
                for (var i = 0; i < $scope.length; i++) {
                    arry[i] = {
                        "billId": $scope.billId[i],
                        "receiveAmount": $scope.thisPay[i] ? $scope.thisPay[i] : null
                    }
                };
                param.itemList = JSON.stringify(arry);

                $.post("/ovu-park/backstage/rental/receivable/createReceivable", param, function (resp) {
                    if (resp.code==0) {
                        $timeout(function () {
                            // $location.url('/rental/finacial/contractFinacial');
                            $scope.$emit("needToClose", curPage);
                        }, 1)

                    } else {
                        alert(resp.message);
                        checkSubmitFlg = false;
                    }
                })
            } 
        };

        $scope.cancel = function () {
            // $location.url('/rental/finacial/contractFinacial');
            $scope.$emit("needToClose", curPage);
        };
    });

})()
