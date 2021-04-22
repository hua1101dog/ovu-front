(function() {
    var app = angular.module("angularApp");
    app.controller('flushExamineCtrl', ['$scope', '$rootScope', '$http', '$filter', '$uibModal', 'fac', '$location', '$timeout', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        $scope.flushObj = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.pageType = $scope.flushObj.pageType;
        $.post("/ovu-park/backstage/rental/charge/detail?id=" + $scope.flushObj.id, function (resp) {
            $timeout(function () {
                $scope.receivab = resp.data.receivableHead;
                $scope.charge = resp.data.chargeHead;
                $scope.fromItem = resp.data.fromItemList;
                $scope.toItem = resp.data.toItemList;
            }, 1)
            

            $scope.billPriceTotal = 0;
            $scope.receiveTotal = 0;
            $scope.reliefTotal = 0;
            $scope.unreceiveTotal = 0;
            $scope.chargeAmountTotal = 0;
            $scope.arrearsTotal = 0;

            $scope.unreceiveAmount = [];
            $scope.billId = [];
            $scope.id = resp.data.chargeHead.id;

            $scope.receivableHeadId = resp.data.receivableHead.id;
            $scope.length = resp.data.toItemList.length;
            for (var i = 0; i < resp.data.toItemList.length; i++) {
                $scope.billPriceTotal += resp.data.toItemList[i].billPrice;
                $scope.receiveTotal += resp.data.toItemList[i].lastReceiveAmount;
                $scope.reliefTotal += resp.data.toItemList[i].lastReliefAmount;
                $scope.unreceiveTotal += resp.data.toItemList[i].lastUnreceiveAmount;
                $scope.chargeAmountTotal += resp.data.toItemList[i].chargeAmount;
                $scope.arrearsTotal += resp.data.toItemList[i].lastArrearsAmount;

                $scope.unreceiveAmount[i] = resp.data.toItemList[i].unreceiveAmount;
                $scope.billId[i] = resp.data.toItemList[i].id;
            }

        });

        $scope.thisPay = [];
        $scope.thisPayTotal = 0.00;
        $scope.addpay = function (num) {
            $scope.thisPayTotal = 0;
            for (var i = 0; i < $scope.length; i++) {
                $scope.thisPayTotal += $scope.thisPay[i];
            };
        };
        //通过、驳回
        $scope.viod = function (num) {
            if (!$scope.remark) {
                $scope.remark = null
            };
            var param = {
                "id": $scope.id,
                "auditFlag": num,
                "remark": $scope.remark
            };
            var comfi = "";
            if (num) {
                comfi = '通过'
            } else {
                comfi = '驳回'
            };
            confirm("确定" + comfi + "当前冲抵单吗？", function () {
                $http.post("/ovu-park/backstage/rental/charge/audit", param, fac.postConfig).success(function (resp) {
                    if (resp.code==0) {
                        window.msg("状态保存成功");
                        $timeout(function () {
                            // $location.url('/rental/home/rent')
                            $scope.$emit('needToClose', curPage);
                        }, 1)
                    } else {
                        window.alert(resp.message);
                    }
                });
            })
            //if (num == 0) {
            //    var modal = $uibModal.open({
            //        animation: false,
            //        size: '',
            //        templateUrl: '/view/rental/finacial/modal.reject.html',
            //        controller: 'rejectCtrl',
            //        resolve: {}
            //    });
            //    modal.result.then(function (data) {
            //        param.remark = data
            //        $.post("/ovu-park/backstage/rental/charge/audit", param, function (resp) {
            //            if (resp.code==0) {
            //                $timeout(function () {
            //                    $location.url('/rental/home/rent')
            //                }, 1)
            //            } else {
            //                alert(resp.message)
            //            }
            //        })
            //    }, function () {
            //    });
            //} else {
            //    $.post("/ovu-park/backstage/rental/charge/audit", param, function (resp) {
            //        if (resp.code==0) {
            //            $timeout(function () {
            //                $location.url('/rental/home/rent')
            //            }, 1)
                        
            //        } else {
            //            alert(resp.message)
            //        }
            //    })
            //}

        };
        //返回
        $scope.back = function () {
            // $location.url('/rental/home/rent')
            $scope.$emit('needToClose', curPage);
        };
        //关闭
        $scope.cancel = function () {
            // $location.url('/rental/finacial/detailFlush')
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
    // 驳回
    app.controller('rejectCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac) {
        $scope.save = function () {
            $uibModalInstance.close($scope.remark);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
})()
