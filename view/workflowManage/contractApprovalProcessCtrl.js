(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("contractApprovalProcessCtrl", function($scope, $rootScope, $http, $uibModal, $filter, $timeout, fac) {
        // 页面状态值
        $scope.search = {
            isShow: true,  // 是否显示详情页
            beginDate: '',
            endDate: '',
            currentProcess: '',  // 储存当前流程的信息
            isChoose: false,  // 是否选择了人员
            chooseDelegate: {},  // 委派时选择的人员信息
            delegeteComment: '',  // 被委派人的审批意见
            approvalState: 'pendingApproval'
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
        // 获取列表信息
        $scope.find = function(pageNo, callback) {
            $http.get("/ovu-workflow/act/task/todoList", {params: {processDefinitionKey: 'contractFlow', assignee: app.user.personId}}).success(function(data) {
                if(data.code == 200) {
                    $scope.pageModel = data.data;
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
        $scope.contractShow = function(item) {
            // 当前流程的信息
            $scope.search.currentProcess = item;
            if($scope.search.currentProcess.status == 'delegate') {
                $scope.search.currentProcess.comment = $scope.pageModel[0].comment;
            }
            $scope.search.isShow = false;
            console.log($scope.search.currentProcess)
            $http.get("/ovu-workflow/act/contract/listById?uuid="+$scope.search.currentProcess.businessKey).success(function(data) {
                if(data.code == 200) {
                    $scope.detailPageModel = data.data;
                }
            })
            $http.get("/ovu-workflow/act/comment/getComments?processInstanceId="+$scope.search.currentProcess.processInstanceId).success(function(data) {
                if(data.code == 0) {
                    $scope.circulationPageModel =data.data;
                }
            })
        }
        // 详情列表的提交流程功能
        $scope.detailSubmitProcess = function() {
            if($scope.search.currentProcess.status == 'todo') {
                if($scope.search.chooseDelegate.id) {
                    $http.get("/ovu-workflow/act/task/delegateTask?taskId="+$scope.search.currentProcess.taskId+"&userId="+$scope.search.chooseDelegate.id).success(function(data) {
                        if(data.code == 200) {
                            $scope.search.isChoose = false;
                            $scope.search.chooseDelegate = {};
                            // 关闭详情页
                            $scope.search.isShow = true;
                            // 跳转到已审批
                            window.location.href = "/view/main.html?module=2#/workflowManage/contractAlreadyApproval";
                        }
                    })
                    return;
                } 
                if($scope.search.currentProcess.sign) {
                    var status = 'JointlySign';
                    openModal(status);
                    return;
                }
                console.log($scope.search.currentProcess);
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/workflowManage/workflowModal/modal.contractSubmitProcess.html",
                    controller: "contractSubmitProcessCtrl",
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
                        $scope.find();
                    }
                }, function() {
                    console.info('Modal dismissed at: ' + new Date())
                })
            }
            if($scope.search.currentProcess.status == 'delegate') {
                if($scope.search.delegeteComment && $scope.search.delegeteComment.trim()) {
                    $http.get("/ovu-workflow/act/task/resolveTask?taskId="+$scope.search.currentProcess.taskId+"&procInsId="+$scope.search.currentProcess.processInstanceId+"&comment="+$scope.search.delegeteComment).success(function(data) {
                        // 关闭详情页
                        $scope.search.isShow = true;
                        // 跳转到已审批
                        window.location.href = "/view/main.html?module=2#/workflowManage/contractAlreadyApproval";
                    })
                } else {
                    alert("请填写审批意见");
                }
                return;
            }
        }
        // 详细列表的签收功能
        $scope.approvalSigning = function() {
            var curItem = '';
            $http.get("/ovu-workflow/act/task/claim?taskId="+$scope.search.currentProcess.taskId+"&userId="+app.user.personId).success(function(data) {
                if(data.code == 200) {
                    $scope.find();
                    $timeout(function() {
                        $scope.pageModel.forEach(function(item) {
                            if(item.businessId == $scope.search.currentProcess.businessId) {
                                curItem = item;
                            }
                        })
                        console.log(curItem)
                        $scope.contractShow(curItem);
                    }, 100)
                }
            })
        }
        // 详细列表的委派功能
        $scope.detailDelegate = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.mutiDeptPerson.html',
                controller: "mutiDeptPersonSelectorCtrl",
                resolve: {
                    data: {
                        parkId: '',
                        selectedPeople: ""
                    },
                    deptTree:function(){return $.extend(true,[],$scope.deptTree)}
                }
            });
            modal.result.then(function(data) {
                console.log(data);
                if(data.personsSelected.length > 1) {
                    alert("只能选择一个人员");
                    return;
                }
                $scope.search.chooseDelegate = data.personsSelected[0];
                $scope.search.isChoose = true;
                // if(data.code == 200) {
                //     $scope.find();
                //     msg(message);
                // }
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 取消人员
        $scope.detailCancel = function() {
            $scope.search.chooseDelegate = {};
            $scope.search.isChoose = false;
        }
        // 详细列表退回功能
        $scope.approvalReturn = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.approvalReturn.html',
                controller: "approvalReturnCtrl",
                resolve: {
                    items: function() {
                        return $scope.search.currentProcess;
                    }
                }
            });
            modal.result.then(function(data) {
                if(data.code == 200) {
                    msg(data.message);
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 详细列表驳回功能
        $scope.approvalReject = function() {
            var status = 'approvalReject';
            openModal(status);
        }

        // 驳回功能和会签提交功能打开弹出框
        function openModal(data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.approvalReject.html',
                controller: "approvalRejectCtrl",
                resolve: {
                    items: {
                        item: $scope.search.currentProcess,
                        status: data
                    }
                }
            });
            modal.result.then(function(data) {
                if(data.code == 200) {
                    msg(data.message);
                }
                // 关闭详情页
                $scope.search.isShow = true;
                // 跳转到已审批
                window.location.href = "/view/main.html?module=2#/workflowManage/contractAlreadyApproval";
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
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
    app.controller("contractSubmitProcessCtrl", function($scope, $uibModalInstance, $http, $filter, fac, items) {
        // 当前流程的信息
        $scope.curProcess = items;
        // 页面状态值
        $scope.search = {
            isChoose: false,   // 判断是否选择了人员, true表示为选择了人员
            comment: '',
            isEnd: false     // 判断是否为结束节点,true表示为结束节点
        }
        // 存储节点信息
        $scope.nodesList = {};
        // 存储人员信息
        $scope.peopleList = {};
        // 加载页面
        $scope.find = function() {
            $http.get("/ovu-workflow/act/actNode/getNextTaskInfo?processInstanceId="+$scope.curProcess.processInstanceId).success(function(data) {
                if(data.code == 200) {
                    if(data.data[0].nodeId == 'endEvent') {
                        $scope.search.isEnd = true;
                    }
                    $scope.nodesList = data.data[0];
                    $http.get("/ovu-workflow/act/actNode/nodes?processDefinitionId="+$scope.curProcess.processDefinitionId+"&nodeId="+data.data[0].nodeId).success(function(resp) {
                        if(resp.code == 200) {
                            $scope.peopleList = resp.data;
                            // debugger;
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
            // 判断是否为结束节点后再判断是否选择了人员
            if(!$scope.search.isEnd) {
                $scope.search.isChoose = $scope.peopleList.userId.some(function(item) {
                    if(item.checked) {
                        return item;
                    } 
                })
            }
            if($scope.search.isChoose || $scope.search.isEnd) {
                var userIds= [];
                if(!$scope.search.isEnd) {
                    $scope.peopleList.userId.forEach(function(item) {
                        if(item.checked) {
                            userIds.push(item.id);
                        }
                    })
                }
                if($scope.nodesList.sign) {
                    $http.get("/ovu-workflow/act/task/sign?taskId="+$scope.curProcess.taskId+"&processInstanceId="+$scope.curProcess.processInstanceId+"&nodeId="+$scope.nodesList.nodeId+"&userIds="+userIds.join(",")+"&comment="+$scope.search.comment).success(function(data) {
                        $uibModalInstance.close(data);
                    })
                    return;
                }
                $http.get("/ovu-workflow/act/task/complete?taskId="+$scope.curProcess.taskId+"&processInstanceId="+$scope.curProcess.processInstanceId+"&userIds="+userIds.join(",")+"&comment="+$scope.search.comment).success(function(data) {
                    $uibModalInstance.close(data);
                })
            }
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 详细列表的退回弹出框控制器
    app.controller("approvalReturnCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        // 状态值
        $scope.search = {
            chooseNode: {},
            common: ''
        }
        $scope.nodeList = [];
        // 加载节点下拉框
        $scope.find = function() {
            $http.get("/ovu-workflow/act/actNode/getBeforeUserTask?processInstanceId="+$scope.curItem.processInstanceId+"&executionId="+$scope.curItem.executionId+"&curNodeId="+$scope.curItem.taskDefKey).success(function(data) {
                if(data.code == 0) {
                    $scope.nodeList = data.data;
                }
            })
        }
        $scope.find();
        $scope.save = function() {
            $http.get("/ovu-workflow/act/task/taskBack?procInsId="+$scope.curItem.processInstanceId+"&taskId="+$scope.curItem.taskId+"&curTaskDefinitionKey="+$scope.curItem.taskDefKey+"&targetTaskDefinitionKey="+$scope.search.chooseNode.nodeId+"&userId="+$scope.search.chooseNode.assignee+"&comment="+$scope.search.common).success(function(data) {
                $uibModalInstance.close(data);
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 详细列表的驳回/会签提交弹出框控制器
    app.controller("approvalRejectCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        // 状态值
        $scope.search = {
            comment: '',
            startNodeId: ""
        }
        // 获取发起人节点
        $scope.find = function() {
            $http.get("/ovu-workflow/act/task/getStartUser?processInstanceId="+$scope.curItem.item.processInstanceId).success(function(data) {
                console.log(data)
                if(data.code == 200) {
                    $scope.search.startNodeId = data.data;
                }
            })
        }
        $scope.find();
        
        $scope.save = function() {
            if($scope.curItem.status == 'approvalReject') {
                $http.get("/ovu-workflow/act/task/taskBack?procInsId="+$scope.curItem.item.processInstanceId+"&taskId="+$scope.curItem.item.taskId+"&curTaskDefinitionKey="+$scope.curItem.item.taskDefKey+"&targetTaskDefinitionKey=startUser&userId="+$scope.search.startNodeId+"&comment="+$scope.search.comment).success(function(data) {
                    $uibModalInstance.close(data);
                })
            } else if($scope.curItem.status == 'JointlySign') {
                $http.get("/ovu-workflow/act/task/completeSign?taskId="+$scope.curItem.item.taskId+"&processInstanceId="+$scope.curItem.item.processInstanceId+"&comment="+$scope.search.comment).success(function(data) {
                    $uibModalInstance.close(data);
                })
            }
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()