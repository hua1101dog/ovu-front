(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("contractUnapprovedCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac) {
        console.log($rootScope)
        // 当前登陆者的信息:app.user
        // 页面状态值
        $scope.search = {};
        // 合同分类
        $scope.categoryList = [];
        // 存储数据列表信息
        $scope.pageModel = {};
        // 页面加载
        $scope.init = function() {
            $scope.getCategorys();
            $scope.find(); 
        }
        // 获取合同信息列表
        $scope.find = function(pageNo) {
            $.extend($scope.pageModel, {curPage: pageNo || 1, numPage: $scope.pageModel.pageSize || 10, startUser: app.user.personId});
            $http.get("/ovu-workflow/act/contract/lists", {params: $scope.pageModel}).success(function(data) {
                if(data.code == 200) {
                    $scope.pageModel = data.data;
                }
            })
        }
        // 获取合同分类信息
        $scope.getCategorys = function() {
            // 获取合同类别下拉框的列表
            $http.get("/ovu-workflow/act/contract/type").success(function(data) {
                if(data.code == 200) {
                    $scope.categoryList = data.data;
                }
            })
        }
        // 调用加载页面的函数
        $scope.init();
        // 新建合同审批
        $scope.contractAdd = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.contractApprovalAdd.html',
                controller: 'contractApprovalAddCtrl', 
                resolve: {
                    items: function() {
                        return $scope.categoryList;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.code == 200) {
                    $scope.find();
                    msg(data.message);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 发起流程
        $scope.initiateProcess = function(data) {
            var contractType = '';
            switch(data.type) {
                case '环境类合同':
                    contractType = 'environment';
                    break;
                case '工程类合同':
                    contractType = 'work';
                    break;
                case '电梯类合同':
                    contractType = 'elevator';
                    break;
                case '人资类合同':
                    contractType = 'people';
                    break;
            }
            var param = {procDefKey: 'contractFlow', businessKey: data.uuid, title: data.contractName, userId: data.startUser, vars: {type: contractType, deptName: "推广部", money: 20000}}
            var curItem = data;
            $http.get("/ovu-workflow/act/task/start", {params: param}).success(function(data) {
                if(data.code == 200) {
                    $http.put("/ovu-workflow/act/contract/updateState?uuid="+ curItem.uuid, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function (data) {
                            return $.param(data);
                            }
                        }).success(function(data) {
                            $scope.find();
                            msg(data.message);
                    })
                } else if(data.code == 500) {
                    alert(data.data);
                }
            })
        }
    })
    // 合同新建弹出框控制器
    app.controller("contractApprovalAddCtrl", function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, items) {
        // 存储合同分类下拉框数据
        $scope.categoryList = items;
        $scope.contractMsg = {
            contractName: '',
            type: '',
            description: ''
        }
        $scope.save = function() {
            $.extend($scope.contractMsg, {startUser: app.user.personId});
            $http.post("/ovu-workflow/act/contract/save", $scope.contractMsg,{
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).success(function(data) {
                $uibModalInstance.close(data);
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()