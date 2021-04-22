(function () {
    var app = angular.module("angularApp");
    app.controller('turnoverManageCtrl', function ($scope, $rootScope, $http, $filter, $location, $uibModal, fac, $timeout) {
        document.title = "OVU-账单管理";
        $scope.status = [{
                value: "0",
                text: "未填写营业额"
            },
            {
                value: "1",
                text: "待提交"
            },
            {
                value: "2",
                text: "已提交"
            },
            {
                value: "3",
                text: "逾期"
            },
            // { value: "4", text: "作废" }
        ];

        $scope.itemArray = [{
                id: 1,
                name: 'first'
            },
            {
                id: 2,
                name: 'second'
            },
            {
                id: 3,
                name: 'third'
            },
            {
                id: 4,
                name: 'fourth'
            },
            {
                id: 5,
                name: 'fifth'
            },
        ];
        // 排序状态值
        $scope.sortStatusCopy = {
            enterDateSort: -1,
            startDateSort: -1,
            agentDateSort: -1
        }
        $scope.sortStatus = {
            enterDateSort: -1,
            startDateSort: -1,
            agentDateSort: -1
        }
        // 获取列表
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.parkId = app.park.parkId;
            fac.getPageResult("/ovu-park/backstage/rental/rentalContractTurnovers/selectByPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
            $.post("/ovu-park/backstage/rental/expenditure/listAll?parkId=" + app.park.parkId, function (resp) {
                $scope.expenditure = resp.data
            });
        };

        $scope.turnoverSort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.enterDateSort;
            delete $scope.search.startDateSort;
            delete $scope.search.agentDateSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
        //计算月租金
        $scope.getMonthRent = function (averageUnitPrice, contractArea) {
            return parseInt(averageUnitPrice) * parseInt(contractArea);
        }
        //营业额查看&编辑
        $scope.addMsg = function (item, type) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/finacial/modal.turnoverAdd.html',
                controller: 'turnoverAddCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, item, {
                            type: type
                        });
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {});
        }
        // 提交合同
        $scope.submitContract = function (item) {
            let params = {
                id: item.id,
                secondPartyId: item.secondPartyId,
                secondPartyName: item.secondPartyName,
                contractCode: item.contractCode,
                contractId: item.contractId,
                turnovers: item.turnovers,
                startDate: $filter('date')(item.startDate, 'yyyy-MM-dd'),
                endDate: $filter('date')(item.endDate, 'yyyy-MM-dd'),
                contractBillId: item.contractBillId,
                status: 2
            }
            confirm("该操作一经提交无法修改，请确认是否提交营业额记录？", function () {
                $http.post("/ovu-park/backstage/rental/rentalContractTurnovers/save", params, fac.postConfig).success(function (resp) {
                    console.log(resp)
                    if (resp.code === 0) {
                        window.msg(resp.msg);
                        $scope.find();
                    } else {
                        window.alert(resp.message)
                    }

                });
            })
        }
        // 查看合同详情
        $scope.checkContract = function (id) {
            $rootScope.target("rental/rentAgreementNew/lookAgreement", "预览合同", false, '', {
                "id": id
            }, "rental/rentAgreementNew/lookAgreement");
        }

        // 营业额未缴提醒
        $scope.remind = function (item) {
            let params = {
                billId: item.contractBillId
            }
            $http.post("/ovu-park/backstage/rental/contractBill/remindTurnovers", params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });
    });

    // 营业额查看
    app.controller('turnoverAddCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.search = item;
        $scope.typeStatus = $scope.search.type;
        if ($scope.typeStatus === 1) {
            $scope.isSave = false;
            $scope.title = '查看营业额';
        } else {
            $scope.isSave = true;
            $scope.title = '编辑营业额';
        }
        $scope.turnoverChange = function (turnover) {
            $scope.turnoverEditList.commissionPrice = turnover? (turnover * $scope.turnoverEditList.commissionPercent / 100): 0;
            if ($scope.turnoverEditList.commissionPrice < $scope.turnoverEditList.billingAmount) {
                $scope.turnoverEditList.commissionPrice = $scope.turnoverEditList.billingAmount
            } else {
                $scope.turnoverEditList.commissionPrice = ($scope.turnoverEditList.commissionPrice).toFixed(2);
            }
        }
        $scope.find = function () {
            $http.post("/ovu-park/backstage/rental/rentalContractTurnovers/viewTurnoversInfo", {
                id: $scope.search.id
            }, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.turnoverEditList = resp.data;
                } else {
                    window.alert(resp.msg);
                }
            })

        }
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项！");
                return false;
            }
            let params = {
                id: $scope.turnoverEditList.id,
                secondPartyId: $scope.turnoverEditList.secondPartyId,
                secondPartyName: $scope.turnoverEditList.secondPartyName,
                contractCode: $scope.turnoverEditList.contractCode,
                contractId: $scope.turnoverEditList.contractId,
                turnovers: $scope.turnoverEditList.turnovers,
                startDate: $filter('date')($scope.turnoverEditList.startDate, 'yyyy-MM-dd'),
                endDate: $filter('date')($scope.turnoverEditList.endDate, 'yyyy-MM-dd'),
                status: 1
            }
            $http.post("/ovu-park/backstage/rental/rentalContractTurnovers/save", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.message)
                }

            });

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        app.modulePromiss.then(function () {
            $scope.find();
        });
    });

    app.filter("finacialStatus", function () {
        return function (status) {
            switch (status) {
                case '0':
                    return '未缴';
                    break;
                case '1':
                    return '已缴';
                    break;
                case '2':
                    return '欠缴';
                    break;
                case '9':
                    return '作废';
                    break;
            }
        }
    })
    app.filter("text", function () {
        return function (text) {
            if (text) {
                return text + '-';
            } else {
                return
            }

        }
    })
    app.filter("turnoverStatus", function () {
        return function (status) {
            status += '';
            switch (status) {
                case '0':
                    return '未填写营业额';
                    break;
                case '1':
                    return '待提交';
                    break;
                case '2':
                    return '已提交';
                    break;
                case '3':
                    return '逾期';
                    break;
                case '4':
                    return '作废';
                    break;
            }
        }
    })
})()
