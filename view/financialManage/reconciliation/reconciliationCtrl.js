(function () {
    var app = angular.module("angularApp");
    app.controller('reconciliationCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-对账管理";
        $scope.search = {
            orderStatus:'2,3',
            parkId: '',
            global: ''
        };
        $scope.pageModel = {};
        $scope.init = function (){
            $scope.search.global = $scope.urlSlice('global')
            if($scope.search.global){
                $scope.search.parkId = '' 
            }else{
                $scope.search.parkId = $scope.dept.parkId
            }
            $scope.find()
        }

        $scope.urlSlice = function (paraName) {
            var url = window.location.toString();
            var arrObj = url.split("?");
            if (arrObj.length > 2) {
                var arr = arrObj[2].split('=')
                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                } else {
                    return "";
                }
            }else{
                return false
            }
        }

        // 查看外部消息
        $scope.find = function (pageNo) {
            if($scope.search.global != true &&
                $scope.search.global != 'true' &&
                !$scope.search.parkId)
            {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/backpaymentbill/page", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };


        $scope.moneyRange = [
            {
                value: 1, text: "100元以下", min: 0, max: 10000,
            },
            {
                value: 2, text: "100-200元", min: 10000, max: 20000,
            },
            {
                value: 3, text: "200-500元", min: 20000, max: 50000,
            },
            {
                value: 4, text: "500-1000元", min: 50000, max: 100000,
            },
            {
                value: 5, text: "1000元以上", min: 100000,
            },
        ]


        $http.get('/ovu-base/system/dictionary/tree?dicType=ORDERVERIFYSTATUS').success(function (resp) {
            if (resp.code == 0) {
                $scope.VERIFYSTATUS = resp.data

            } else {
                window.alert(resp.msg);
            }
        })

        // app.modulePromiss.then(function () {
        //     $scope.find(1);
        // });
            // 页面初始化
            app.modulePromiss.then(function () {
                $scope.$watch('dept.id', function (deptId, oldValue) {
                    if (deptId) {
                        if ($scope.dept.parkId) {
                            $scope.search.parkId = $scope.dept.parkId

                        } else {
                            $scope.search.parkId && delete $scope.search.parkId
                        }
                    }
                    $scope.init();
                })
            })


        $scope.query = function () {

            if ($scope.search.selMoneyRange) {
                var sel = $scope.moneyRange.find(v => {
                    return v.value == $scope.search.selMoneyRange
                })
                if ($scope.search.maxAmount)
                    delete  $scope.search.maxAmount
                if ($scope.search.minAmount)
                    delete  $scope.search.minAmount

                if (sel.max)
                    $scope.search.maxAmount = sel.max
                if (sel.min)
                    $scope.search.minAmount = sel.min

            } else {
                if ($scope.search.maxAmount)
                    delete  $scope.search.maxAmount
                if ($scope.search.minAmount)
                    delete  $scope.search.minAmount
            }
            $scope.find(1);
        }


        //批量操作
        $scope.batchOpt = function () {
            var sel = $scope.pageModel.data.filter(v => {
                return v.checked
            })

            var s = sel.filter(v => {
                return (v.ownVerifyStatus == 1 || v.ownVerifyStatus == 2 || v.ownVerifyStatus == 3)
            })
            if (s.length > 0) {
                window.alert('所选订单须处于未对账状态');
                return
            }
            $http.post('/ovu-park/backstage/backpaymentbill/verify', {
                billId: sel.map(v => {
                    return v.billId
                }).join(','),
                ownVerifyStatus: 1,
            }).success(function (resp) {
                if (resp.code == 0) {
                    msg('操作成功')
                    $scope.find(1);
                } else {
                    window.alert(resp.msg);
                }
            })
        };

        $scope.exp = function () {
            if($scope.search.global != true &&
                $scope.search.global != 'true' &&
                !$scope.search.parkId)
            {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            var sel = $scope.pageModel.data.filter(v => {
                return v.checked
            })
            var billIds = sel.map(v => {
                return v.billId
            }).join(',')
            window.open('/ovu-park/backstage/backpaymentbill/export?billIds=' + billIds)
        };

        function getParams(obj) {
            var str = []
            for (var k in obj) {
                if (obj[k])
                    str.push(k + '=' + obj[k])
            }
            return '?' + str.join('&')
        }

        $scope.expAll = function () {
            if($scope.search.global != true &&
                $scope.search.global != 'true' &&
                !$scope.search.parkId)
            {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            if ($scope.search.maxAmount ||
                $scope.search.minAmount ||
                $scope.search.billNoOrMid ||
                $scope.search.payType ||
                $scope.search.ownVerifyStatus ||
                $scope.search.payDate ||
                $scope.search.ownVerifyDate) {
                var params = {
                    orderStatus: '2,3',
                    parkId: app.park.parkId?app.park.parkId:app.park.id,
                    maxAmount: $scope.search.maxAmount,
                    minAmount: $scope.search.minAmount,
                    billNoOrMid: $scope.search.billNoOrMid,
                    payType: $scope.search.payType,
                    ownVerifyStatus: $scope.search.ownVerifyStatus,
                    payDate: $scope.search.payDate,
                    ownVerifyDate: $scope.search.ownVerifyDate,
                }

                var str = getParams(params)
                window.open('/ovu-park/backstage/backpaymentbill/export' + str)
            } else {
                window.open('/ovu-park/backstage/backpaymentbill/export?orderStatus=2,3&parkId='+$scope.search.parkId)
            }
        }


        $scope.showCateGroy = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/financialManage/reconciliation/modal.CateGroy.html',
                controller: 'CateGroyCtrl'

            });
        };

        $scope.showDetail = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/financialManage/reconciliation/modal.detail.html',
                controller: 'showDetailCtrl'
                , resolve: {data: item},
                backdrop: 'static',
                keyboard: false
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.showPr = function () {
            var obj = {}
            if ($scope.search.selMoneyRange) {
                obj.selMoneyRange = $scope.search.selMoneyRange
            }
            var copy = angular.extend(obj, $scope.search);

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/financialManage/reconciliation/modal.highsel.html',
                controller: 'addhighselCtrl'
                , resolve: {data: copy},
                backdrop: 'static',
                keyboard: false
            });
            modal.result.then(function (data) {
                if (data.selMoneyRange) {
                    var sel = $scope.moneyRange.find(v => {
                        return v.value == data.selMoneyRange
                    })
                    if ($scope.search.maxAmount)
                        delete  $scope.search.maxAmount
                    if ($scope.search.minAmount)
                        delete  $scope.search.minAmount

                    if (sel.max)
                        $scope.search.maxAmount = sel.max
                    if (sel.min)
                        $scope.search.minAmount = sel.min

                } else {
                    if ($scope.search.maxAmount)
                        delete  $scope.search.maxAmount
                    if ($scope.search.minAmount)
                        delete  $scope.search.minAmount
                }
                $scope.search.selMoneyRange = data.selMoneyRange
                $scope.search.billNoOrMid = data.billNoOrMid
                $scope.search.payType = data.payType
                $scope.search.ownVerifyStatus = data.ownVerifyStatus
                $scope.search.payDate = data.payDate
                $scope.search.ownVerifyDate = data.ownVerifyDate
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });

    app.controller('CateGroyCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, $uibModal) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };

    });

    app.controller('showDetailCtrl', function ($scope, $http, $uibModalInstance, $filter, data, fac, $uibModal) {

        $scope.item = data
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };

        $scope.saveEdit = function () {
            $http.post('/ovu-park/backstage/backpaymentbill/verify', {
                billId: $scope.item.billId,
                ownVerifyStatus: $scope.item.ownVerifyStatus == 2 ? 3 : 1,
                ownVerifyRemark:$scope.item.ownVerifyRemark,
            }).success(function (resp) {
                if (resp.code == 0) {
                    msg('操作成功')
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.msg);
                }
            })
        }

    });

    app.controller('addhighselCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, data, $uibModal) {
        $scope.item = data;

        $scope.moneyRange = [
            {
                value: 1, text: "100元以下"
            },
            {
                value: 2, text: "100-200元"
            },
            {
                value: 3, text: "200-500元"
            },
            {
                value: 4, text: "500-1000元"
            },
            {
                value: 5, text: "1000元以上"
            },
        ]


        $http.get('/ovu-base/system/dictionary/tree?dicType=ORDERPAYTYPE').success(function (resp) {
            if (resp.code == 0) {
                $scope.payType = resp.data
            } else {
                window.alert(resp.msg);
            }
        })

        $http.get('/ovu-base/system/dictionary/tree?dicType=ORDERVERIFYSTATUS').success(function (resp) {
            if (resp.code == 0) {
                $scope.VERIFYSTATUS = resp.data
            } else {
                window.alert(resp.msg);
            }
        })

        $scope.saveMessage = function () {
            var copy = angular.extend({}, $scope.item);
            $uibModalInstance.close(copy);
        }

        $scope.reset = function () {
            $scope.item = {}
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };

    });


})()
