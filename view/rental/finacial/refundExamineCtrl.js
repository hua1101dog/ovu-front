(function () {
    var app = angular.module("angularApp");
    app.controller('refundExamineCtrl', ['$scope', '$rootScope', '$http', '$filter', '$uibModal', 'fac', '$location', '$timeout', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        $scope.refundObj = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.pageStatus = $scope.refundObj.status;
        $.post("/ovu-park/backstage/rental/return/detail?id=" + $scope.refundObj.id, function (resp) {
            $timeout(function () {
                $scope.receivable = resp.data.receivableHead;
                $scope.return = resp.data.returnHead;
                $scope.returnItemList = resp.data.returnItemList;
            }, 1)
            $scope.id = resp.data.returnHead.id;

            $scope.billPriceTotal = 0.00;
            $scope.refundableAmountTotal = 0.00;
            $scope.returnAmountTotal = 0.00;
            for (var i = 0; i < resp.data.returnItemList.length; i++) {
                $scope.billPriceTotal += resp.data.returnItemList[i].billPrice;
                $scope.refundableAmountTotal += resp.data.returnItemList[i].refundableAmount;
                $scope.returnAmountTotal += resp.data.returnItemList[i].returnAmount;
            }
        });
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
            confirm("确定" + comfi + "当前退款单吗？", function () {
                $http.post("/ovu-park/backstage/rental/return/audit", param, fac.postConfig).success(function (resp) {
                    if (resp.code==0) {
                        window.msg("状态保存成功");
                        $timeout(function () {
                            // $location.url('/rental/home/rent');
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
            //        resolve: { }
            //    });
            //    modal.result.then(function (data) {
            //        param.remark = data
            //        $.post("/ovu-park/backstage/rental/return/audit", param, function (resp) {
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
            //    $.post("/ovu-park/backstage/rental/return/audit", param, function (resp) {
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
            $location.url('/rental/home/rent');
            $scope.$emit('needToClose', curPage);
        };
        $scope.cancel = function () {
            // $location.url('/rental/finacial/refundFinacial');
            $scope.$emit('needToClose', curPage);
        };
    }]);
    app.filter("payment", function () {
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
    app.filter("invoice1", function () {
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
