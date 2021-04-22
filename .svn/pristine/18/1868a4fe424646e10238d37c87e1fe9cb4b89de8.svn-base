(function () {
    var app = angular.module("angularApp");
    app.controller('contractReductCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        var pageParams = $rootScope.pages.params;
        $.post("/ovu-park/backstage/rental/relief/getInfo4Relief?contractId=" + pageParams.contractId, function (resp) {
            if (resp.code==0) {
                $timeout(function () {
                    $scope.secondPartyName = resp.data.secondPartyName;
                    $scope.pageModel = resp.data.billList;
                }, 1)
                $scope.reliefAmount = 0;
                $scope.billPriceTotal = 0.00;
                $scope.receiveAmountTotal = 0.00;
                $scope.reliefAmountTotal = 0.00;
                $scope.unreceiveAmountTotal = 0.00;
                $scope.reliefTotal = 0.00;
                $scope.length = resp.data.billList.length;
                $scope.unreceiveAmount = [];
                $scope.billId = [];
                $scope.contractId = resp.data.contractId;
                for (var i = 0; i < resp.data.billList.length; i++) {
                    $scope.reliefAmount += resp.data.billList[i].unreceiveAmount;
                    $scope.billPriceTotal += resp.data.billList[i].billPrice;
                    $scope.receiveAmountTotal += resp.data.billList[i].receiveAmount;
                    $scope.reliefAmountTotal += resp.data.billList[i].reliefAmount;
                    $scope.unreceiveAmountTotal += resp.data.billList[i].unreceiveAmount;

                    $scope.unreceiveAmount[i] = resp.data.billList[i].unreceiveAmount;
                    $scope.billId[i] = resp.data.billList[i].id;
                }
            } else {
                alert(resp.message)
            }
        });
        $scope.relief = [];
        $scope.reliefAmount1 = 0;
        $scope.reductchange = function (num) {
            $scope.relief = [];
            $scope.reliefAmount1 = 0;
            $scope.reliefTotal = 0;
            if (num) {
                $scope.reliefAmount1 = num;
                if (num > 0) {
                    var amout = 0;
                    for (var i = 0; i < $scope.length; i++) {
                        amout += $scope.unreceiveAmount[i];
                        if (amout < num) {
                            $scope.relief[i] = $scope.unreceiveAmount[i]
                        } else if (amout < num + $scope.unreceiveAmount[i]) {
                            $scope.relief[i] = (num * 100 + $scope.unreceiveAmount[i] * 100 - amout * 100) / 100
                        } else {
                            $scope.relief[i] = null
                        };
                        $scope.reliefTotal += $scope.relief[i];
                    }
                }
            } else {
                window.alert("最多两位小数的正数，且不超过可减免总金额，请重新填写！");
            }
        };
        
        $scope.unreductchange = function (num) {
            var adAmout = 0;
            for (var i = 0; i < $scope.relief.length; i++) {
                if ($scope.relief[i]) {
                    adAmout += $scope.relief[i]
                } else {
                    adAmout += 0;
                }
            };
            $scope.reliefAmount1 = Math.round(adAmout * 100) / 100;
            $scope.reliefTotal = Math.round(adAmout * 100) / 100;
            if (num) {
                $scope.aform = {
                    reliefAmount: function () {
                        return angular.isDefined(0) ? (_name = 0) : _name;
                    }
                }
                var amout = 0;
                for (var i = 0; i < $scope.relief.length; i++) {
                    if ($scope.relief[i]) {
                        amout += $scope.relief[i]
                    } else {
                        amout += 0;
                    }
                };
                $scope.reliefTotal = Math.round(amout * 100) / 100;
                $scope.aform.reliefAmount = Math.round(amout * 100) / 100;
                $scope.reliefAmount1 = $scope.aform.reliefAmount;
            } else {
                if (adAmout) {
                    $scope.aform.reliefAmount = adAmout;
                    window.alert("最多两位小数的正数，且不超过可减免金额，请重新填写！");
                } else {
                    $scope.aform.reliefAmount = null;
                    window.alert("最多两位小数的正数，且不超过可减免金额，请重新填写！");
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
                console.log($scope.reliefAmount1);
                param.reliefAmount = $scope.reliefAmount1;
                param.contractId = $scope.contractId;
                var arry = [];
                for (var i = 0; i < $scope.length; i++) {
                    arry[i] = {
                        "billId": $scope.billId[i],
                        "reliefAmount": $scope.relief[i]
                    }
                };

                param.itemList = JSON.stringify(arry);
                console.log(param);
                $.post("/ovu-park/backstage/rental/relief/createRelief", param, function (resp) {
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
