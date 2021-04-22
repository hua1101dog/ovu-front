(function() {
    "use strict";
    var app = angular.module("angularApp");
    // 流程子系统的控制器
    app.controller("subsystemManageCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log) {

        $scope.moduleId = window.location.search.substr(window.location.search.indexOf("=")+1);
        $scope.subsystemSearch = {
            isShow: false,
            projectName: '',
            isDel: 0
        }
        $scope.pageModel = [];
        // 所有子系统列表(index页面的所有九宫格名目)
        $scope.subsystemList = [];
        // 流程子系统页加载
        $scope.subsystemInit = function() {
            $scope.subsystemSearch.projectName = $rootScope.auth.projectName;
            if($rootScope.auth.role == 'admin') {
                $scope.subsystemSearch.projectName = '';
                $scope.subsystemSearch.isShow = true;
            }
            $scope.find();
            $scope.getSubsystemList();
        }
        // 发送请求,获取子系统页面的数据,包含查询
        $scope.find = function () {
            $http.get("/ovu-workflow/auth/authorizes/"+$scope.subsystemSearch.projectName).success(function(data) {
                if(data.code == 200) {
                    $scope.pageModel = data;
                } else {
                    console.log(data.message)
                }
            })
        }
        // 获取所有子系统
        $scope.getSubsystemList = function() {
            $http.get("/ovu-base/getUserModule").success(function(data) {
                $scope.subsystemList = data.data;
            })
        }
        // 请求获取权限
        $scope.obtainValidation = function (key) {
            $http.get("/ovu-workflow/auth/"+key).success(function(data) {
                if (data.code == 200) {
                    $rootScope.auth = data.data.auth;
                    $scope.subsystemInit();
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
        // 是否停用的状态改变
        $scope.subsystemChange = function (isDel, id) {
            // 发送请求,数据库记录挂起状态
            $http.put("/ovu-workflow/auth/"+id+"/"+isDel).success(function (data) {
                if(data.code == 200) {
                    msg(data.message);
                } else {
                    alert(data.message);
                }
            })
        }
        // 增加子系统
        $scope.subsystemAdd = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.subsystemAdd.html',
                controller: 'subsystemAddCtrl', 
                resolve: {
                    items: function() {
                        return $scope.subsystemList;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.code==200) {
                    msg(data.message)
                } else if(data.code == 500) {
                    alert(data.message)
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 删除子系统
        $scope.delete = function(id) {
            var item = {id: id}
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/workflowManage/workflowModal/modal.cancel.html',
                controller: 'systemCancelCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.code == 200) {
                    msg(data.message);
                }
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    })
    // 子系统新建弹出框控制器
    app.controller("subsystemAddCtrl", function($rootScope,$scope, $http,$uibModal, $uibModalInstance, $filter, fac, items) {
        $scope.systemList = items;
        $scope.chooseSystem = {};
        $scope.save = function() {
            $http.post("/ovu-workflow/auth/"+$scope.chooseSystem.id+"/"+ encodeURI($scope.chooseSystem.name)).success(function(data) {
                $uibModalInstance.close(data);
            }) 
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 子系统删除确认弹出框控制器
    app.controller("systemCancelCtrl", function($scope, $uibModalInstance, $http, items) {
        var id = items.id;
        $scope.save = function() {
            $http.delete("/ovu-workflow/auth/"+id).success(function(data) {
                $uibModalInstance.close(data);
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()