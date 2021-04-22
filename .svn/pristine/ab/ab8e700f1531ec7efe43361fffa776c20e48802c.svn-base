(function() {
    var app = angular.module("angularApp");
    app.controller('advanceFlushCtrl', ['$scope', '$rootScope', '$http', '$filter', '$uibModal', 'fac', '$location', '$timeout', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        $scope.advanceObj = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.chargeType = $scope.advanceObj.chargeType;
        $.post("/ovu-park/backstage/rental/charge/getInfo4Charge?receivableHeadId=" + $scope.advanceObj.receivableHeadId + "&chargeType=" + $scope.advanceObj.chargeType, function (resp) {    
            if (resp.code==0) {
                $timeout(function () {
                    $scope.list = resp.data.receivableHead;
                    $scope.pageModel = resp.data.billList;
                    $scope.deposit = resp.data.depositList;
                }, 1)
                $scope.billPriceTotal = 0;
                $scope.receiveTotal = 0;
                $scope.reliefTotal = 0;
                $scope.unreceiveTotal = 0;
                $scope.arrearsTotal = 0;

                $scope.unreceiveAmount = [];
                $scope.toBillId = [];


                $scope.receivableHeadId = resp.data.receivableHead.id;
                $scope.length = resp.data.billList.length;

                for (var i = 0; i < resp.data.billList.length; i++) {
                    $scope.billPriceTotal += resp.data.billList[i].billPrice;
                    $scope.receiveTotal += resp.data.billList[i].receiveAmount;
                    $scope.reliefTotal += resp.data.billList[i].reliefAmount;
                    $scope.unreceiveTotal += resp.data.billList[i].unreceiveAmount;
                    $scope.arrearsTotal += resp.data.billList[i].unreceiveAmount;

                    $scope.unreceiveAmount[i] = resp.data.billList[i].unreceiveAmount;
                    $scope.toBillId[i] = resp.data.billList[i].id; 
                }
                if (resp.data.depositList) {
                    $scope.fromBillId = [];
                    $scope.allcanCharge = [];
                    $scope.depositLength = resp.data.depositList.length;
                    for (var i = 0; i < resp.data.depositList.length; i++) {
                        $scope.fromBillId[i] = resp.data.depositList[i].billId;
                        $scope.allcanCharge[i] = resp.data.depositList[i].depositRemain;
                    }
                   
                }
            } else {
                alert(resp.message)
            }
        });
        $scope.ifChecked = false;
        //收款金额计算
        $scope.thisPay = [];
        $scope.thisPayTotal = 0.00;
        //冲抵金额计算
        $scope.unintCharge = [];//每条的冲抵金额数组
        $scope.canCharge = [];//每条的可冲金额数组
        $scope.charge = function (boole, id, num, index) {
            $scope.ifChecked = false;
            for (var i = 0; i < $scope.check.length; i++) {
                if ($scope.check[i]) {
                    $scope.ifChecked = true
                }
            }
            $scope.chargeAmount = 0;
            $scope.thisPayTotal = 0;
            if (boole) {
                $scope.canCharge[index] = num;
            } else {
                $scope.canCharge[index] = 0;
            };
            //勾选的冲抵总额
            var chargeAll = 0;
            for (var i = 0; i < $scope.canCharge.length; i++) {
                if ($scope.canCharge[i]) {
                    chargeAll += $scope.canCharge[i];
                } else {
                    chargeAll += 0;
                }
            };
            //冲抵总额分配给明细
            for (var i = 0; i < $scope.unreceiveAmount.length; i++) {
                var amout = 0;
                for (var i = 0; i < $scope.length; i++) {
                    amout += $scope.unreceiveAmount[i];
                    if (amout < chargeAll) {
                        $scope.thisPay[i] = $scope.unreceiveAmount[i]
                    } else if (amout < chargeAll + $scope.unreceiveAmount[i]) {
                        $scope.thisPay[i] = Math.floor(chargeAll * 100 + $scope.unreceiveAmount[i] * 100 - amout * 100) / 100
                    } else {
                        $scope.thisPay[i] = null
                    };
                    $scope.thisPayTotal += $scope.thisPay[i]
                } 
            };
            //每条的冲抵金额数组
            var amout1 = 0;
            for(var i = 0; i < $scope.canCharge.length; i++){
                amout1 +=$scope.canCharge[i];
                if($scope.canCharge[i]){
                    if (amout1 < $scope.thisPayTotal) {
                        $scope.unintCharge[i] = $scope.canCharge[i]
                    } else if (amout1 < $scope.thisPayTotal + $scope.canCharge[i]) {
                        $scope.unintCharge[i] = ($scope.thisPayTotal * 100 + $scope.canCharge[i] * 100 - amout1 * 100) / 100
                    } else {
                        $scope.unintCharge[i] = null
                    };
                }else{
                    $scope.unintCharge[i] = null
                }
            }    
            //本次冲抵金额
            if ($scope.thisPayTotal) {
                $scope.chargeAmount = $scope.thisPayTotal;
            } else {
                $scope.chargeAmount = null;
            }  
        };
        //全选
        $scope.check = [];
        $scope.allCharge = function (boole) {
            $scope.ifChecked = false;
            
            $scope.chargeAmount = 0;
            $scope.thisPayTotal = 0;
            if (boole) {
                $scope.ifChecked = true;
                for (var i = 0; i < $scope.depositLength ; i++) {
                    $scope.check[i] = true;
                }
            } else {
                for (var i = 0; i < $scope.depositLength ; i++) {
                    $scope.check[i] = false;
                }
            };
            //勾选的冲抵总额
            var chargeAll = 0;
            if (boole) {
                for (var i = 0; i < $scope.allcanCharge.length; i++) {
                    if ($scope.allcanCharge[i]) {
                        chargeAll += $scope.allcanCharge[i];
                    } else {
                        chargeAll += 0;
                    }
                };
            } 
            
            //冲抵总额分配给明细
            for (var i = 0; i < $scope.unreceiveAmount.length; i++) {
                var amout = 0;
                for (var i = 0; i < $scope.length; i++) {
                    amout += $scope.unreceiveAmount[i];
                    if (amout < chargeAll) {
                        $scope.thisPay[i] = $scope.unreceiveAmount[i]
                    } else if (amout < chargeAll + $scope.unreceiveAmount[i]) {
                        $scope.thisPay[i] = (chargeAll * 100 + $scope.unreceiveAmount[i] * 100 - amout * 100) / 100
                    } else {
                        $scope.thisPay[i] = null
                    };
                    $scope.thisPayTotal += $scope.thisPay[i]
                }
            };
            //每条的冲抵金额数组
            var amout1 = 0;
            for (var i = 0; i < $scope.allcanCharge.length; i++) {
                amout1 += $scope.allcanCharge[i];
                if ($scope.allcanCharge[i]) {
                    if (amout1 < $scope.thisPayTotal) {
                        $scope.unintCharge[i] = $scope.allcanCharge[i]
                    } else if (amout1 < $scope.thisPayTotal + $scope.allcanCharge[i]) {
                        $scope.unintCharge[i] = ($scope.thisPayTotal * 100 + $scope.allcanCharge[i] * 100 - amout1 * 100) / 100
                    } else {
                        $scope.unintCharge[i] = null
                    };
                } else {
                    $scope.unintCharge[i] = null
                }
            }
            //本次冲抵金额
            if ($scope.thisPayTotal) {
                $scope.chargeAmount = $scope.thisPayTotal;
            } else {
                $scope.chargeAmount = null;
            }
        };
        //明细联动
        $scope.addpay = function (num) {
            //明细清空后的总额
            var adAmout = 0;
            for (var i = 0; i < $scope.thisPay.length; i++) {
                if ($scope.thisPay[i]) {
                    adAmout += $scope.thisPay[i]
                } else {
                    adAmout += 0;
                }
            };
            $scope.chargeAmount = Math.round(adAmout * 100) / 100;
            $scope.thisPayTotal = Math.round(adAmout * 100) / 100;
            console.log($scope.allcanCharge);
            //每条的冲抵金额数组
            var adAmout1 = 0;
            for (var i = 0; i < $scope.allcanCharge.length; i++) {
                adAmout1 += $scope.allcanCharge[i];
                if ($scope.allcanCharge[i]) {
                    if (adAmout1 < $scope.thisPayTotal) {
                        $scope.unintCharge[i] = $scope.allcanCharge[i]
                    } else if (adAmout1 < $scope.thisPayTotal + $scope.allcanCharge[i]) {
                        $scope.unintCharge[i] = ($scope.thisPayTotal * 100 + $scope.allcanCharge[i] * 100 - adAmout1 * 100) / 100
                    } else {
                        $scope.unintCharge[i] = 0
                    };
                } else {
                    $scope.unintCharge[i] = 0
                }
            }

            if (num) {
                $scope.chargeAmount = 0;
                $scope.thisPayTotal = 0;
                for (var i = 0; i < $scope.thisPay.length; i++) {
                    if ($scope.thisPay[i]) {
                        $scope.thisPayTotal += $scope.thisPay[i]
                    } else {
                        $scope.thisPayTotal += 0;
                    }
                };
                //每条的冲抵金额数组
                var amout1 = 0;
                for (var i = 0; i < $scope.canCharge.length; i++) {
                    amout1 += $scope.canCharge[i];
                    if ($scope.canCharge[i]) {
                        if (amout1 < $scope.thisPayTotal) {
                            $scope.unintCharge[i] = $scope.canCharge[i]
                        } else if (amout1 < $scope.thisPayTotal + $scope.canCharge[i]) {
                            $scope.unintCharge[i] = ($scope.thisPayTotal * 100 + $scope.canCharge[i] * 100 - amout1 * 100) / 100
                        } else {
                            $scope.unintCharge[i] = 0
                        };
                    } else {
                        $scope.unintCharge[i] = 0
                    }
                }
                //本次冲抵金额
                if ($scope.thisPayTotal) {
                    $scope.chargeAmount = $scope.thisPayTotal;
                } else {
                    $scope.chargeAmount = 0;
                }
            } else {
                window.alert("最多两位小数的正数，请重新填写！");
            }
        };
        //保存
        var checkSubmitFlg = false;
        $scope.save = function () {
            if (checkSubmitFlg == true) {
                return false;
            } else {
                checkSubmitFlg = true;
                var param = {};
                param.receivableHeadId = $scope.receivableHeadId;
                var arry = [];
                for (var i = 0; i < $scope.length; i++) {
                    arry[i] = {
                        "toBillId": $scope.toBillId[i],
                        "chargeAmount": $scope.thisPay[i]
                    }
                };
                param.itemList = JSON.stringify(arry);
                if ($scope.chargeType == 1) {
                    //保证金冲抵
                    var arry1 = [];
                    for (var i = 0; i < $scope.fromBillId.length; i++) {
                        arry1[i] = {
                            "fromBillId": $scope.fromBillId[i],
                            "chargeAmount": $scope.unintCharge[i]
                        }
                    };
                    param.depositList = JSON.stringify(arry1);
                    $.post("/ovu-park/backstage/rental/charge/createDepositCharge", param, function (resp) {
                        if (resp.code==0) {
                            $timeout(function () {
                                // $location.url('/rental/finacial/receivablesFinacial');
                                $scope.$emit('needToClose', curPage);
                            }, 1)
                        } else {
                            alert(resp.message);
                            checkSubmitFlg = false;
                        }
                    })
                } else if ($scope.chargeType == 2) {
                    //预约冲抵
                    $.post("/ovu-park/backstage/rental/charge/createAdvanceCharge", param, function (resp) {
                        if (resp.code==0) {
                            $timeout(function () {
                                // $location.url('/rental/finacial/receivablesFinacial');
                                $scope.$emit('needToClose', curPage);
                            }, 1)
                        } else {
                            alert(resp.message);
                            checkSubmitFlg = false;
                        }
                    })
                }
            }  
        };
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
