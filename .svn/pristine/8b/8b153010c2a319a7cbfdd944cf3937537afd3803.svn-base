(function () {
    var app = angular.module("angularApp");
    app.controller('contractRefundCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        $scope.refundObj = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $.post("/ovu-park/backstage/rental/return/getInfo4Return?receivableHeadId=" + $scope.refundObj.receivableHeadId, function (resp) {
            $timeout(function () {
                $scope.list = resp.data.receivableHead;
                $scope.pageModel = resp.data.billList;
                $scope.returnUserName = resp.data.returnUserName;
            }, 1)
            $scope.billPriceTotal = 0;
            $scope.depositRemainTotal = 0;
            $scope.unreceiveAmount = [];
            $scope.billId = [];
            $scope.receivableHeadId = resp.data.receivableHead.id;
            $scope.length = resp.data.billList.length;
            for (var i = 0; i < resp.data.billList.length; i++) {
                $scope.billPriceTotal += resp.data.billList[i].billPrice;
                $scope.depositRemainTotal += resp.data.billList[i].depositRemain;
                
                $scope.unreceiveAmount[i] = resp.data.billList[i].depositRemain;
                $scope.billId[i] = resp.data.billList[i].billId;
            }

        });
        $scope.thisPay = [];
        $scope.thisPayTotal = 0.00;
        $scope.returnTotalAmount = 0;
        $scope.receivechange = function (num) {
            var nume = (num * 100 - $scope.list.advanceAmount * 100) / 100;
            $scope.thisPay = [];
            $scope.thisPayTotal = 0.00;
            $scope.returnTotalAmount = 0;
            if (num) {
                $scope.returnTotalAmount = num;
                if (nume > 0) {
                    $scope.thisPayTotal = 0;
                    var amout = 0;
                    for (var i = 0; i < $scope.length; i++) {
                        amout += $scope.unreceiveAmount[i];
                        if (amout < nume) {
                            $scope.thisPay[i] = $scope.unreceiveAmount[i]
                        } else if (amout < nume + $scope.unreceiveAmount[i]) {
                            $scope.thisPay[i] = (nume * 100 + $scope.unreceiveAmount[i] * 100 - amout * 100) / 100
                        } else {
                            $scope.thisPay[i] = null
                        };
                        $scope.thisPayTotal += $scope.thisPay[i]
                    }
                };
            } else {
                window.alert("最多两位小数的正数，输入金额不得大于可退金额，请重新填写！");
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
            $scope.returnTotalAmount = 0;
            $scope.thisPayTotal = Math.round(adAmout * 100) / 100;
            if (num) {
                $scope.thisPayTotal = 0;
                $scope.aform = {
                    returnTotalAmount: function () {
                        return angular.isDefined(0) ? (_name = 0) : _name;
                    }
                };
                for (var i = 0; i < $scope.length; i++) {
                    $scope.thisPayTotal += $scope.thisPay[i];
                };
                $scope.aform.returnTotalAmount = (Math.round($scope.thisPayTotal * 100 + $scope.list.advanceAmount * 100)) / 100;
                $scope.returnTotalAmount = $scope.aform.returnTotalAmount;
            } else {
                if (adAmout) {
                    $scope.aform.returnTotalAmount = adAmout;
                    $scope.returnTotalAmount = $scope.aform.returnTotalAmount;
                    window.alert("最多两位小数的正数，并且退款金额不能大于可退总额，请重新填写！");
                } else {
                    $scope.aform.returnTotalAmount = null;
                    window.alert("最多两位小数的正数，并且退款金额不能大于可退总额，请重新填写！");
                };
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
                param.receivableHeadId = $scope.receivableHeadId;
                param.returnTotalAmount = $scope.returnTotalAmount;

                var arry = [];
                for (var i = 0; i < $scope.length; i++) {
                    arry[i] = {
                        "billId": $scope.billId[i],
                        "returnAmount": $scope.thisPay[i]
                    }
                };
                param.itemList = JSON.stringify(arry);

                $.post("/ovu-park/backstage/rental/return/createReturn", param, function (resp) {
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
            
        };
        $scope.cancel = function () {
            // $location.url('/rental/finacial/receivablesFinacial');
            $scope.$emit('needToClose', curPage);
        };
    });
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
