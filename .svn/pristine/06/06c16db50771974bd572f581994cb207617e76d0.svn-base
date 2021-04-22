(function () {
    var app = angular.module("angularApp");
    app.controller('lookAgreementCtrl', function ($scope, $rootScope, $http, $uibModal, $filter,fac, $location) {
        var time = 1576139053000
        console.log($filter('date')(time,'yyyy-MM-dd'));
        $scope.contractId = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        $scope.opinion = "";
        $scope.tabStatus = 0;
        $scope.unitStatus = [{name: '元/日/㎡',id: 1},{name: '元/月/㎡',id: 2},{name: '元/季度/㎡',id: 3},{name: '元/半年/㎡',id: 4},{name: '元/年/㎡',id: 5}];
        $scope.payStatus = [{name: '月',id: 1},{name: '季度',id: 2},{name: '半年',id: 3},{name: '年',id: 4}];
        $scope.cycleStatus = [{name: '按月顺推',id: 1}];
        $scope.dueTimeStatus = [{name: '上期最后一日',id: 1},{name: '本期首日',id: 2},{name: '本期首日后',id: 3},{name: '本期首日前',id: 5}];
        $scope.taxStatus = [{name: '税前',id: 1},{name: '税后',id: 2}];
        $scope.rentOutDueTimeStatus = [{name: '营业额提交后',id: 4}];
        $scope.commissionModelStatus = [{name: '固定比例',id: 2}];
        $scope.downPayStatus = [{name: '合同线上审批后',id: 1},{name: '指定日期',id: 2},{name: '合同线下审批日期后',id: 3}];
        // 固定租金约定
        $scope.fixedRentMsg = {};
        $scope.fixedRentList = [];
        $scope.fixedRentListDetail = [];
        $scope.freeRentList = [];
        // 抽成租金约定
        $scope.rentOutMsg = {};
        $scope.rentOutList = [];
        $scope.rentOutListDetail = [];
        $scope.freeOutList = [];
        // 首期约定
        $scope.initialAgreeMsg = {};
        $scope.initialAgreeList = [];
        // 其他费项
        $scope.otherChargeList = [];
        // 获取合同详情
        $scope.getContractMsg = function () {
            var param = {
                contractId: $scope.contractId.id
            };
            $http.post("/ovu-park/backstage/rental/contractBaseInfo/viewContractInfo", param, fac.postConfig).success(function (resp) {
                $scope.contractMsg = resp.data;
                // 计算租赁空间的时长
                $scope.contractMsg.rentalContractHouseInfos.forEach((value, index) => {
                    value.leaseMonth = getTotalMonths(value.leaseStart, value.leaseEnd)
                })
                // 获取租金约定的tab栏
                $scope.tabList = getRentTabs($scope.contractMsg.rentalModal);
                if ($scope.tabList.length > 0) {
                    $scope.tabStatus = $scope.tabList[0].value;
                }
                // 获取租金约定
                getRentAgreement($scope.contractMsg);
            });
        }
        //  获取预计应收账单
        $scope.pageModel = {};
        $scope.search = {
            contractId: $scope.contractId.id,
            parkId: app.park.parkId
        };
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/rental/contractBill/findPlanBillList", $scope.search, function (resp) {
                console.log(resp);
                $scope.pageModel = resp;
            });
        };
        
        $scope.cancel = function () {
            $scope.$emit('needToClose', curPage);
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
                $scope.getContractMsg();
            })
        });

        // 预计应收账单
        $scope.estimatedBill = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/modal.estimatedBill.html',
                controller: 'estimatedBillCtrl',
                resolve: {
                    item: $scope.contractId
                }
            });
            modal.result.then(function () {

            }, function () {})
        }

        // 文件下载
        $scope.downLoad = function (id) {
            $http.get("/ovu-park/backstage/rental/contractFile/getDownUrl?id="+id).success(function (resp) {
                if (resp.code == 0) {
                    window.open(resp.data);
                } else {
                    window.alert(resp.msg);
                }
            })
        }

        // 获取 所有费项列表
        $scope.expenditureListAll = function () {
            var params = {
                status: "1",
                parkId: app.park.parkId,
            };
            $http.post("/ovu-park/backstage/rental/rentalExpenditureManage/select", params, fac.postConfig).success(function (resp) {
                $scope.expenditureList = [];
                if (resp.code == 0) {
                    resp.data.forEach(function (n) {
                        if (n.category == "05" && n.name == "履约保证金") {
                            $scope.expenditureList.unshift(n);
                            return;
                        }
                        $scope.expenditureList.push(n);
                    });
                    console.log($scope.expenditureList);
                } else {
                    window.alert(resp.message);
                }
            });
        };
        $scope.expenditureListAll();

        // 展开租期详情
        $scope.leaseDate = false;
        $scope.showLeaseDate = function () {
            $scope.leaseDate = !$scope.leaseDate;
        }

        //查看费用标准
        $scope.openSetCost = function (index, item) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreementNew/modal.setCost.html',
                controller: 'setCostCtrl',
                resolve: {
                    expenditure: item,
                    index: index,
                    view: true
                }
            });
        }

        // 租金约定tab栏切换
        $scope.changeTab = function (value) {
            $scope.tabStatus = value;
        }
        // 查看租金详细
        $scope.fixRentDetail = function (item) {
            let transmitData = {
                pId: item.id,
                leaseStart: item.leaseStart,
                leaseEnd: item.leaseEnd,
                unitStatus: $scope.fixedRentMsg.payUnit,
                taxRate: $scope.contractMsg.taxRate,
                houseList: JSON.stringify($scope.fixedRentListDetail)
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/modal.lookShowDetail.html',
                controller: 'lookShowDetailCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, {
                            data: transmitData
                        })
                    }
                }
            });
            modal.result.then(function (data) {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 获取租金约定tab栏
        function getRentTabs(status) {
            let rentList = [{
                    name: '固定租金约定',
                    value: 1
                },
                {
                    name: '抽成租金约定',
                    value: 2
                }
            ]
            if (!status) {
                return [];
            }
            if (status == 3) {
                return rentList;
            } else {
                let arr = [];
                arr.push(rentList[(status - 1)])
                return arr;
            }
        }

        // 区间日期的月数
        function getTotalMonths(start, end) {
            if (!start || !end) {
                return;
            }
            var startTime = new Date(start);
            var endTime = new Date(end);
            var months;
            months = (endTime.getFullYear() - startTime.getFullYear()) * 12;
            months -= startTime.getMonth();
            months += endTime.getMonth();
            if (startTime.getDate() >= endTime.getDate()) {
                months = (months == 0 ? 0 : months);
            } else {
                months = (months == 0 ? 1 : months + 1);
            }
            return months;
        }
        // 租金约定/首期约定/其他费项
        function getRentAgreement(data) {
            let conditions = data.rentalContractConditions || [];
            let rentList = [];
            let rentListDetail = [];
            let outList = [];
            let outListDetail = [];
            conditions.forEach((value, index) => {
                value.leaseStart = $filter('date')(value.leaseStart, 'yyyy-MM-dd');
                value.leaseEnd = $filter('date')(value.leaseEnd, 'yyyy-MM-dd');
                if (value.parentId && value.rentModel == 1) {
                    rentListDetail.push(value)
                } else if(!value.parentId && value.rentModel == 1) {
                    rentList.push(value);
                } else if (value.parentId && value.rentalModel == 2) {
                    outListDetail.push(value)
                } else if (!value.parentId && value.rentModel == 2) {
                    value.commissionModel = value.rentModel + '';
                    outList.push(value)
                }
            })
            $scope.fixedRentList = rentList;
            $scope.fixedRentListDetail = rentListDetail;
            $scope.rentOutList = outList;
            $scope.rentOutListListDetail = outListDetail;
            let freePeriods = data.rentalContractFreePeriods || [];
            let freeRent = [];
            let freeOut = [];
            freePeriods.forEach((value, index) => {
                value.freeDateStart = $filter('date')(value.freeDateStart, 'yyyy-MM-dd');
                value.freeDateEnd = $filter('date')(value.freeDateEnd, 'yyyy-MM-dd');
                if (value.rentModel == 1) {
                    freeRent.push(value);
                } else {
                    freeOut.push(value);
                }
            });
            $scope.freeRentList = freeRent;
            $scope.freeOutList = freeOut;
            // 固定租金约定
            $scope.fixedRentMsg.payUnit = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].payUnit ? $scope.fixedRentList[0].payUnit + '' : '2') : '2';
            $scope.fixedRentMsg.payCycle = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].payCycle ? $scope.fixedRentList[0].payCycle + '' : '') : '';
            $scope.fixedRentMsg.cycleWay = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].cycleWay ? $scope.fixedRentList[0].cycleWay + '' : '') : '';
            $scope.fixedRentMsg.payDate = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].payDate ? $scope.fixedRentList[0].payDate + '' : '') : '';
            $scope.fixedRentMsg.afterDays = $scope.fixedRentList[0] ? ($scope.fixedRentList[0].afterDays ? $scope.fixedRentList[0].afterDays : '') : '';
            $scope.fixedRentMsg.createBillModel = $scope.contractMsg.createBillModel;
            // 抽成租金约定
            $scope.rentOutMsg.turnoverCycle = $scope.rentOutList[0] ? ($scope.rentOutList[0].turnoverCycle ? $scope.rentOutList[0].turnoverCycle + '' : '') : '';
            $scope.rentOutMsg.turnoverCycleWay = $scope.rentOutList[0] ? ($scope.rentOutList[0].turnoverCycleWay ? $scope.rentOutList[0].turnoverCycleWay + '' : '') : '';
            $scope.rentOutMsg.turnoverStandard = $scope.rentOutList[0] ? ($scope.rentOutList[0].turnoverStandard ? $scope.rentOutList[0].turnoverStandard + '' : '') : '';
            $scope.rentOutMsg.payCycle = $scope.rentOutList[0] ? ($scope.rentOutList[0].payCycle ? $scope.rentOutList[0].payCycle + '' : '') : '';
            $scope.rentOutMsg.cycleWay = $scope.rentOutList[0] ? ($scope.rentOutList[0].cycleWay ? $scope.rentOutList[0].cycleWay + '' : '') : '';
            $scope.rentOutMsg.payDate = $scope.rentOutList[0] ? ($scope.rentOutList[0].payDate ? $scope.rentOutList[0].payDate + '' : '') : '';
            $scope.rentOutMsg.afterDays = $scope.rentOutList[0] ? ($scope.rentOutList[0].afterDays ? $scope.rentOutList[0].afterDays : '') : '';
            // 首期约定
            if ($scope.contractMsg.createBillModel == '1') { // 按合同生成账单
                $scope.initialAgreeMsg.firstStartDate = conditions[0] ? conditions[0].firstStartDate : 0;
                $scope.initialAgreeMsg.firstEndDate = conditions[0] ? conditions[0].firstEndDate : 0;
                $scope.initialAgreeMsg.firstStartDate = $filter('date')($scope.initialAgreeMsg.firstStartDate, 'yyyy-MM-dd');
                $scope.initialAgreeMsg.firstEndDate = $filter('date')($scope.initialAgreeMsg.firstEndDate, 'yyyy-MM-dd');
            } else { // 按租赁空间生成账单
                let houseIds = [];
                let agreeList = [];
                $scope.fixedRentListDetail.forEach((value,index) => {
                    if (houseIds.indexOf(value.contractHouseId) == -1) {
                        houseIds.push(value.contractHouseId);
                        agreeList.push(value);
                    }
                })
                $scope.initialAgreeList = agreeList;
                $scope.initialAgreeList.forEach((value, index) => {
                    value.firstStartDate = $filter('date')(value.firstStartDate, 'yyyy-MM-dd');
                    value.firstEndDate = $filter('date')(value.firstEndDate, 'yyyy-MM-dd');
                    value.houseName = value.houseName ? value.houseName : '--'
                });
            }
            $scope.initialAgreeMsg.firstPayPeriod = conditions[0] ? (conditions[0].firstPayPeriod ? conditions[0].firstPayPeriod + '' : '') : '';
            $scope.initialAgreeMsg.firstAppiontDate = conditions[0] ? (conditions[0].firstAppiontDate ? conditions[0].firstAppiontDate : '') : '';
            $scope.initialAgreeMsg.firstAppiontDate && ($scope.initialAgreeMsg.firstAppiontDate = $filter('date')($scope.initialAgreeMsg.firstAppiontDate, 'yyyy-MM-dd'));
            $scope.initialAgreeMsg.afterApproveDays = conditions[0] ? (conditions[0].afterApproveDays ? conditions[0].afterApproveDays : '') : '';
            $scope.initialAgreeMsg.createBillModel = $scope.contractMsg.createBillModel;
            // 其他费项
            let taxRate;
            $scope.otherChargeList = data.rentalContractRelativeExpenditures || [];
            $scope.otherChargeList.forEach((value, index) => {
                value.payDateStart = value.payDateStart ? $filter('date')(value.payDateStart, 'yyyy-MM-dd') : $scope.initialAgreeMsg.firstStartDate;
                value.payDateEnd = value.payDateEnd ? $filter('date')(value.payDateEnd, 'yyyy-MM-dd') : $scope.initialAgreeMsg.firstEndDate;
                value.expenditureName = value.expenditureName || '履约保证金';
                value.expenditureId = value.expenditureId || $scope.expenditureList[0].id;
                value.taxRate = value.taxRate || $scope.expenditureList[0].taxRate || 0;
                taxRate = value.taxRate / 100;
                value.taxPrice = value.totalPrice * taxRate / (1+taxRate);
                value.rentPrice = value.totalPrice - value.taxPrice;
            });
        }
    });

    //预计应收账单
    app.controller('estimatedBillCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $timeout, $filter, fac, item) {
        $scope.contractId = item;
        $scope.search = {}
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.parkId = app.park.parkId;
            $scope.search.contractId = $scope.contractId.id;
            fac.getPageResult("/ovu-park/backstage/rental/contractBill/findPlanBillList", $scope.search, function (resp) {
                console.log(resp);
                $scope.pageModel = resp;
            });
        };
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
            })
        });

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });

    //查看费用标准
    app.controller('setCostCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, expenditure, index, view) {
        $scope.expenditure = expenditure;
        $scope.index = index;
        $scope.view = view;
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

    // 查看租金详情
    app.controller('lookShowDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $location, $filter, fac, item) {
        $scope.unitStatus = [{name: '元/日/㎡',id: 1},{name: '元/月/㎡',id: 2},{name: '元/季度/㎡',id: 3},{name: '元/半年/㎡',id: 4},{name: '元/年/㎡',id: 5}];
        $scope.detailData = item.data;
        $scope.houseList = JSON.parse($scope.detailData.houseList);
        $scope.save = function (form) {
            $uibModalInstance.close()
        };
        $scope.cancel = function (params) {
            $uibModalInstance.dismiss('cancel');
        };
    })

    // 计费单位 {name: '元/日/㎡',id: 1},{name: '元/月/㎡',id: 2},{name: '元/季度/㎡',id: 3},{name: '元/半年/㎡',id: 4},{name: '元/年/㎡',id: 5}
    app.filter("payUnit", function () {
        return function (status) {
            if (status == 1) {
                return '元/日/㎡'
            } else if (status == 2) {
                return '元/月/㎡'
            } else if (status == 3) {
                return '元/季度/㎡'
            } else if (status == 4) {
                return '元/半年/㎡'
            } else if (status == 5) {
                return '元/年/㎡'
            } else {
                return '--'
            }
        }
    })
    // 交费周期 {name: '月',id: 1},{name: '季度',id: 2},{name: '半年',id: 3},{name: '年',id: 4}
    app.filter("payCycle", function () {
        return function (status) {
            if (status == 1) {
                return '月'
            } else if (status == 2) {
                return '季度'
            } else if (status == 3) {
                return '半年'
            } else if (status == 4) {
                return '年'
            } else {
                return '--'
            }
        }
    })
    // 交费期限 {name: '上期最后一日',id: 1},{name: '本期首日',id: 2},{name: '本期首日后',id: 3},{name: '本期首日前',id: 5}
    app.filter("payDate", function () {
        return function (status) {
            if (status == 1) {
                return '上期最后一日'
            } else if (status == 2) {
                return '本期首日'
            } else if (status == 3) {
                return '本期首日后'
            } else if (status == 4) {
                return '营业额提交后'
            } else if (status == 5) {
                return '本期首日前'
            } else {
                return '--'
            }
        }
    })
    // 计费基准 {name: '税前',id: 1},{name: '税后',id: 2}
    app.filter("turnoverStandard", function () {
        return function (status) {
            if (status == 1) {
                return '税前'
            } else if (status == 2) {
                return '税后'
            } else {
                return '--'
            }
        }
    })
})()
