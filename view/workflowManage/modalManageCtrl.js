(function() {
    "use strict";
    var app = angular.module("angularApp");
    // 模型管理的控制器
    app.controller("modalManageCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log) {
        $scope.moduleId = window.location.search.substr(window.location.search.indexOf("=")+1);
        // 状态值
        $scope.modalSearch = {
            isShow: false,
            isDeploy: false,
            isCopy: true,    //控制是否可以进行复制操作
            projectKey: '',
            currentPage: ''
        }
        // 存储数据列表信息
        $scope.pageModel = {};
        // 存储分类信息
        $scope.categeoryList = [];
        // 存储当前选择的条目信息
        $scope.curChooseCopy = '';
        // 页面加载
        $scope.modalInit = function() {
            $scope.modalSearch.projectKey = $rootScope.auth.projectKey;
            if($rootScope.auth.role == 'admin') {
                $scope.modalSearch.projectKey = '';
                $scope.modalSearch.isShow = true;
                $scope.getCateList();
            }
            $scope.find($scope.modalSearch.currentPage);
        }
        // 当登陆用户的role为"admin"时获取下拉分类列表
        $scope.getCateList = function() {
            $http.get("/ovu-workflow/auth/authorizes/"+ $scope.modalSearch.projectKey).success(function(data) {
                if(data.code == 200) {
                    $scope.categeoryList = data.data
                }
            })
        }
        // 切换园区时查询列表
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
        // 获取分类列表
        $scope.find = function(pageNo) {
            // 每次查找后模型复制默认不能操作
            $scope.modalSearch.isCopy = true;
            if(!$scope.modalSearch.projectKey) {
                $scope.modalSearch.projectKey = '';
            }
            $.extend($scope.modalSearch, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.modalSearch.pageIndex = $scope.modalSearch.currentPage - 1;
            $scope.modalSearch.parkId=app.park.parkId;
            fac.getPageResult("/ovu-workflow/act/model/modelList/"+$scope.modalSearch.projectKey, $scope.modalSearch, function(data) {
                $scope.pageModel = data;
                $scope.modalSearch.currentPage = $scope.pageModel.pageNo;
                $scope.pageModel.totalRecord = $scope.pageModel.count;
                $scope.pageModel.currentPage = $scope.pageModel.pageNo;
                $scope.pageModel.list.map(function(item) {
                    item.checked = false;
                    return item;
                })
            })
        };
        // 请求获取权限
        $scope.obtainValidation = function(key) {
            $http.get("/ovu-workflow/auth/"+key).success(function(data) {
                if (data.code == 200) {
                    $rootScope.auth = data.data.auth;
                    $scope.modalInit();
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
        
        // 添加新建模型
        $scope.modalManageAdd = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.modalManageAdd.html',
                controller: 'modalAddCtrl', 
                resolve: {
                    items: function() {
                        return $scope.categeoryList;
                    }
                }
            });
            modal.result.then(function () {
                $scope.modalInit();
                msg("添加成功");
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 子系统更改
        $scope.changeSubsystem = function(data) {
            var item = {
                curData: data,
                allData: $scope.categeoryList
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/workflowManage/workflowModal/modal.modalChangeSubsystem.html',
                controller: 'modalChangeSubsystemCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.code == 200) {
                    msg(data.message);
                } else if(data.code == 500) {
                    alert(data.message);
                }
                $scope.modalInit();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 部署功能
        $scope.modalManageEdit = function(id) {
            $http.get("/ovu-workflow/act/model/deloy/"+ id).success(function(data) {
                if(data.code == 200) {
                    $scope.modalInit();
                    msg(data.message.substring(0, data.message.indexOf("，")));
                } else {
                    alert(data.message.substring(0, data.message.indexOf("，")));
                }
            })
        }
        // 删除功能
        $scope.modalManageCancel = function(id) {
            var item = {id: id}
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/workflowManage/workflowModal/modal.cancel.html',
                controller: 'modalCancelCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                msg(data);
                $scope.modalInit();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
            
        }
        // 选择系统点击复制
        $scope.chooseCopy = function(data) {
            $scope.pageModel.list.forEach(function(item) {
                if(data.id != item.id) {
                    item.checked = false;
                }
            })
            $scope.modalSearch.isCopy = data.checked?false:true;
            $scope.curChooseCopy = data; 
        }
        // 模型复制功能
        $scope.modalManageCopy = function() {
            var item = {
                categeoryList: $scope.categeoryList,
                curChooseCopy: $scope.curChooseCopy
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.modalManageCopy.html',
                controller: 'modalCopyCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.modalInit();
                if(data.code == 200) {
                    msg(data.message);
                }
                $scope.modalSearch.isCopy = true;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    })
    // 模型管理新建弹出框控制器
    app.controller("modalAddCtrl", function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, items) {
        // 分类子系统的类别
        $scope.cateList = items;
        $scope.loginAuth = $rootScope.auth;
        $scope.modelParameter = {
            isShow: false,
            test: ''
        }
        // 新建模板填写的表单数据
        $scope.form = {
            name: '',
            key: '',
            description: '',
            role: $scope.loginAuth.role == 'admin'? '': $scope.loginAuth.role
        }
        $scope.save = function() {
            // 确认是否保存
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: "/view/workflowManage/workflowModal/modal.save.html",
                controller: "workflowSaveCtrl",
                resolve: {}
            });
            modal.result.then(function() {
                $scope.form.category = $scope.modelParameter.test || $scope.loginAuth.projectKey;
                $scope.form.parkId = app.park.parkId;
                $http.post("/ovu-workflow/act/model/create", $scope.form, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                }).success(function(data) {
                    $uibModalInstance.close();
                })
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
            
        };
        $scope.cancel = function() {
            // 确认是否取消
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: "/view/workflowManage/workflowModal/modal.close.html",
                controller: "workflowCloseCtrl",
                resolve: {}
            });
            modal.result.then(function() {
                $uibModalInstance.dismiss('cancel')
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
    })
    // 模型管理更改子系统弹出框控制器
    app.controller("modalChangeSubsystemCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.subsystemMsg = items;
        $scope.chooseSubsystem = {};
        $scope.save = function() {
            $http.put("/ovu-workflow/act/model/category/"+$scope.subsystemMsg.curData.id+"/"+$scope.chooseSubsystem.projectKey).success(function(data) {
                $uibModalInstance.close(data);
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 模型管理删除弹出框控制器
    app.controller("modalCancelCtrl", function($scope, $uibModalInstance, $http, items) {
        var id = items.id;
        $scope.save = function() {
            $http.delete("/ovu-workflow/act/model/remove/"+id).success(function(data) {
                var message = data.message.substring(0,data.message.indexOf("，"));
                $uibModalInstance.close(message);
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 模型管理复制弹出框控制器
    app.controller("modalCopyCtrl", function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, items) {
        // 分类子系统的类别
        $scope.cateList = items;
        $scope.loginAuth = $rootScope.auth;
        $scope.modelParameter = {
            isShow: false,
            test: ''
        }
        // 复制模板填写的表单数据
        $scope.form = {
            name: '',
            key: '',
            description: '',
            role: $scope.loginAuth.role == 'admin'? '': $scope.loginAuth.role,
            processId: ''
        }
        $scope.form.category = $scope.modelParameter.test || $scope.loginAuth.projectKey;
        $scope.form.id = $scope.cateList.curChooseCopy.id;
        $scope.save = function() {
            // 确认是否保存
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: "/view/workflowManage/workflowModal/modal.save.html",
                controller: "workflowSaveCtrl",
                resolve: {}
            });
            modal.result.then(function() {
                $scope.form.category = $scope.modelParameter.test || $scope.loginAuth.projectKey;
                $http.get("/ovu-workflow//act/model/repeat", {params: {category: $scope.form.category, processId: $scope.form.processId}}).success(function(data) {
                    if(data.code == 200) {
                        msg(data.message);
                        $scope.form.parkId=app.park.parkId;
                        $http.post("/ovu-workflow/act/model/copy", $scope.form, {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function (data) {
                                return $.param(data);
                            }
                        }).success(function(resp) {
                            $uibModalInstance.close(resp);
                        })
                    }
                })
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        };
        $scope.cancel = function() {
            // 确认是否取消
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: "/view/workflowManage/workflowModal/modal.close.html",
                controller: "workflowCloseCtrl",
                resolve: {}
            });
            modal.result.then(function() {
                $uibModalInstance.dismiss('cancel')
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
    })

    // 确认是否保存控制器
    app.controller("workflowSaveCtrl", function($scope, $uibModalInstance) {
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 确认是否取消控制器
    app.controller("workflowCloseCtrl", function($scope, $uibModalInstance) {
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()