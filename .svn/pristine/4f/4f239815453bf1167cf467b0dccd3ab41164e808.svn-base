(function() {
    "use strict";
    var app = angular.module("angularApp");
    // 运行中的流程的控制器
    app.controller("runProcessManageCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log) {
        $scope.moduleId = window.location.search.substr(window.location.search.indexOf("=")+1);
        // 运行中的状态值
        $scope.runProcessStatus = {
            chooseAuth: ''
        }
        $scope.runProcessSearch = {
            processInstanceId: '',
            processDefinitionKey: ''
        }
        $scope.pageModel = {};
        // 页面加载
        $scope.runProcessInit = function() {
            $scope.find();
        }
        // 切换园区时查询列表
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
        // 获取分类列表
        $scope.find = function(pageNo) {
            $.extend($scope.runProcessSearch, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10})
            if($rootScope.auth.role != 'admin') {
                $.extend($scope.runProcessSearch, {category: $rootScope.auth.projectKey})
            }
            $scope.runProcessSearch.parkId = app.park.parkId;
            fac.getPageResult("/ovu-workflow/act/process/running", $scope.runProcessSearch, function(data) {
                $scope.pageModel = data;
                $scope.pageModel.totalRecord = $scope.pageModel.count;
                $scope.pageModel.currentPage = $scope.pageModel.pageNo;
            })
        };
        // 请求获取权限
        $scope.obtainValidation = function (key) {
            $http.get("/ovu-workflow/auth/"+key).success(function(data) {
                if (data.code == 200) {
                    $rootScope.auth = data.data.auth;
                    $scope.runProcessInit();
                } else {
                    console.log(data.message);
                }
            })
        }
        // 请求获取key
        $scope.getWorkflowKey = function() {
            $http.get("/ovu-workflow/auth/authorizes/moduleId/"+$scope.moduleId).success(function(data) {
                if(data.code == 200) {
                    $scope.obtainValidation(data.data.projectKey);
                }
            })
        }
        $scope.getWorkflowKey();
        
        // 删除功能
        $scope.runProcessCancel = function(data) {
            var item = data;
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/workflowManage/workflowModal/modal.runProcessCancelReason.html',
                controller: 'runProcessCancelCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.code == 200) {
                    msg("删除成功")
                } else if(data.code == 500) {
                    alert("删除失败");
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
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
        // 查看流程记录
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
        // 跳转功能
        $scope.runProcessSkip = function(data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/workflowManage/workflowModal/modal.runProcessSkip.html",
                controller: "runProcessSkipCtrl",
                resolve: {
                    items: function() {
                        return data;
                    }
                }
            });
            modal.result.then(function(data) {
                if(data.code == 200) {
                    $scope.find();
                    msg(message);
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
    })
    // 运行中的流程删除确认弹出框控制器
    app.controller("runProcessCancelCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.curProcessItem = items;
        $scope.cancelReason = '';
        $scope.save = function() {
            $http.delete("/ovu-workflow/act/process/running/"+$scope.curProcessItem.processInstanceId+"?deleteReason="+$scope.cancelReason+"&parkId="+app.park.parkId).success(function(data) {
                $uibModalInstance.close(data);
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
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
    // 跳转弹出框控制器
    app.controller("runProcessSkipCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.curItem = items;
        $scope.search = {
            chooseNode: '',
            isChoose: false,
            isEnd: false,
            userId: ''
        }
        // 储存节点列表
        $scope.nodeList = [];
        // 储存人员列表
        $scope.peopleList = {};
        // 加载
        $scope.find = function() {
            $http.get("/ovu-workflow/act/actNode/getAllUserTask?processDefinitionId="+$scope.curItem.processDefinitionId+"&processInstanceId="+$scope.curItem.processInstanceId).success(function(data) {
                if(data.code == 200) {
                    $scope.nodeList = data.data;
                }
            })
        }
        // 选择节点时的人员信息
        /**
         * nodeType 字段
         * startUser 发起者节点
         * end 结束节点
         * user 普通用户节点
         */
        
        $scope.nodeChange = function() {
            $scope.search.isEnd = false;
            $scope.search.isChoose = false;
            if($scope.search.chooseNode) {
                // 结束节点
                if($scope.search.chooseNode == 'end') {
                    $scope.search.isEnd = true;
                    $scope.search.isChoose = true;
                    return;
                }
                // 发起人节点
                if($scope.search.chooseNode == 'startUser') {
                    $http.get("/ovu-workflow/act/task/getStartUser?processInstanceId="+$scope.curItem.processInstanceId).success(function(data) {
                        if(data.code == 200) {
                            $scope.search.userId = data.data;
                        }
                    })
                    $scope.search.isEnd = true;
                    $scope.search.isChoose = true;
                    return;
                }
                $http.get("/ovu-workflow/act/actNode/nodes?processDefinitionId="+$scope.curItem.processDefinitionId+"&nodeId="+$scope.search.chooseNode).success(function(data) {
                    if(data.code == 200) {
                        $scope.peopleList = data.data;
                        $scope.peopleList.userId = JSON.parse($scope.peopleList.userId);
                        $scope.peopleList.userId.forEach(function(item) {
                            item.checked = false;
                        })
                    }
                })
            }
            
        }
        // 人员选择只能单选
        $scope.choosePeoson = function(data) {
            $scope.peopleList.userId.forEach(function(item) {
                if(data.id != item.id) {
                    item.checked = false;
                }
            })
        }
        $scope.find();
        $scope.save = function() {
            if(!$scope.search.isEnd) {
                $scope.search.isChoose = $scope.peopleList.userId.some(function(item) {
                    if(item.checked) {
                        return item;
                    } 
                })
            }
            if($scope.search.isChoose) {
                var userIds= [];
                if(!$scope.search.isEnd) {
                    $scope.peopleList.userId.forEach(function(item) {
                        if(item.checked) {
                            userIds.push(item.id);
                        }
                    })
                    $scope.search.userId = userIds[0];
                }
                if($scope.curItem.sign){
                    $http.get("/ovu-workflow/act/task/jumpMultiInstanceTask?processInstanceId="+$scope.curItem.processInstanceId+"&parentId="+$scope.curItem.processInstanceId+"&currentNodeId="+$scope.curItem.taskDefKey+"&desNodeId="+$scope.search.chooseNode+"&userId="+$scope.search.userId).success(function(data) {
                        $uibModalInstance.close(data);
                    })
                }else{
                    $http.get("/ovu-workflow/act/task/jumpTask?procInsId="+$scope.curItem.processInstanceId+"&targetTaskDefinitionKey="+$scope.search.chooseNode+"&userId="+$scope.search.userId).success(function(data) {
                        $uibModalInstance.close(data);
                    })
                }
            }
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()