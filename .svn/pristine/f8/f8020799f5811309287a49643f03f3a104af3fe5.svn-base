(function () {
    var app = angular.module("angularApp");
    app.controller('jdorderManageIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-京东订单管理";
        $scope.tabIndex = 0
        $scope.selTab = function (index) {
            $scope.tabIndex = index
        }
    });

    app.controller('jdorderCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = {};
        $scope.pageModel = {};
        // 查看外部消息
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/jd/paymentbill/list", $scope.search, function (resp) {
                $scope.pageModel = resp;
                $scope.pageModel.data.forEach(item => {
                    item.skuNames = item.skuList.map(v => {
                        return v.name + ' ' + '数量' + v.num + ' ' + '价格￥' + v.price
                    }).join(',')
                })
            });
        };
        $scope.find(1)
        $scope.jdOrderState = [
            {
                value: 1,
                text: "新单",
            },
            {
                value: 2,
                text: "等待支付",
            },
            {
                value: 3,
                text: "等待支付确认",
            },
            {
                value: 4,
                text: "延迟付款确认",
            },
            {
                value: 5,
                text: "订单暂停",
            },
            {
                value: 6,
                text: "店长最终审核",
            },
            {
                value: 7,
                text: "等待打印",
            },
            {
                value: 8,
                text: "等待出库",
            },
            {
                value: 9,
                text: "等待打包",
            },
            {
                value: 10,
                text: "等待发货",
            },
            {
                value: 11,
                text: "自提途中",
            },
            {
                value: 12,
                text: "上门提货",
            },
            {
                value: 13,
                text: "自提退货",
            },
            {
                value: 14,
                text: "确认自提",
            },
            {
                value: 16,
                text: "等待确认收货",
            },
            {
                value: 17,
                text: "配送退货",
            },
            {
                value: 18,
                text: "货到付款确认",
            },
            {
                value: 19,
                text: "已完成",
            },
            {
                value: 21,
                text: "收款确认",
            },
            {
                value: 22,
                text: "锁定",
            },
            {
                value: 29,
                text: "等待三方出库",
            },
            {
                value: 30,
                text: "等待三方发货",
            },
            {
                value: 31,
                text: "等待三方发货完成",
            },
        ]

    });

    app.controller('jdorderbackCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = {};
        $scope.pageModel = {};
        // 查看外部消息
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/jd/paymentbill/refundList", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };
        $scope.find(1)

        $scope.returnType = [
            {
                value: 1,
                text: '父单返还',
            },
            {
                value: 2,
                text: '子单返还',
            },
            {
                value: 3,
                text: '售后退货',
            },
        ]

        $scope.single = function(item){
            if(item.isrefund==1)
                return
            $scope.returnMoney([item])
        }

        //批量操作
        $scope.batchOpt = function () {
            var sel = $scope.pageModel.data.filter(v => {
                return v.checked
            })

            var s = sel.filter(v => {
                return v.refundable == 0
            })
            if (s.length > 0) {
                window.alert('所选订单须处于未退款状态');
                return
            }
            $scope.returnMoney(sel)

        };

        $scope.returnMoney = function (data) {
            confirm("确认退款吗?", function () {
                var ids = []
                var id = []
                data.forEach(v => {
                    id.push(v.id)
                    if(v.businessCode){
                        ids.push(v.businessCode)
                    }
                    if(v.parentOrderId){
                        ids.push(v.parentOrderId)
                    }
                    if (v.childOrderId)
                        ids.push(v.childOrderId)
                })
                ids.join(',')
                id.join(",")
                $http.get('/ovu-park/backstage/jd/paymentbill/refund?orderIds='+ids+"&ids="+id).then(resp=>{
                    if(resp.data.code == 0){
                        msg("操作成功");
                        $scope.find(1);
                    }else{
                        alert(resp.data.msg);
                    }
                })
            })
        }


    });

    app.filter("jdOrderState", function () {
        return function (status) {
            if (!status) {
                return '--';
            }
            switch (status) {  //kw/h、M2、M3、户、吨
                case 1:
                    return "新单";
                case 2:
                    return "等待支付";
                case 3:
                    return "等待支付确认";
                case 4:
                    return "延迟付款确认";
                case 5:
                    return "订单暂停";
                case 6:
                    return "店长最终审核";
                case 7:
                    return "等待打印";
                case 8:
                    return "等待出库";
                case 9:
                    return "等待打包";
                case 10:
                    return "等待发货";
                case 11:
                    return "自提途中";
                case 12:
                    return "上门提货";
                case 13:
                    return "自提退货";
                case 14:
                    return "确认自提";
                case 16:
                    return "等待确认收货";
                case 17:
                    return "配送退货";
                case 18:
                    return "货到付款确认";
                case 19:
                    return "已完成";
                case 21:
                    return "收款确认";
                case 22:
                    return "锁定";
                case 29:
                    return "等待三方出库";
                case 30:
                    return "等待三方发货";
                case 31:
                    return "等待三方发货完成";
                default:
                    return '--'
            }
        }
    })

    app.filter("toTime", function () {
        return function (time) {
            if (!time) {
                return '--';
            }
            return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
        }
    })

})()
