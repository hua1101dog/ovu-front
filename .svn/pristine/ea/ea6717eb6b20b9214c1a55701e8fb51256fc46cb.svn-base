(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("contractCompletedCtrl", function($scope, $rootScope, $http, $uibModal, $filter, fac) {
        // 页面状态值
        $scope.search = {
            isShow: true,
            beginDate: '',
            endDate: '',
            currentProcess: '',
            approvalState: 'completedApproval'
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
            $.extend($scope.pageModel, {curPage: pageNo || 1, numPage: $scope.pageModel.pageSize || 10, userId: app.user.personId, processDefinitionKey: 'out_rental_workflow'});
            $http.get("/ovu-workflow/act/task/historicCompleteList", {params: $scope.pageModel}).success(function(data) {
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
        // 详情列表的提交流程
        $scope.detailSubmitProcess = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/workflowManage/workflowModal/modal.contractSubmitProcess.html",
                controller: "contractCompleteSubmitProcessCtrl",
                resolve: {
                    items: function() {
                        return $scope.search.currentProcess;
                    }
                }
            });
            modal.result.then(function(data) {
                if(data.code == 200) {
                    msg(data.message);
                    $scope.search.isShow = true;
                    window.location.href = "/view/main.html?module=2#/workflowManage/contractAlreadyApproval";
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 详细列表的签收流程
        $scope.approvalSigning = function() {
            console.log($scope.search.currentProcess)
            $http.get("/ovu-workflow/act/controller/claim?taskId="+$scope.search.currentProcess.taskId+"&userId="+app.user.personId).success(function(data) {
                console.log(data)
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
    // 详情列表的提交流程弹出框控制器
    app.controller("contractCompleteSubmitProcessCtrl", function($scope, $uibModalInstance, $http, $filter, fac, items) {
        // 当前流程的信息
        $scope.curProcess = items;
        // 页面状态值
        $scope.search = {
            isChoose: false,
            comment: ''
        }
        // 存储节点信息
        $scope.nodesList = {};
        // 存储人员信息
        $scope.peopleList = {};
        // 加载页面
        $scope.find = function() {
            $http.get("/ovu-workflow/act/controller/getNextTaskInfo?processInstanceId="+$scope.curProcess.procInsId).success(function(data) {
                if(data.code == 200) {
                    $scope.nodesList = data.data;
                    $http.get("/ovu-workflow/act/controller/nodes?processDefinitionId="+$scope.curProcess.procDefId+"&nodeId="+data.data.nodeId).success(function(resp) {
                        if(resp.code == 200) {
                            $scope.peopleList = resp.data;
                            $scope.peopleList.userId = JSON.parse($scope.peopleList.userId);
                            $scope.peopleList.userId.forEach(function(item) {
                                item.checked = false;
                            })
                        }
                    })
                }
            })
            
        }
        $scope.find();
        $scope.save = function() {
            // 判断是否选择了人员
            $scope.search.isChoose = $scope.peopleList.userId.some(function(item) {
                if(item.checked) {
                    return item;
                } 
            })
            if($scope.search.isChoose) {
                var userIds= [];
                $scope.peopleList.userId.forEach(function(item) {
                    if(item.checked) {
                        userIds.push(item.id);
                    }
                })
                $http.get("/ovu-workflow/act/controller/complete?taskId="+$scope.curProcess.taskId+"&procInsId="+$scope.curProcess.procInsId+"&userIds="+userIds.join(",")+"&comment="+$scope.search.comment).success(function(data) {
                    $uibModalInstance.close(data);
                })
            }
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()