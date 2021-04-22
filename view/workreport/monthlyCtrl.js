// 集团版月报
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("monthlyCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "工作月报";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.id = "";

        $scope.find = function (pageNo) {
            if ((!$scope.search.startTime) && (!$scope.search.endTime)) {
                return
            }
            angular.extend($scope.search, { 
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                 pageSize: $scope.pageModel.pageSize || 10,
                  reportType: 3 });
            fac.getPageResult("/ovu-pcos/pcos/report/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };


        app.modulePromiss.then(function () {
            // $scope.search = { isGroup: fac.isGroupVersion() };
            // if ($scope.search.isGroup) {
            //     $scope.search.startTime = moment().format('YYYY-MM-DD');
            //     $scope.search.endTime = moment().format('YYYY-MM-DD');
            //     $scope.find(1);
            // } else {
            //     $scope.$watch('park', function (newValue, oldValue) {
            //         if (newValue && newValue.id) {
            //             $scope.search.parkId = newValue.id;
            //             $scope.search.parkName = newValue.parkName;
            //             $scope.search.startTime = moment().format('YYYY-MM-DD');
            //             $scope.search.endTime = moment().format('YYYY-MM-DD');
            //             $scope.find(1);
            //         } else {
            //             alert("请先选定一个项目");
            //         }
            //     })
            // }
            $scope.search.startTime=moment().format('YYYY-MM-DD');
            $scope.search.endTime=moment().format('YYYY-MM-DD');
            $scope.$watch('dept.id', function (deptId, oldValue) {
               $scope.search.deptId=deptId
               if($scope.dept.parkId){
                   $scope.search.parkId=$scope.dept.parkId
                   $scope.find(); 
               }else{
                   alert('请选择跟项目关联的部门');
                   return 
               }
               
            })
        })
        //新增修改

        $scope.showAddModal = function (id, createTime, parkId, show) {
            if (show) {
                this.show = show
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/workreport/monthly/modal.monthlyEdit.html',
                size: 'max',
                controller: 'monthlyEditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    data: {
                        id: id,
                        createTime: createTime || moment().format('YYYY-MM-DD HH:mm:ss'),
                        parkId: parkId || $scope.search.parkId,
                        parkName: $scope.search.parkName,
                        show: show

                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
            });

        }
        //删除周报
        $scope.delReport = function (id) {
            confirm("确认删除该条记录吗?", function () {
                $http.post("/ovu-pcos/pcos/report/delete.do", { reportId: id }, fac.postConfig).success(function (res) {
                    if (res.success) {
                        $scope.find();
                        msg("操作成功");
                    } else {
                        msg("操作失败");
                    }
                });
            })
        }

    })
    app.controller("monthlyEditModalCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, data) {
        var vm = $scope.vm = this;
        $scope.search = {};
        $scope.pageModel = {};//员工工作记录列表
        vm.workUnitTotal = "";//工单统计表
        vm.workUnitList = ""; //工单统计详情列表
        vm.personList = "";//员工列表
        vm.planList = [];//计划列表
        vm.show = data.show;
        vm.lightspotList = [];//亮点列表
        //选择全部list
        $scope.checkAllList = function (list, checked) {
            list.forEach(function (data) {
                data.checked = checked;
            })
        }
        //添加,编辑月报
        if (fac.isNotEmpty(data.id)) {

            $http.post("/ovu-pcos/pcos/report/get.do", { reportId: data.id, parkId: data.parkId, create: data.createTime, reportType: 3 }, fac.postConfig).success(function (res) {
                if (res.success) {
                    if (data.show) {
                        vm.title = "查看月报";
                    } else {
                        vm.title = "编辑月报";
                    }

                    vm.planList = res.data.planList || [];
                    vm.lightspotList = res.data.lightspotList || [];
                    data.parkId = res.data.parkId
                    vm.lightspotList.forEach(function (v) {

                        if (!v.imgPaths) {
                            v.imgPaths = [];
                        } else {
                            v.imgPaths = v.imgPaths.split(",") || [];

                        }
                    });
                }
            })
        }

        //进入页面首先直接查询工单完成情况统计

        $scope.findWorkUnit = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || vm.workUnitTotal.currentPage || 1, pageSize: vm.workUnitTotal.pageSize || 2,
                // reportType: 3,
                // parkId: data.parkId,
                // createTime: data.createTime
            });
            fac.getPageResult("/ovu-pcos/pcos/workUnit/multiMonthQuery.do", $scope.search, function (data) {
                vm.workUnitTotal = data;
                // vm.work=[]
            //     vm.work.length=vm.workUnitTotal.data.length*3;
            //    var length= vm.workUnitTotal.data.reduce(function(ret,n){
            //          ret.push(n.workUnitPojoList.length);
            //     })
                vm.workUnitTotal.currentPage = vm.workUnitTotal.pageIndex + 1;
                vm.workUnitTotal.totalPage = vm.workUnitTotal.pageTotal;
                $scope.search.totalCount = vm.workUnitTotal.totalRecord = vm.workUnitTotal.totalCount;
                if (vm.workUnitTotal.data && vm.workUnitTotal.data.length >= 0) {
                    vm.workUnitTotal.list = vm.workUnitTotal.data;
                }
                var pages = [];
                var hash = {};
                var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, vm.workUnitTotal.pageTotal];
                list.forEach(function (v) {
                    if (!hash[v] && v <= vm.workUnitTotal.pageTotal && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf(vm.workUnitTotal.pageTotal - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                vm.workUnitTotal.pages = pages;
            })
        }
        $scope.findWorkUnit();

        $scope.find = function (pageNo, workunitType, status,parkId,deptId) {
            if (workunitType) {
                $scope.search.workunitType = workunitType;
            }
            if (status !== undefined) {
                $scope.search.status = status;
            }
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, reportType: 3, parkId: parkId, createTime: data.createTime,deptId:deptId });
            // if (status == 6) {
            //     delete $scope.search.status;
            // }
            fac.getPageResult("/ovu-pcos/pcos/workUnit/list.do", $scope.search, function (res) {
                $scope.pageModel = res;
            });

        }


        // 进入页面首先直接查询员工列表

        vm.find = function (pageNo) {

            $http.post("/ovu-pcos/pcos/workUnit/personList.do", { parkId: data.parkId, personName: $scope.search.personName }, fac.postConfig).success(function (res) {
                vm.personList = res;
                res.branch.forEach(function (v) {
                    v.nodes = v.nodes || [];
                    v.nodes && v.nodes.forEach(function (node) {
                        node.persons = node.persons || [];
                        node.nodes && node.nodes.forEach(function (n) {

                            Array.prototype.push.apply(node.persons, n.persons);
                        })
                    })
                })
                vm.personLists = res.branch;
            });

        };
        vm.find();

        //查询员工工作记录列表
        vm.workrRecord = function (id) {
            vm.deptTotalList = "";
            var personIds = [];
            $http.post("/ovu-pcos/pcos/workUnit/queryByPerson.do", { personId: id, reportType: 3, parkId: data.parkId, createTime: data.createTime }).success(function (res) {
                vm.workrRecordList = res;

            })
        }
        //查询部门人数
        vm.deptTotal = function (id,deptName) {
            vm.workrRecordList = '';
            $http.post("/ovu-pcos/pcos/workUnit/deptLog.do", { deptId: id, reportType: 3, parkId: data.parkId},fac.postConfig).success(function (res) {
                vm.deptTotalList = res;
                vm.deptTotalList.deptName=deptName;

            })
           
           

        }
        //添加待办事项

        vm.addTodoItem = function () {
            vm.planList.push({ createTime: moment().format('YYYY-MM-DD HH:mm:ss') });

        }

        //批量删除待办事项
        vm.batchDelTodoItem = function () {
            var i = vm.planList.length;
            while (i--) {
                var obj = vm.planList[i];
                obj.checked && vm.planList.splice(vm.planList.indexOf(obj), 1);
            }

        }
        //单个删除待办事项
        vm.delTodoItem = function (item) {
            vm.planList.splice(vm.planList.indexOf(item), 1);

        }

        //     //查看工作日志
        vm.showLogModal = function (id) {

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/workreport/daily/modal.showLog.html',
                size: 'md',
                controller: 'showLogModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    obj: {
                        personId: id,
                        parkId: data.parkId,
                        createTime: data.createTime,
                        reportType: 3

                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();

            });
        }
        //     
        //点击保存

        vm.save = function (form) {

            if (vm.show) {
                $uibModalInstance.close();
                return
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                alert("请填写内容");
                return;
            }
            var lightspotList = angular.copy(vm.lightspotList);
            lightspotList.forEach(function (v) {
                v.imgPaths = v.imgPaths.join(",");
            })
            var param = {
                planList: vm.planList,
                reportType: 3,
                parkName: data.parkName,
                parkId: data.parkId,
                id: data.id,

                lightspotList: lightspotList
            };
            $http.post("/ovu-pcos/pcos/report/edit.do", param).success(function (res) {

                if (res.msg == false) {
                    alert("操作失败");
                    $uibModalInstance.close();

                } else {
                    msg(res.success);
                    $uibModalInstance.close();
                }

            })
        }
        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    app.controller("showLogModalCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, obj) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, reportType: obj.reportType, create: obj.createTime, parkId: obj.parkId, personId: obj.personId });
            fac.getPageResult("/ovu-pcos/pcos/workUnit/logList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.find();
        var vm = this;
        vm.save = function () {
            $uibModalInstance.close();
        }
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');

        };
    })
})()