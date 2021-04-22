(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("contractAlreadyApprovalCtrl", function($scope, $rootScope, $http, $uibModal, $filter, fac) {
        // 页面状态值
        $scope.search = {
            isShow: true,
            beginDate: '',
            endDate: '',
            currentProcess: '',
            approvalState: 'alreadyApproval'
        };
        // 存储列表信息
        $scope.pageModel = {};
        // 存储详情列表信息
        $scope.detailPageModel = {};
        // 存储详情列表的流转信息列表
        $scope.circulationPageModel = {};
        // 页面加载
        $scope.init = function() {
            $scope.find();
        }
        // 获取合同信息列表
        $scope.find = function(pageNo) { // settled_workflow decorate_workflow out_rental_workflow
            $.extend($scope.pageModel, {userId: app.user.personId, processDefinitionKey: 'out_rental_workflow'});
            $http.get("/ovu-workflow/act/task/historicList", {params: $scope.pageModel}).success(function(data) {
                if(data.code == 200) {
                    $scope.pageModel = data.data;
                } else {
                    $scope.pageModel = [];
                }
            })
        }
        // 调用加载页面的函数
        $scope.init();
        // 查看流程图
        $scope.showFlowChart = function(data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/workflowManage/workflowModal/modal.flowChart.html",
                controller: "flowChartCtrl",
                resolve: {
                    items: function() {
                        return data;
                    }
                }
            });
            modal.result.then(function() {

            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 点击查看流程记录
        $scope.contractProcessRecord = function(data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/workflowManage/workflowModal/modal.contractProcessRecord.html",
                controller: "contractProcessRecordCtrl",
                resolve: {
                    items: function() {
                        return data;
                    }
                }
            });
            modal.result.then(function() {

            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 标题展示
        $scope.contractShow = function(data) {
            // 当前流程的信息
            $scope.search.currentProcess = data;
            if (data.status === 'finish') {
                $http.get("/ovu-workflow/act/button/hasRecall?processInstanceId="+data.processInstanceId+"&curNodeId="+data.taskDefKey).success(function (data) {
                    console.log(data);
                    if (data.code == 200) {
                        $.extend($scope.search.currentProcess, {hasButton: data.data});
                    }
                })
            }
            $scope.search.isShow = false;
            $http.get("/ovu-workflow/act/contract/listById?uuid="+data.businessKey).success(function(data) {
                if(data.code == 200) {
                    $scope.detailPageModel = data.data;
                }
            })
            $http.get("/ovu-workflow/act/comment/getComments?processInstanceId="+data.processInstanceId).success(function(data) {
                if(data.code == 0) {
                    $scope.circulationPageModel =data.data;
                }
            })
        }
        // 撤回
        $scope.alreadyApprovalReturn = function () {
            var param = {
                processInstanceId: $scope.search.currentProcess.processInstanceId,
                curTaskId:  $scope.search.currentProcess.taskId,
                curTaskDefinitionKey: $scope.search.currentProcess.taskDefKey,
                userId: app.user.personId
            }
            $http.get("/ovu-workflow/act/task/recallBack", {params: param}).success(function (data) {
                if (data.code == 200) {
                    msg(data.message);
                    $scope.search.isShow = true;
                    $scope.find();
                }
            })
        }
    })
    // 查看流程图弹出框控制器
    app.controller("flowChartCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        console.log($scope.curItem)
        $scope.time = (new Date()).getTime();
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 查看流程记录弹出框控制器
    app.controller("contractProcessRecordCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        // 存储当前环节
        // 加载页面环节的列表信息
        $scope.pageModel = {}
        $scope.recordFind = function() {
            $http.get("/ovu-workflow/act/comment/getComments?processInstanceId="+$scope.curItem.processInstanceId).success(function(data) {
                console.log(data);
                if(data.code == 0) {
                    $scope.pageModel = data.data;
                }
            })
        }
        $scope.recordFind();
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()