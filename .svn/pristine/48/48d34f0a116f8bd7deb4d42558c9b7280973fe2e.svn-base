/**
 * 知识库管理
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    app.service("manageService", manageService);
    function manageService() {
        this.del = function(item, list) {
            list.splice(list.indexOf(item), 1);
        };

        this.batchDel = function(list) {
            var i = list.length;
            while (i--) {
                var obj = list[i];
                obj.checked && list.splice(list.indexOf(obj), 1);
            }
        };
    }

    app.controller("manageCtrl", manageCtrl);
    function manageCtrl($scope, $rootScope, $uibModal, $state, $http, fac) {
        document.title = "日志管理";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        fac.setDeptDict($rootScope); //查询部门数据
        //一进来要查询现在登录用的级别，主任，主管，员工
        $http
            .get(
                "/ovu-pcos/pcos/worklogs/worklogpermission/selectLevelByPersonId.do"
            )
            .success(function(data) {
                $rootScope.level = data;
            });
        app.modulePromiss.then(function() {
            $scope.deptTree = fac.getGlobalTree();
            if ($scope.deptTree.length) {
                $scope.search.deptId = $scope.deptTree[0].id;
            }
        });
        $scope.setDept = function(search, node) {
            if (node.state.selected) {
                if (fac.isNotEmpty(node.parkId)) {
                    $scope.search.parkId = node.parkId;
                } else {
                    $scope.search.parkId && delete $scope.search.parkId;
                }

                $scope.find(1);
            }
        };
       
        //分页表格
        $scope.find = function(pageNo, ids) {
    
            $scope.search = $scope.search || {};
            var curDept = fac.getSelectedNode($scope.deptTree);
            if (curDept) {
                $scope.search.deptId = curDept.id;
                $scope.search.deptName = curDept.deptName;
            } else {
                alert("请选择部门！");
                return;
            }
            // if(!$scope.search.deptNames){
            //     delete $scope.search.searchPersonNameIds;
            // }
            $scope.search.searchPersonNameIds = $scope.search.user
                ? $scope.search.user.id
                : undefined;
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            var param = angular.extend({}, $scope.search);
            param.parkId && delete param.parkId;
            fac.getPageResult(
                "/ovu-pcos/pcos/worklogs/multi/worklog/workloglist.do",
                param,
                function(data) {
                    $scope.pageModel = data.data;
                    $scope.pageModel.currentPage =
                        $scope.pageModel.pageIndex + 1;
                    $scope.pageModel.totalPage = $scope.pageModel.pageTotal;
                    $scope.search.totalCount = $scope.pageModel.totalRecord =
                        $scope.pageModel.totalCount;
                    if (
                        $scope.pageModel.data &&
                        $scope.pageModel.data.length >= 0
                    ) {
                        $scope.pageModel.list = $scope.pageModel.data;
                    }
                    var pages = [];
                    var hash = {};
                    var list = [
                        1,
                        $scope.search.currentPage - 1,
                        $scope.search.currentPage,
                        $scope.search.currentPage + 1,
                        $scope.pageModel.pageTotal
                    ];
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.pageModel.pageTotal &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.pageModel.pageTotal - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.pageModel.pages = pages;
                }
            );
        };
       

        //新增修改弹出框
        vm.showEditModal = function(id,personId) {
            var param = {
                id: id,
                deptId: $scope.search.deptId,
                parkId: $scope.search.parkId,
                personId:personId  || app.user.personId
            };
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../view/log/manage/modal.manageEdit.html",
                size: "max",
                controller: "manageEditModalCtrl",
                controllerAs: "vm",
                resolve: {
                    param: param
                }
            });
            modal.result.then(
                function() {
                    $scope.find();
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };

        //查看日志报告
        //主管以及主任跳到有统计的页面
        //而员工则跳转到 新增对应的页面
        vm.showLogReport = function(id) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../view/log/manage/modal.logReport.html",
                size: "lg",
                controller: "watchLogReportModalCtrl",
                controllerAs: "vm",
                resolve: {
                    id: id
                }
            });
            modal.result.then(
                function() {
                    $scope.find();
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        vm.slectDepts = function() {
            if (!$scope.search.parkId) {
                alert("请选择项目");
                return;
            }
            modalDept.open({
                callback: function(node) {
                    if (node.id && node.text) {
                        $scope.search.deptName = node.text;
                        $scope.search.deptId = node.id;
                        $scope.$apply();
                    }
                    modalDept.close();
                },
                parkId: $scope.search.parkId
            });

            /* var modal = $uibModal.open({
                 animation: false,
                         component:'commonTreeModelComponent',
                 size: 'sm',
                 resolve: {
                     param:{
                         title:'选择部门',
                     data: $rootScope.treeData
                   }
                 }
             });
             modal.result.then(function (data) {
                 $scope.search.deptId = data.did;
                 $scope.search.deptName = data.text;
             }, function () {
                 console.info('Modal dismissed at: ' + new Date());
             });*/
        };
        //选择全部list
        $rootScope.checkAllList = function(list, checked, type) {
            list.forEach(function(data) {
                if (data.type == type) data.checked = checked;
            });
        };
    }
    //新增修改弹出框控制器
    app.controller("manageEditModalCtrl", manageEditModalCtrl);
    function manageEditModalCtrl(
        $scope,
        $rootScope,
        $uibModal,
        $uibModalInstance,
        $http,
        fac,
        manageService,
        param
    ) {
        var vm = this;
        vm.workrRecord = []; //工作记录
        vm.todoItem = []; //代办事项
        // vm.search = { deptId: param.deptId,parkId:param.parkId };
        vm.search = { parkId: param.parkId };
        vm.param = param;
       
        if (fac.isNotEmpty(vm.param.id)) {
            vm.isEdit = true;
            $http
                .get(
                    "/ovu-pcos/pcos/worklog/getById.do?worklogId=" + vm.param.id
                )
                .success(function(data, status, headers, config) {
                    vm.title = data.name;
                    vm.workrRecord = data.worklogRefWorkunitList || [];
                    vm.todoItem = data.worklogTodoList || [];
                    //默认展示工作记录第一个
                    vm.showRecordDetail(vm.workrRecord[0]);
                });
        }
        //添加自发工单
        vm.addSpontaneity = function() {
           

            //需求变更
            vm.workrRecord.push({
                createTime: moment().format("YYYY-MM-DD HH:mm:ss")
            });
        };

        //添加代办事项
        vm.addTodoItem = function(type) {
            vm.todoItem.push({
                createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                type: type
            });
        };

        vm.save = function() {
            var param = {
                worklogRefWorkunitList: vm.workrRecord,
                worklogTodoList: vm.todoItem,
                deptId: vm.param.deptId,
                parkId: vm.param.parkId
            };
            $http
                .post("/ovu-pcos/pcos/worklog/edit.do", param)
                .success(function(data, status, headers, config) {
                    if (data.success) {
                        $uibModalInstance.close();
                        msg("保存成功!");
                    } else {
                        alert(data.msg);
                    }
                });
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

      

        //展示工作记录情况
        vm.showRecordDetail = function(detail, index) {
            vm.recordDetail = detail;
            vm.selectIndex2 = index || 0;
        };
        /**
         * 进入页面首先直接查询工单完成情况统计
         */
        // vm.param.parkId =vm.param.parkId || ''

      
        /**
         * 进入该页面查询工单详情列表不分页
         */
        vm.find = function() {
            if (!vm.search.deptNames) {
                delete vm.search.searchPersonNameIds;
            }
            
            $http
                .get(
                    "/ovu-pcos/pcos/worklog/getPersonWorkunitList?personId="+vm.param.personId,
                   
                   
                )
                .success(function(data) {
                   
                    vm.workUnit = data.data;
                    // vm.workUnitDetailList = data || [];
                    // //默认展示第一个
                    // vm.workUnitDetailList[0] &&
                  
                });
        };
        vm.find();

        //工作记录单个删除
        vm.delWorkrRecord = function(item) {
            manageService.del(item, vm.workrRecord);
        };
        //工作记录批量删除
        vm.batchDelWorkrRecord = function() {
            manageService.batchDel(vm.workrRecord);
        };

        //代办事项单个删除
        vm.delTodoItem = function(item) {
            manageService.del(item, vm.todoItem);
        };
        //代办事项批量删除
        vm.batchDelTodoItem = function() {
            manageService.batchDel(vm.todoItem);
        };

        //选择部门弹出框
        vm.slectDept = function() {
           
            modalDept.open({
                callback: function(node) {
                    if (node.id && node.text) {
                        vm.search.deptName = node.text;
                        vm.search.deptId = node.id;
                        $scope.$apply();
                    }
                    modalDept.close();
                },
                parkId: vm.param.parkId
            });
        };
    }

    //选择自发工单弹出框
    app.controller(
        "selectSpontaneityOrderModalCtrl",
        selectSpontaneityOrderModalCtrl
    );

    function selectSpontaneityOrderModalCtrl(
        $scope,
        $uibModal,
        $uibModalInstance,
        $http,
        fac,
        param
    ) {
        var vm = this;
        $scope.pageModel = {};
        //  $scope.search = { deptId: param.deptId,parkId:param.parkId };
        $scope.search = { parkId: param.parkId };
        vm.selectedItem = []; //已选择的
        $scope.unitStatusDict = fac.dicts.unitStatusDict;

        //传入 的是已选择自发工单
        if (fac.isNotEmpty(param.workrRecord)) {
            vm.selectedItem = param.workrRecord;
        }

        vm.save = function() {
            $uibModalInstance.close(vm.selectedItem);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        //批量添加
        vm.batchAdd = function() {
            var ids = [];
            vm.selectedItem.forEach(function(t) {
                ids.push(t.workunitId);
            });
            //列表勾选的工单
            $scope.pageModel.data.forEach(function(obj) {
                obj.checked &&
                    ids.indexOf(obj.workunitId) == -1 &&
                    delete obj.checked &&
                    vm.selectedItem.push(obj);
            });
        };

        vm.add = function(item) {
            //首先判断是否重复
            var isRepeat = vm.selectedItem.some(function(selected) {
                return selected.workunitId == item.workunitId;
            });
            if (!isRepeat) {
                delete obj.checked && vm.selectedItem.push(item);
            }
        };

        //批量删除
        vm.batchDel = function() {
            var i = vm.selectedItem.length;
            while (i--) {
                vm.selectedItem[i].checked &&
                    vm.selectedItem.splice(
                        vm.selectedItem.indexOf(vm.selectedItem[i]),
                        1
                    );
            }
        };
        //单个删除
        vm.del = function(item) {
            vm.selectedItem.splice(vm.selectedItem.indexOf(item), 1);
        };

        //分页查询自发工单
        $scope.find = function(pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/worklog/selfByPaging.do",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };

        $scope.find();
    }

    //查看日志报告弹出框
    app.controller("watchLogReportModalCtrl", watchLogReportModalCtrl);
    function watchLogReportModalCtrl(
        $scope,
        $uibModal,
        $uibModalInstance,
        $http,
        fac,
        id
    ) {
        var vm = this;
        vm.item = {};
        if (fac.isNotEmpty(id)) {
            $http
                .get("/ovu-pcos/pcos/knowledge/get.do?kb_id=" + id)
                .success(function(data, status, headers, config) {
                    if (data.success) {
                        vm.item = data.data;
                    } else {
                        alert();
                    }
                });
        }

        vm.save = function() {};

        vm.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
})();
