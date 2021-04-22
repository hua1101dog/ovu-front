(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("workPortalCtrl", function ($scope, $rootScope, $http, $uibModal, $filter, $timeout, fac) {
        console.log($rootScope.user)
        // 页面状态值
        $scope.search = {
            startTime: '',
            endTime: '',
            procDefKey: '', // 储存当前流程的信息
            serviceNo: '', // 服务号
            userId: app.user.personId,
            taskStatus: '0', // 0,待审核 1 已审核 2 已完成
        };
        // 存储列表信息
        $scope.pageModel = {};
        // 存储详情列表信息
        $scope.detailPageModel = {};
        // 存储详情列表的流转信息列表
        $scope.circulationPageModel = {};
        // 切换园区时查询列表
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
        // 获取列表信息 settled_workflow decorate_workflow out_rental_workflow
        $scope.find = function (pageNo, callback) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.parkId = app.park.parkId;
            fac.getPageResult("/ovu-workflow/act/controller/taskList", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        }
        // 查看流程图
        $scope.showFlowChart = function (data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/workflowManage/workflowModal/modal.flowChart.html",
                controller: "flowChartCtrl",
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 点击查看流程记录
        $scope.contractProcessRecord = function (data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/workflowManage/workflowModal/modal.contractProcessRecord.html",
                controller: "contractProcessRecordCtrl",
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });
            modal.result.then(function (){

            }, function () {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 审批
        $scope.contractShow = function (item) {
            let procDefKey = item.procDefKey.split("-")[0];
            $.extend(item, {
                taskStatus: $scope.search.taskStatus,
                personId: $rootScope.user.personId || '',
                procDefKey: procDefKey
            });
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "workflowManage/workflowModal/modal.workflow.publicApproval.html",
                controller: 'portalModalCtrl',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

            modal.rendered.then(function () {

            });

            modal.opened.then(function () {
                console.log("Modal opened");
            });
        }
    })

    // 审批弹出框控制器
    app.controller('portalModalCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, $timeout, fac, item) {
        $scope.time = new Date().getTime();
        $scope.curProcess = item;
        $scope.search = {
            comment: "同意"
        };
        $scope.processForm = {};
        $scope.processComment = [];
        $scope.attachmentlist = [];
        $scope.alreadyFiles = [];
        $scope.isOver = false;

        fac.loadSelect($scope, "DECORATION_STANDARD") //装修  
        fac.loadSelect($scope, "FUND_BANK") //公积金银行 
        fac.loadSelect($scope, "MORTGAGE_BANK") //贷款银行
        /**
         * 租赁合同
         */

        $scope.tabStatus = 0;
        $scope.unitStatus = [{
            name: '元/日/㎡',
            id: 1
        }, {
            name: '元/月/㎡',
            id: 2
        }, {
            name: '元/季度/㎡',
            id: 3
        }, {
            name: '元/半年/㎡',
            id: 4
        }, {
            name: '元/年/㎡',
            id: 5
        }];
        $scope.payStatus = [{
            name: '月',
            id: 1
        }, {
            name: '季度',
            id: 2
        }, {
            name: '半年',
            id: 3
        }, {
            name: '年',
            id: 4
        }];
        $scope.cycleStatus = [{
            name: '按月顺推',
            id: 1
        }];
        $scope.dueTimeStatus = [{
            name: '上期最后一日',
            id: 1
        }, {
            name: '本期首日',
            id: 2
        }, {
            name: '本期首日后',
            id: 3
        }, {
            name: '本期首日前',
            id: 5
        }];
        $scope.taxStatus = [{
            name: '税前',
            id: 1
        }, {
            name: '税后',
            id: 2
        }];
        $scope.rentOutDueTimeStatus = [{
            name: '营业额提交后',
            id: 4
        }];
        $scope.commissionModelStatus = [{
            name: '固定比例',
            id: 2
        }];
        $scope.downPayStatus = [{
            name: '合同审批后',
            id: 1
        }, {
            name: '指定日期',
            id: 2
        }];
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
        //  获取预计应收账单
        $scope.pageModel = {};
        $scope.planSearch = {
            parkId: app.park.parkId
        };
        $scope.find = function (pageNo) {
            $.extend($scope.planSearch, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.planSearch.contractId=$scope.contractMsg.id;
            fac.getPageResult("/ovu-park/backstage/rental/contractBill/findPlanBillList", $scope.planSearch, function (resp) {
                console.log(resp);
                $scope.pageModel = resp;
            });
        };

        // 查看租赁空间和租期详情
        $scope.showLeaseDetail = function (start, end, enter) {
            $scope.contractMsg.rentalContractHouseInfos.forEach((value, index) => {
                value.leaseStart = $filter('date')(value.leaseStart, 'yyyy-MM-dd');
                value.leaseEnd = $filter('date')(value.leaseEnd, 'yyyy-MM-dd');
                value.enterDate = $filter('date')(value.enterDate, 'yyyy-MM-dd');
            });

            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'workflowManage/workflowModal/modal.workflow.leaseDetail.html',
                controller: 'workflowLeaseDetailCtrl',
                resolve: {
                    item: function () {
                        return $scope.contractMsg.rentalContractHouseInfos;
                    },
                    leaseMsg: function () {
                        return $.extend({}, {
                            start: $scope.contractMsg.leaseStart,
                            end: $scope.contractMsg.leaseEnd
                        })
                    }
                }
            });
            modal.opened.then(function () { //模态窗口打开之后执行的函数   
                $scope.leaseDetailChange = false;
            });
            modal.result.then(function (data) {}, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
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

        // 预计应收账单
        $scope.estimatedBill = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/modal.estimatedBill.html',
                controller: 'estimatedBillCtrl',
                resolve: {
                    item: $scope.contractMsg
                }
            });
            modal.result.then(function () {

            }, function () {})
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
                } else if (!value.parentId && value.rentModel == 1) {
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
                $scope.fixedRentListDetail.forEach((value, index) => {
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
                taxRate = value.taxRate/100;
                value.taxPrice = value.totalPrice * taxRate / (1+taxRate);
                value.rentPrice = value.totalPrice - value.taxPrice;
            });
        }

        // 入驻申请/装修申请已审批文件列表
        $scope.nodeFileList = [];
        // 场地预定时间列表
        $scope.yardTimeList = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]
        // 切换表单
        $scope.switchForm = function () {
            console.log('切换了')
        }
        // 获取流程表单信息
        $scope.getSettledForm = function () {
            let params = {
                serviceNo: $scope.curProcess.serviceNo
            };
            let url = '/ovu-park/backstage/flow/common/getForm/';
            if ($scope.curProcess.procDefKey == 'settled_workflow') { // 入驻
                url = '/ovu-park/backstage/flow/settled/getForm/';
            } else if ($scope.curProcess.procDefKey == 'decorate_workflow') { // 装修
                url = ' /ovu-park/backstage/flow/decorate/getForm/';
            } else if ($scope.curProcess.procDefKey == 'out_rental_workflow') { // 退租
                url = '/ovu-park/backstage/flow/outrental/getForm/';
            } else if ($scope.curProcess.procDefKey == 'yard_reserve_workflow' || $scope.curProcess.procDefKey === 'ad_reserve_workflow') { // 场地 / 广告位
                url = '/ovu-park/backstage/flow/common/getForm/';
            } else if ($scope.curProcess.procDefKey == 'house_rental_workflow') { // 租赁合同
                url = '/ovu-park/backstage/flow/rental/getForm/';
            }else if ($scope.curProcess.procDefKey == 'rental_relief_workflow') { // 免租申请
                url = '/ovu-park/backstage/flow/rentRelief/getForm/';
            }
            $http.get(url + params.serviceNo).success(function (response) {
                if (response.code === 0) {
                    $scope.processForm = response.data;
                    if ($scope.curProcess.procDefKey === 'out_rental_workflow') {
                        $scope.search = response.data;
                        $scope.search.rentType && ($scope.search.rentType = String($scope.search.rentType));
                        $scope.search.depositType && ($scope.search.depositType = String($scope.search.depositType));
                        $scope.search.depositFreeType && ($scope.search.depositFreeType = String($scope.search.depositFreeType));
                    } else if ($scope.curProcess.procDefKey == 'ad_reserve_workflow') {
                        $scope.search = angular.copy($scope.processForm.formData) || {};
                        if (!$scope.processForm.formData.advertisement.reducedPrice) {
                            $scope.processForm.formData.advertisement.reducedPrice = $scope.processForm.formData.totalPrice;
                        }
                        $scope.search.realMoney = $scope.search.realMoney || $scope.processForm.formData.advertisement.reducedPrice;
                        $scope.search.realMoney = Number($scope.search.realMoney);
                    } else if ($scope.curProcess.procDefKey == 'house_rental_workflow') {
                        $scope.contractMsg = response.data.formData;
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
                        $scope.find(1);
                    } else {
                        $scope.search = angular.copy($scope.processForm.formData) || {};
                        $scope.search.realMoney && ($scope.search.realMoney = Number($scope.search.realMoney))
                    }
                    $scope.search.comment = "同意";
                } else {
                    window.alert(response.message)
                }
            })
        }
        // 获取流程记录/审批信息
        $scope.getComments = function () {
            let params = {
                processInstanceId: $scope.curProcess.processInstanceId
            }
            $http.get("/ovu-workflow/act/comment/getComments", {
                params: params
            }).success(function (response) {
                if (response.code === 0) {
                    $scope.processComment = response.data;
                    $scope.alreadyFiles = getAlreadyFile($scope.processComment);
                } else {
                    window.alert(response.message);
                }
            })
        }
        // 获取附件列表
        $scope.getAttachmentList = function () {
            let params = {
                businessKey: $scope.curProcess.serviceNo,
                pageIndex: 0,
                pageSize: 100
            }
            $http.post("/ovu-park/backstage/flow/attachment/list", params, fac.postConfig).success(function (response) {
                if (response.code === 0) {
                    $scope.attachmentlist = response.data.data;
                    $scope.alreadyFiles = getAlreadyFile($scope.processComment);
                    if ($scope.curProcess.procDefKey === 'out_rental_workflow') {
                        $scope.contactFileList = response.data.data
                    }
                } else {
                    window.alert(response.message);
                }
            })
        }

        // 获取已审批文件
        $scope.getNodeFileList = function (id) {
            let params = {
                processInstanceId: id
            }
            $http.post("/ovu-park/backstage/flow/nodeFileList", params, fac.postConfig).success(function (response) {
                console.log(response);
                if (response.code == 0) {
                    $scope.nodeFileList = response.data;
                } else {
                    window.alert(response.message);
                }
            })
        }

        $scope.getSettledForm();
        $scope.getComments();
        $scope.getAttachmentList();
        if ($scope.curProcess.procDefKey === 'settled_workflow' || $scope.curProcess.procDefKey === 'decorate_workflow') {
            $scope.getNodeFileList($scope.curProcess.processInstanceId);
        }
        // 退租审批押金情况
        $scope.depositeChange = function (type, value) {
            if (type == 1) {
                if (value == 2) {
                    $scope.search.depositMoney = '';
                }
            }
            if (type == 2) {
                if (value == 2) {
                    $scope.search.depositFreeDesc = '';
                }
            }
        }
        // 附件下载
        $scope.enclosureDownload = function (url, name) {
            window.open(url);
        }
        // 上传文件
        $scope.contactFileList = [];
        $scope.houseAcceptList = [];
        $scope.rentalFileList = [];
        var accepts = ['.doc', '.docx', '.pdf', '.xls', '.xlsx'];
        $scope.uploadFile = function (type) {
            if ($scope.curProcess.taskDefKey != 'c' && $scope.curProcess.procDefKey === 'out_rental_workflow') {
                return;
            }
            if (type === 1) {
                $rootScope.addLimitFilesWorkPortal($scope.contactFileList, 'url', 'attachmentName', accepts, 100);
            } else if (type === 2) {
                $rootScope.addLimitFilesWorkPortal($scope.houseAcceptList, 'url', 'attachmentName', accepts, 100);
            } else if (type === 3) {
                $rootScope.addLimitFilesWorkPortal($scope.rentalFileList, 'url', 'attachmentName', accepts, 1);
            }

        }
        // 删除文件
        $scope.delContactFile = function (type, index) {
            if ($scope.curProcess.taskDefKey != 'c' && $scope.curProcess.procDefKey === 'out_rental_workflow') {
                return;
            }
            if (type === 1) {
                $scope.contactFileList.splice(index, 1);
            } else if (type === 2) {
                $scope.houseAcceptList.splice(index, 1);
            } else if (type === 3) {
                $scope.rentalFileList.splice(index, 1);
            }
        }

        // 场地预定实际租赁时间控制
        $scope.timeControl = false;
        $scope.timeChange = function (startTime, endTime) {
            if (!startTime || !endTime) {
                return;
            }
            if (startTime != endTime) {
                $scope.timeControl = true;
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        title: '提示',
                        content: '当选择跨天日期后,不能再选择时间!',
                        shade: [0.8, '#393D49'],
                        btn: ['确认'],
                        yes: function (index, layero) {
                            $scope.search.endTime = '';
                            $scope.search.startTime = '';
                            $scope.$apply();
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                });
            } else {
                $scope.timeControl = false;
            }
        }

        // 选择小时
        $scope.hourChange = function (startTime, endTime, type) {
            if (!startTime || !endTime) {
                return;
            }
            if (startTime >= endTime) {
                window.alert("开始时间不能大于结束时间!");
                if (type == 1) {
                    $scope.search.startTime = '';
                }
                if (type == 2) {
                    $scope.search.endTime = '';
                }
            }
        }

        // 实际租赁费用
        $scope.moneyChange = function (money) {
            if (!money && money != 0) {
                return;
            }
            let curValue = money;
            if (!(/^\d+(\.\d+)?$/.test(curValue))) {
                window.alert("实际租赁费用不能为负值!");
                $scope.search.realMoney = '';
                return;
            }
            curValue = curValue.toFixed(2);
            curValue = Number(curValue);
            $scope.search.realMoney = curValue;
        }
        // 销售合同中按揭银行处理
        $scope.getBankName = function(dicVal,list) {
            let name = '--';
            list && list.forEach((v,i)=> {
                if(v.dicVal === dicVal) {
                    name = v.dicItem
                }
            })
            return name;
        }

        //批准
        $scope.save = function (form, item) {
            if ($scope.curProcess.taskDefKey == 'a' && $scope.curProcess.procDefKey === 'out_rental_workflow') {
                if (!$scope.search.rentType) {
                    window.alert("请选择租金情况!");
                    return;
                }
                if (!$scope.search.rentDesc) {
                    window.alert("请填写租金情况说明!");
                    return;
                }
                if (!$scope.search.depositType) {
                    window.alert("请选择押金情况!");
                    return;
                }
                if ($scope.search.depositType == 1 && !$scope.search.depositMoney) {
                    window.alert("请填写押金金额!");
                    return;
                }
                if (!$scope.search.depositFreeType) {
                    window.alert("请选择押金抵扣情况!");
                    return;
                }
                if ($scope.search.depositFreeType == 1 && !$scope.search.depositFreeDesc) {
                    window.alert("请填写押金抵扣情况说明!");
                    return;
                }
            }
            if ($scope.curProcess.taskDefKey == 'c' && $scope.curProcess.procDefKey === 'out_rental_workflow') {
                if (!$scope.search.houseAcceptanceDesc) {
                    window.alert("请填写房屋验收情况!");
                    return;
                }
                if ($scope.contactFileList.length == 0) {
                    window.alert("请上传客户签确认单!");
                    return;
                }
            }
            if ($scope.curProcess.taskDefKey == 'a' && ($scope.curProcess.procDefKey === 'yard_reserve_workflow' || $scope.curProcess.procDefKey === 'ad_reserve_workflow')) {
                if (!$scope.search.realStartTime) {
                    window.alert("请选择实际租赁开始日期!");
                    return;
                }
                if ($scope.curProcess.procDefKey === 'yard_reserve_workflow') {

                    if (!$scope.search.realEndTime) {
                        window.alert("请选择实际租赁结束日期!");
                        return;
                    }
                    if ($scope.search.realStartTime == $scope.search.realEndTime) {
                        if (!$scope.search.startTime) {
                            window.alert("请选择实际租赁开始时间!");
                            return;
                        }
                        if (!$scope.search.endTime) {
                            window.alert("请选择实际租赁结束时间!");
                            return;
                        }
                    }
                    if (!$scope.search.useDesc) {
                        window.alert("请填写会场使用描述!");
                        return;
                    }
                }
                if (!$scope.search.realMoney && $scope.search.realMoney != 0) {
                    window.alert("请填写实际租赁费用!");
                    return;
                }
                if ($scope.search.realMoney == 0) {
                    window.alert("实际租赁费用不能为0!");
                    return;
                }
                if ($scope.curProcess.procDefKey === 'ad_reserve_workflow') {
                    $scope.processForm.formData.advertisement.reducedPrice = $scope.search.realMoney;
                    if (!$scope.search.realCycle) {
                        window.alert("请填写实际租赁周期!");
                        return;
                    }
                    if (!$scope.search.useDesc) {
                        window.alert("请填写广告位使用描述!");
                        return;
                    }
                }
            }
            if (!$scope.search.comment) {
                window.alert("请填写签字意见!");
                return;
            }
            let array = $scope.contactFileList.concat($scope.houseAcceptList, $scope.rentalFileList);
            array.forEach((value, index) => {
                value.businessKey = $scope.curProcess.serviceNo;
                value.userId = $rootScope.user.personId;
                value.taskId = $scope.curProcess.taskId;
                value.attachmentName = value.attachmentName.substring(0, value.attachmentName.indexOf("."));
            })
            $.extend($scope.search, {
                list: array,
                processInstanceId: $scope.curProcess.processInstanceId,
                taskId: $scope.curProcess.taskId,
                userId: $rootScope.user.personId
            })
            if ($scope.search.realStartTime == $scope.search.realEndTime) {
                if ($scope.search.startTime) {
                    $scope.search.realStartTime = $scope.search.realStartTime + " " + $scope.search.startTime;
                    delete $scope.search.startTime;
                }
                if ($scope.search.endTime) {
                    $scope.search.realEndTime = $scope.search.realEndTime + " " + $scope.search.endTime;
                    delete $scope.search.endTime;
                }
            }
            let url = '/ovu-park/backstage/flow/completeTask';
            if ($scope.curProcess.procDefKey === 'out_rental_workflow') {
                url = '/ovu-park/backstage/flow/outrental/completeUserTask';
            } else if ($scope.curProcess.procDefKey === 'yard_reserve_workflow' || $scope.curProcess.procDefKey === 'ad_reserve_workflow') {
                $.extend($scope.processForm.formData, {
                    realStartTime: $scope.search.realStartTime,
                    realEndTime: $scope.search.realEndTime,
                    realCycle: $scope.search.realCycle,
                    realMoney: $scope.search.realMoney,
                    useDesc: $scope.search.useDesc
                })
                $scope.search.formData = angular.copy($scope.processForm.formData);
                // $scope.search.serviceNo = $scope.curProcess.serviceNo;
                url = '/ovu-park/backstage/flow/common/completeUserTask';
            } else if ($scope.curProcess.procDefKey === 'house_rental_workflow') {
                let rentParams =  {
                    processInstanceId: $scope.curProcess.processInstanceId,
                    approveOpinion: $scope.search.comment
                }
                $scope.search.formData = rentParams;
                url = '/ovu-park/backstage/flow/common/completeUserTask';
            }
            $scope.search.serviceNo = $scope.curProcess.serviceNo;
            $scope.search.isCoverFile = true;
            var loading = layer.load(2, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            $http.post(url, $scope.search, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            }).success(function (response) {
                layer.close(loading);
                if (response.code === 0) {
                    window.msg(response.message);
                    $uibModalInstance.close();
                } else {
                    window.alert(response.message);
                }
            })
        }
        // 关闭
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        // 退回
        $scope.back = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.approvalReturn.html',
                controller: "approvalReturnCtrl",
                resolve: {
                    items: function () {
                        return $scope.curProcess;
                    },
                    formData:function () {
                        return angular.extend({},$scope.search)
                    }
                }
            });
            modal.result.then(function (data) {
                $uibModalInstance.close();
            }, function () {
                console.info('Modal dismissed at: ' + new Date())
            })
        };

        // 获取上一级的审批文件列表
        function getAlreadyFile(item) {
            if (item.length === 0) {
                return;
            }
            let array = angular.copy(item);
            array.forEach((value, index) => {
                value.file = upperFile(value.taskId);
                console.log(value.file)
            })
            return array;
        }

        // 通过businessKey和userId查找附件
        function upperFile(id) {
            if ($scope.attachmentlist.length === 0) {
                return [];
            }
            let array = [];
            $scope.attachmentlist.forEach((value, index) => {
                if (value.taskId === id) {
                    array.push(value);
                }
            })
            return array;
        }
    });
    // 退回弹出框控制器
    app.controller("approvalReturnCtrl", function ($scope, $rootScope, $uibModalInstance, $http, items,formData) {
        console.log($rootScope.user)
        $scope.curItem = items;
        $scope.formData = formData;
        // 状态值
        $scope.search = {
            chooseNode: {},
            common: ''
        }
        $scope.nodeList = [];
        // 加载节点下拉框
        $scope.find = function () {
            $http.get("/ovu-workflow/act/actNode/getBeforeUserTask?processInstanceId=" + $scope.curItem.processInstanceId + "&executionId=" + $scope.curItem.executionId + "&curNodeId=" + $scope.curItem.taskDefKey).success(function (data) {
                if (data.code == 0) {
                    $scope.nodeList = data.data;
                }
            })
        }
        $scope.find();
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项");
                return;
            }
            
            let url = '/ovu-park/backstage/flow/taskBack';
            if ($scope.curItem.procDefKey === 'house_rental_workflow') {
                url = '/ovu-park/backstage/flow/rental/taskBack'
            }else if($scope.curItem.procDefKey === 'rental_relief_workflow'){
                url='/ovu-park/backstage/flow/rentRelief/taskBack'
            } else if($scope.curItem.procDefKey === 'sale_contract_workflow') {
                url = '/ovu-park/backstage/flow/saleContact/taskBack'
            }
            let params = {
                processInstanceId: $scope.curItem.processInstanceId,
                taskId: $scope.curItem.taskId,
                curTaskDefinitionKey: $scope.curItem.taskDefKey,
                targetTaskDefinitionKey: $scope.search.chooseNode.nodeId,
                userId: $rootScope.user.personId, // $scope.search.chooseNode.assignee
                comment: $scope.search.common,
                serviceNo: $scope.curItem.serviceNo
            }
            if($scope.curItem.procDefKey === 'sale_contract_workflow') {
                params.formData = $scope.formData;
            }
            $http.post(url, params, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            }).success(function (data) {
                if (data.code === 0) {
                    $uibModalInstance.close();
                } else {
                    window.alert(data.message);
                }

            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })

    // 查看流程图弹出框控制器
    app.controller("flowChartCtrl", function ($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        console.log($scope.curItem)
        $scope.time = (new Date()).getTime();
        $scope.save = function () {
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 查看流程记录弹出框控制器
    app.controller("contractProcessRecordCtrl", function ($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        // 存储当前环节
        // 加载页面环节的列表信息
        $scope.pageModel = {}
        $scope.recordFind = function () {
            $http.get("/ovu-workflow/act/comment/getComments?processInstanceId=" + $scope.curItem.processInstanceId).success(function (data) {
                console.log(data);
                if (data.code == 0) {
                    $scope.pageModel = data.data;
                }
            })
        }
        $scope.recordFind();
        $scope.save = function () {
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 租期详细设置
    app.controller('workflowLeaseDetailCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac, $location, item, leaseMsg) {
        $scope.startTimes = [];
        $scope.endTimes = [];
        $scope.approachTimes = [];
        $scope.totalTimes = [];
        $scope.rentalList = item;
        $scope.leaseMsg = leaseMsg;

        $scope.rentalList.forEach((v, i) => {
            $scope.startTimes[i] = v.leaseStart;
            $scope.endTimes[i] = v.leaseEnd;
            $scope.approachTimes[i] = v.enterDate;
            $scope.totalTimes[i] = getTotalMonths($scope.startTimes[i], $scope.endTimes[i])
        });

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
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
    });
    // 查看租金详情
    app.controller('lookShowDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $location, $filter, fac, item) {
        $scope.unitStatus = [{
            name: '元/日/㎡',
            id: 1
        }, {
            name: '元/月/㎡',
            id: 2
        }, {
            name: '元/季度/㎡',
            id: 3
        }, {
            name: '元/半年/㎡',
            id: 4
        }, {
            name: '元/年/㎡',
            id: 5
        }];
        $scope.detailData = item.data;
        $scope.houseList = JSON.parse($scope.detailData.houseList);
        $scope.save = function (form) {
            $uibModalInstance.close()
        };
        $scope.cancel = function (params) {
            $uibModalInstance.dismiss('cancel');
        };
    })
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
    // 工作流程状态
    app.filter("workStatus", function () {
        return function (state) {
            if (state == 0) {
                return '待审批';
            } else if (state == 1) {
                return '已审核';
            } else if (state == 2) {
                return '已完成';
            }
        }
    })
    app.filter("usertype", function () {
        return function (state) {
            if (state == 1) {
                return '个人';
            } else if (state == 2) {
                return '企业';
            } else if (state == 3) {
                return '员工';
            }
        }
    })
    app.filter("getCountPeople", function () {
        return function (state) {
            if (state == 1) {
                return '100人以内';
            } else if (state == 2) {
                return '100人以上';
            } else {
                return '--'
            }
        }
    })

    // 格式化文件名
    app.filter("gshFileName", function () {
        return function (name) {
            let index = name.indexOf(".");
            if (index == -1) {
                return name;
            }
            let gshName = name.substring(0, index);
            return gshName;
        }
    })

    // 预定广告类型
    app.filter("getAdType", function () {
        return function (state) {
            if (state == 0) {
                return '不限';
            } else if (state == 1) {
                return '电梯广告';
            } else if (state == 2) {
                return '宣传栏广告';
            } else if (state == 3) {
                return '道闸广告';
            } else if (state == 4) {
                return '路灯广告';
            } else if (state == 5) {
                return '墙面广告';
            } else {
                return ''
            }
        }
    })
})()
