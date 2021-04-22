(function() {
    "use strict";
    var app = angular.module("angularApp");
    // 流程管理的控制器
    app.controller("processManageCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log) {
        $scope.moduleId = window.location.search.substr(window.location.search.indexOf("=")+1);
        // 流程管理功能的状态值
        $scope.processStatus = {
            isShow: false,
            isShowVersion: false,
            currentPage: '',
            versionCurrentPage: ''
        }
        $scope.search = {
            projectKey: ''
        };
        $scope.detailSearch = {
            processDefinitionKey: ''    //  存储展示版本详情的当前流程key值
        };
        $scope.pageModel = {};
        $scope.categeoryList = [];
        // 存储展示版本详情的当前流程key值
        // 页面加载
        $scope.processInit = function() {
            $scope.search.projectKey = $rootScope.auth.projectKey;
            if($rootScope.auth.role == 'admin') {
                $scope.search.projectKey = '';
                $scope.processStatus.isShow = true;
                $scope.getCateList();
            }
            // 判断是刷新流程分类列表还是版本详情列表
            if($scope.processStatus.isShowVersion) {
                $scope.versionFind($scope.processStatus.versionCurrentPage)
            } else {
                $scope.find($scope.processStatus.currentPage);
            }
        }
        // 当登陆用户的role为"admin"时获取下拉分类列表
        $scope.getCateList = function() {
            $http.get("/ovu-workflow/auth/authorizes/"+ $scope.search.projectKey).success(function(data) {
                if(data.code == 200) {
                    $scope.categeoryList = data.data;
                }
            })
        }
        // 切换园区时查询列表
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                console.log(app.park);
                if ($scope.processStatus.isShowVersion) {
                    $scope.processStatus.isShowVersion = false;
                }
                $scope.find(1);
            })
        });
        // 获取流程分类列表
        $scope.find = function(pageNo) {
            if(!$scope.search.projectKey) {
                $scope.search.projectKey = '';
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.parkId = app.park.parkId;
            fac.getPageResult("/ovu-workflow/act/process/processList/"+$scope.search.projectKey,$scope.search, function(data) {
                $scope.pageModel = data;
                $scope.processStatus.currentPage = $scope.pageModel.pageNo;
                $scope.pageModel.totalRecord = $scope.pageModel.count;
                $scope.pageModel.currentPage = $scope.pageModel.pageNo;
            })
        };
        // 请求获取权限
        $scope.obtainValidation = function (key) {
            $http.get("/ovu-workflow/auth/"+key).success(function(data) {
                if (data.code == 200) {
                    $rootScope.auth = data.data.auth;
                    $scope.processInit();
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
        
        // 删除功能,包阔分类列表和版本详情列表的删除功能
        $scope.processCancel = function(data, key) {
            var item = {
                data: data,
                key: key
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/workflowManage/workflowModal/modal.cancel.html',
                controller: 'processCancelCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.data.code == 200) {
                    msg("删除成功");
                } else if(data.data.code == 500) {
                    alert("删除失败")
                }
                $scope.processInit();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 激活挂起功能
        $scope.processActivation = function(id, state, key) {
            let msg;
            if(state == 'active') {
                state = 'suspend';
                msg = "目前流程处于激活状态,确认关闭吗";
            } else if(state == 'suspend') {
                state = 'active';
                msg = "目前流程处于挂起状态,确认激活吗";
            }
            layer.confirm(msg, function (index) {
                $http.put("/ovu-workflow/act/process/"+id+"/"+state).success(function(data) {
                    if(data.code == 200) {
                        $scope.processInit();
                        layer.close(index);
                        msg(data.message.substring(0, data.message.indexOf("I")));
                    }
                })
            })
        }
        // 点击查看流程图片
        $scope.processShowPic = function(id) {
            var item = {id: id}
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.processShowPic.html',
                controller: 'processShowPicCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 获取版本详情列表
        $scope.versionFind = function(pageNo) {
            $.extend($scope.detailSearch, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.detailSearch.pageIndex = $scope.detailSearch.currentPage - 1;
            // 根据key获取所有的版本信息
            fac.getPageResult("/ovu-workflow/act/process/version",$scope.detailSearch, function(data) {
                $scope.pageModel = data;
                $scope.processStatus.versionCurrentPage = $scope.pageModel.pageNo;
                $scope.pageModel.totalRecord = $scope.pageModel.count;
                $scope.pageModel.currentPage = $scope.pageModel.pageNo;
            })
        }
        // 版本的详情列表展示
        $scope.showVersion = function(key) {
            // 版本详情页默认展示第一页
            $scope.processStatus.versionCurrentPage = 1;
            $scope.processStatus.isShowVersion = true;
            $scope.detailSearch.processDefinitionKey = key;
            $scope.processInit(); 
        }
        // 版本详情列表操作项的编辑功能
        $scope.versionEdit = function(id, key) {
            var item = {
                id: id,
                key: key
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workflowManage/workflowModal/modal.processVersionEdit.html',
                controller: 'versionEditCtrl', 
                resolve: {
                    items: function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (data) {
                if(data.code == 200) {
                    msg(data.message)
                } else if(data.code == 500) {
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
            
        }
    })

    // 流程管理删除确认弹出框控制器
    app.controller("processCancelCtrl",  function($scope, $uibModalInstance, $http, items) {
        $scope.cancelMsg = items;
        $scope.save = function() {
            $http.delete("/ovu-workflow/act/process/"+$scope.cancelMsg.data.deploymentId+"?processDefinitionId="+ $scope.cancelMsg.data.id).success(function(data) {
                $uibModalInstance.close({
                    data: data,
                    key: $scope.cancelMsg.key
                });
            })
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 流程管理图片展示弹出框控制器
    app.controller("processShowPicCtrl", function($scope, $uibModalInstance, $http, items) {
        $scope.processPic = items;
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
    // 流程管理版本详情列表的编辑弹出框控制器
    app.controller("versionEditCtrl",  function($scope, $rootScope, $uibModal, $uibModalInstance, $http, fac, items) {
        $scope.versionImage = items;
        // 存储请求的列表数据
        $scope.versionMsg = [];
        // 存储选择后变化的数据
        $scope.changeChoose = [];
        $scope.deptTree=fac.getGlobalTree();
        // 加载页面
        $scope.versionEditFind = function(data) {
            $http.get("/ovu-workflow/act/node/listsNode?processDefineId="+$scope.versionImage.id).success(function(data) {
                // 遍历,转换每一项的userId
                data.forEach(function(item) {
                    item.userId = JSON.parse(item.userId);
                })
                $scope.versionMsg = data;
            })
        }
        $scope.versionEditFind();
        // 人员选择器
        $scope.choosePerson =function(data) {
            var list = fac.treeToFlat($scope.deptTree);
            let deptTree = filterDeptTree(list, app.park)
            // 存储当前操作的节点信息
            var curChooseItem = data;
            // 储存已显示的人员信息
            var curChooseUser = [];
            if(curChooseItem.userId) {
                curChooseUser=curChooseItem.userId;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.mutiDeptPerson.html',
                controller: 'workflowMutiDeptPersonSelectorCtrl',
                resolve: {
                    data: function() {
                        return $.extend(true,[],curChooseUser);
                    },
                    deptTree:function(){return $.extend(true,[],deptTree)}
                }
            });
            modal.result.then(function (data) {
                $scope.versionMsg.map(function(item) {
                    if(item.id == curChooseItem.id) {
                        item.userId = data.personsSelected;
                    }
                    return item;
                })
                for(var i = 0; i < $scope.changeChoose.length; i++) {
                    if($scope.changeChoose[i].id === curChooseItem.id) {
                        $scope.changeChoose[i].userId = JSON.stringify(data.personsSelected);
                        return;
                    }
                }
                $scope.changeChoose.push({id: curChooseItem.id, userId: JSON.stringify(data.personsSelected)});
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 保存人员信息
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
                $http.put("/ovu-workflow/act/node/saveNodeUsers", JSON.stringify($scope.changeChoose)).success(function(data) {
                    if(data.code == 200) {
                        msg("保存成功");
                    } else if(data.code == 500) {
                        alert("此次未改变数据");
                    }
                })
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }
        // 取消
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
        // 重写
        $scope.reWrite = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'sm',
                templateUrl: '/view/workflowManage/workflowModal/modal.cancel.html',
                controller: 'processReWriteCtrl', 
                resolve: {}
            });
            modal.result.then(function() {
                $http.get("/ovu-workflow/act/node/reloadNodeUser?processDefineId="+$scope.versionImage.id).success(function(data) {
                    if(data.code == 200) {
                        $scope.versionMsg = data.data;
                        msg(data.message);
                    }
                })
            }, function() {
                console.info('Modal dismissed at: ' + new Date())
            })
        }

        // 筛选部门数
        function filterDeptTree(tree, target) {
            let dept = [];
            tree.forEach((value,index) => {
                if (value.id == target.id) {
                    dept.push(value);
                }
            })
            return dept;
        }
    })
    //人员选择器（多部门多人）
    //by ghostsf
    app.controller('workflowMutiDeptPersonSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $q, fac, deptTree, data) {
        $scope.pageModel = {};
        $scope.personsSelected = [];
        // 用作复写功能
        if(data) {
            $scope.personsSelected = data;
        }
        
        $scope.currDeptName = ''; //当前节点部门
        $scope.search = {};

        $scope.deptTree = deptTree;

        /**
         * 判断人员是否在已选人员列表中
         */
        function isInArray(arr, value) {
            //debugger;
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.id === value.id) {
                    f = i;
                }
            });
            return f;
        }

        /**
         * 分页查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            var deferred = $q.defer();

            var curDept = fac.getSelectedNode($scope.deptTree);
            if(curDept){
                $scope.search.authDeptId = curDept.id;
            }else if($rootScope.dept){
                $scope.search.authDeptId = $rootScope.dept.id;
            }else{
                alert("请选择部门！");
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function (data) {
                deferred.resolve(data);
                $scope.pageModel = data;
                $scope.pageModel.list.map(function (n) {
                    n.checked = isInArray($scope.personsSelected, n) !== -1;
                    return n;
                });
            });
            return deferred.promise;
        };
        $scope.find(1);

        /**
         * 查询全部并全部加入选择
         * type 0选中 1取消选择
         */
        $scope.findAll = function (type) {
            if (!$scope.search.deptId) {
                alert("未查到关联部门！");
                return;
            }
            var param = angular.extend({}, $scope.search);
            $http.post("/ovu-base/pcos/person/getPersonListByDeptId4All.do", param, fac.postConfig).success(function (data) {
                data = data || [];
                data.forEach(function (n) {
                    var i = isInArray($scope.personsSelected, n);
                    if (type === 0 && i === -1) {
                        var personItem = {
                            id: n.id,
                            name: n.name
                        };
                        $scope.personsSelected.push(personItem);
                    } else if (type === 1 && i !== -1) {
                        $scope.personsSelected.splice(i, 1);
                    }
                });
            });
        };

        /**
        * 选择该部门节点 列出该部门下所有人员
        * @param node
        */
        $scope.setDept = function(node){
            var curDept = fac.getSelectedNode($scope.deptTree);
            if (curDept && curDept != node) {
                curDept.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.find(1).then(function () {
                    $scope.pageModel.list.map(function (n) {
                        n.checked = isInArray($scope.personsSelected, n) !== -1;
                    });
                });
            }
        }
        /**
         * 选中部门下所有人员
         * @param node
         */
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            $scope.search.deptId = node.id;
            $scope.currDeptName = node.text;
            $scope.curNode = node;

            //标记选择部门的状态
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }

            function uncheckFather(node) {
                var father = $scope.flatData.find(function (n) {
                    return n.id === node.parentId
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }

            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }

            //标记选择人员的状态
            if (node.state.checked) {
                $scope.find(1).then(function () {
                    $scope.pageModel.list.map(function (n) {
                        n.checked = true;
                        var i = isInArray($scope.personsSelected, n);
                        if (i === -1) {
                            var personItem = {
                                id: n.id,
                                name: n.name
                            };
                            $scope.personsSelected.push(personItem);
                        }
                        return n;
                    });
                });

                //全部门人员标记选择
                $scope.findAll(0);
            } else {
                delete $scope.curNode;
                $scope.find(1).then(function () {
                    $scope.pageModel.list.map(function (n) {
                        n.checked = false;
                        var i = isInArray($scope.personsSelected, n);
                        if (i !== -1) {
                            $scope.personsSelected.splice(i, 1);
                        }
                        return n;
                    });
                });

                //全部门人员标记选择
                $scope.findAll(1);
            }
        };

        /**
         * 选择人员或者取消选择
         * @param person
         */
        $scope.selectPersonItem = function (person) {
            //标记是否选择
            person.checked = !person.checked;

            //加入选择组
            var i = isInArray($scope.personsSelected, person);
            if (!person.checked && i !== -1) {
                $scope.personsSelected.splice(i, 1);
            } else if (person.checked && i === -1) {
                var personItem = {
                    id: person.id,
                    name: person.name
                };
                $scope.personsSelected.push(personItem);
            }
        };

        /**
         * 删除已选的
         * @param personItem
         */
        $scope.delSelectedPersonItem = function (personItem) {
            var f = -1;
            $scope.personsSelected.forEach(function (p, i) {
                if (p.id === personItem.id) {
                    f = i;
                }
            });
            if (f !== -1) {
                $scope.personsSelected.splice(f, 1);
                $scope.find();
            }
        };

        /**
         * 确定
         */
        $scope.save = function () {
            if ($scope.personsSelected.length === 0) {
                alert("请选择人员！");
            } else {
                $uibModalInstance.close({
                    personsSelected: $scope.personsSelected
                });
            }
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 确认重写弹出框控制器
    app.controller("processReWriteCtrl", function($scope, $uibModalInstance, $http) {
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel =function() {
            $uibModalInstance.dismiss('cancel')
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