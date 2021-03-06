/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller(
        "workunitreleaseCtl",
        function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
            document.title = "工单待派发";
            $scope.pageModel = {};
            $scope.search = { type: 1 };
            app.modulePromiss.then(function () {
                fac.initPage(
                    $scope,
                    function () {
                        $scope.find(1);
                    },
                    function () {
                        $scope.find(1);
                    }
                );
            });

            //搜索
            $scope.find = function (pageNo) {
                if (!fac.initDeptId($scope.search)) {
                    return;
                }
                if (!$scope.search.managePersonName) {
                    delete $scope.search.managePersonId;
                }

           
                $scope.search.execPersonId = $scope.search.exec
                    ? $scope.search.exec.id
                    : undefined;
                $scope.search.EXEC_NAME = $scope.search.exec
                    ? $scope.search.exec.name
                    : undefined;
                $scope.search.managerPersonId = $scope.search.source
                    ? $scope.search.source.id
                    : undefined;
                $scope.search.managePersonName = $scope.search.source
                    ? $scope.search.source.name
                    : undefined;
                 
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                });
                fac.getPageResult(
                    "/ovu-pcos/pcos/workunitplan/page",
                    $scope.search,
                    function (data) {
                        $scope.pageModel = data;
                        $scope.pageModel.data &&
                            $scope.pageModel.data.length &&
                            $scope.pageModel.data.forEach((v) => {
                                if (
                                    v.assisPersonNames &&
                                    v.assisPersonNames.length
                                ) {
                                    v.assisNames = v.assisPersonNames.join();
                                } else {
                                    v.assisNames = "";
                                }
                            });
                    }
                );
            };
            $scope.selectNode = function (search, node) {
                if (node.state.selected) {
                    $scope.curNode = node;
                    if ($scope.curNode.WORKITEM_ID) {
                        $scope.search.workTypeId = $scope.curNode.pid;
                        $scope.search.WORKITEM_ID = $scope.curNode.WORKITEM_ID;
                    } else {
                        $scope.search.workTypeId = $scope.curNode.id;
                        delete $scope.search.WORKITEM_ID;
                    }
                    $scope.pageModel.currentPage = 1;
                    $scope.find();
                } else {
                    delete $scope.curNode;
                }
            };
            $scope.selectedExecPerson = function (item, search) {
                search.execPersonId = item.id;
            };
            $scope.selectedManagePerson = function (item, search) {
                search.managePersonId = item.id;
            };

            //删除
            $scope.delAll = function () {
                var recs = $scope.pageModel.list.filter(function (n) {
                    return n.checked;
                });
                var canDels = recs.filter(function (n) {
                    return n.unitStatus < 1 || n.unitStatus == 4;
                });
                if (canDels.length == 0 || recs.length !== canDels.length) {
                    alert("仅有待派发（包含已退回）状态的工单可删除！");
                    return;
                }
                var cannotDelNum = recs.length - canDels.length;

                confirm(
                    "确认删除选中的 " +
                        canDels.length +
                        " 条工单?" +
                        (cannotDelNum
                            ? " " +
                              cannotDelNum +
                              "条工单因非“待派发或已退回”状态不可删除！"
                            : ""),
                    function () {
                        var unitIds = canDels
                            .reduce(function (ret, n) {
                                ret.push(n.id);
                                return ret;
                            }, [])
                            .join();
                        $http
                            .post(
                                "/ovu-pcos/pcos/workunit/remove.do",
                                { unitIds: unitIds },
                                fac.postConfig
                            )
                            .success(function (resp) {
                                if (resp.success) {
                                    $scope.find(1);
                                } else {
                                    alert(resp.error);
                                }
                            });
                    }
                );
            };

            //批量设置执行人
            $scope.distriubteModal = function (item) {
                var groupList = $scope.pageModel.list.filter(function (n) {
                    return n.checked;
                });
                   
                var list = $scope.pageModel.list.reduce(function (ret, n) {
                    n.checked &&  !n.workTaskNewId && ret.push(n);
                    return ret;
                }, []);
              
                 if(!item){
                    if(!list.length || (groupList.length!==list.length)){
                        alert('需先冻结工作计划！')
                        return
                    }
                 }else{
                     if(item.workTaskNewId){
                        alert('需先冻结工作计划！')
                        return
                     }
                 }
                var parkId;
                if (
                    ["maintenanceUnit", "securityUnit", "greenUnit"].indexOf(
                        app.domain.orgType
                    ) > -1
                ) {
                    var hasParkIdWorkTask = groupList.find(function (n) {
                        return n.parkId;
                    });
                    if (hasParkIdWorkTask) {
                        parkId = hasParkIdWorkTask.parkId;
                        var hasOtherParkId = groupList.find(function (n) {
                            return n.parkId && n.parkId != parkId;
                        });
                        if (hasOtherParkId) {
                            alert("工单所处项目存在多个！");
                            return;
                        }
                    }
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: "",
                    templateUrl: "workunit/myworkunit.distribute.html",
                    controller: "personUnitSelectorCtrl",
                    resolve: {
                        data: function () {
                            var data = {
                                deptId: $rootScope.dept.id,
                                parkId: parkId,
                            };
                            if (groupList.length == 1) {
                                var unit = groupList[0];

                                data.exePerson = {
                                    id:
                                        unit.EXEC_PERSON_ID ||
                                        unit.execPersonId,
                                    name: unit.execPersonName,
                                }; //执行人
                                data.managePerson = {
                                    id:
                                        unit.MANAGE_PERSON_ID ||
                                        unit.managerPersonId,
                                    name: unit.managerName,
                                }; //管理人
                                data.assPersons = []; //协助人
                                var assIds =
                                    unit.assis_person_ids || unit.execPersonId;
                                if (assIds && unit.assisPersonNames) {
                                    var ids = assIds.split(",");
                                    var names = unit.assisPersonNames;
                                    if (ids.length == names.length) {
                                        ids.forEach(function (id, index) {
                                            data.assPersons.push({
                                                id: id,
                                                name: names[index],
                                            });
                                        });
                                    }
                                }
                            } else if (item) {
                                var unit = item;

                                data.exePerson = {
                                    id:
                                        unit.EXEC_PERSON_ID ||
                                        unit.execPersonId,
                                    name: unit.execPersonName,
                                }; //执行人
                                data.managePerson = {
                                    id:
                                        unit.MANAGE_PERSON_ID ||
                                        unit.managerPersonId,
                                    name: unit.managerName,
                                }; //管理人
                                data.assPersons = []; //协助人
                                var assIds =
                                    unit.assis_person_ids || unit.execPersonId;
                                if (assIds && unit.assisNames) {
                                    var ids = assIds.split(",");
                                    var names = unit.assisNames.split(",");
                                    if (ids.length == names.length) {
                                        ids.forEach(function (id, index) {
                                            data.assPersons.push({
                                                id: id,
                                                name: names[index],
                                            });
                                        });
                                    }
                                }
                            }
                            return data;
                        },
                    },
                });
                modal.result.then(
                    function (data) {
                        if (data) {
                            var ids=''
                           if(!item){
                            var worktaskIdList = groupList.map(function (n) {
                                return n.id;
                            });
                            ids=worktaskIdList.join()
                           }else{
                            ids=item.id
                           }
                            var params = {
                                ids: ids,
                                execPersonId: data.execId,
                                assisPersonId: data.assistanceIds,
                                managerPersonId: data.manageId,
                            };
                            $http
                                .get(
                                    "/ovu-pcos/pcos/workunitplan/savePerson",
                                    { params: params }
                                )
                                .success(function (resp) {
                                    if (resp.code==0) {
                                        msg('操作成功');
                                        $scope.find(1);
                                    } else {
                                        alert(resp.error);
                                    }
                                });
                        }
                    },
                    function () {
                        console.info("Modal dismissed at: " + new Date());
                    }
                );
            };

            //导出Excel
            $scope.exportExcel = function () {
                var ids = $scope.pageModel.list.reduce(function (ret, n) {
                    n.checked && ret.push(n.id);
                    return ret;
                }, []);

                var elemIF = document.createElement("iframe");
                elemIF.src =
                    "/ovu-pcos/pcos/workunitplan/exportRelease?ids=" +
                    ids.join();
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            };
            //下载模板
            $scope.downWorkUnitTmpl = function () {
                var elemIF = document.createElement("iframe");
                elemIF.src = "/ovu-pcos/pcos/workunitplan/downBlankTmpl";
                elemIF.style.display = "none";
                document.body.appendChild(elemIF);
            };
            //导入计划工单
            $scope.importWorkPlan = function () {
                fac.upload(
                    {
                        url: "/ovu-pcos/pcos/workunitplan/uploadExcel",
                        accept:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                    },
                    function (resp) {
                        if (resp.success) {
                            msg("导入成功！");

                            $scope.find(1);
                        } else {
                            alert(resp.msg);
                        }
                    }
                );
            };
            //新增、编辑工单
            $scope.showReleaseEditModal = function (task) {
                function _openModal() {
                    var modal = $uibModal.open({
                        animation: false,
                        size: "lg",
                        templateUrl:
                            "/view/workunit/modal.workunit_release.html",
                        controller: "workunit_releaseModalCtrl",
                        resolve: {
                            task: function () {
                                return copy;
                            },
                        },
                    });
                    modal.result.then(
                        function () {
                            if (!copy.id) {
                                fac.setWorktypeTree($scope, $scope.search);
                            }
                            $scope.find();
                        },
                        function () {
                            console.info("Modal dismissed at: " + new Date());
                        }
                    );
                }

                var copy = $.extend(true, {}, task);
                copy.is_equip = copy.equipment_id ? 1 : 2;

                if (!copy.id && $scope.curNode && $scope.curNode.WORKITEM_ID) {
                    copy.workTypeId = $scope.curNode.pid;
                    copy.workTypeName = $scope.curNode.ptexts;
                    copy.WORKITEM_ID = $scope.curNode.WORKITEM_ID;
                }
                if (!copy.id) {
                    copy.parkId = $scope.search.parkId;
                    (copy.parkName = $scope.search.parkName),
                        (copy.deptId = $scope.search.deptId);
                    if ($scope.curNode) {
                        if ($scope.curNode.ptexts) {
                            copy.workTypeName =
                                $scope.curNode.ptexts +
                                ">" +
                                $scope.curNode.text;
                        } else {
                            copy.workTypeName = "" + $scope.curNode.text;
                        }
                    } else {
                        copy.workTypeName = "";
                    }

                    copy.workTypeId = $scope.search.workTypeId;
                }
                _openModal();
            };
        }
    );
    app.controller(
        "workunit_releaseModalCtrl",
        function (
            $rootScope,
            $scope,
            $http,
            $uibModal,
            $uibModalInstance,
            $filter,
            fac,
            task
        ) {
            $scope.item = task;
          
         
            //获取工单详情
            task.id &&
                $http
                    .get("/ovu-pcos/pcos/workunitplan/detail?id=" + task.id)
                    .success(function (resp) {
                        if (resp.code==0) {
                            $scope.item = angular.extend(task,resp.data);
                           
                         
                        } else {
                            alert(resp.msg);
                        }
                    });
            $scope.workTypeChange = function (workTypeId) {
                $scope.workItemDict = [];
                workTypeId &&
                    $http
                        .post(
                            "/ovu-pcos/pcos/wrokTaskNew/page",
                            {
                                parkId: task.parkId,
                                WORKTYPE_ID: workTypeId,
                                currentPage: 1,
                                pageSize: 1000,
                                pageIndex: 0,
                                deptId: task.deptId,
                            },
                            fac.postConfig
                        )
                        .success(function (resp) {
                            if (resp.data) {
                                $scope.workItemDict = resp.data.data;
                            }
                        });
            };

            //批量设置执行人
            $scope.distriubteModal = function (work) {
                var modal = $uibModal.open({
                    animation: false,
                    size: "",
                    templateUrl: "workunit/myworkunit.distribute.html",
                    controller: "personUnitSelectorCtrl",
                    resolve: {
                        data: function () {
                            var data = {
                                deptId: task.deptId,
                                parkId: task.parkId,
                            };
                            data.exePerson = {
                                id: work.EXEC_PERSON_ID || work.execPersonId,
                                name: work.execPersonName,
                            }; //执行人
                            data.managePerson = {
                                id:
                                    work.MANAGE_PERSON_ID ||
                                    work.managerPersonId,
                                name: work.managerName,
                            }; //管理人
                          
                            data.assPersons = []; //协助人
                            var assIds =
                                work.assis_person_ids || work.execPersonId;
                            if (assIds && work.assisNames) {
                                var ids = assIds.split(",");
                                var names = work.assisNames.split(",");
                                if (ids.length == names.length) {
                                    ids.forEach(function (id, index) {
                                        data.assPersons.push({
                                            id: id,
                                            name: names[index],
                                        });
                                    });
                                }
                            }
                            return data;
                        },
                    },
                });
                modal.result.then(
                    function (data) {
                        if (data) {
                           
                            work.assis_person_ids = data.assistanceIds;
                            work.assisNames = data.assistanceNames;
                            work.execPersonId = data.execId;
                            work.managerPersonId = data.manageId;
                            work.execPersonName = data.execName;
                            work.managerName = data.manageName;
                        }
                    },
                    function () {
                        console.info("Modal dismissed at: " + new Date());
                    }
                );
            };

            $scope.$watch("item.workTaskNewId", function (workitemId) {
                var workitem = undefined;
                if (workitemId) {
                    workitem = $scope.workItemDict.find(function (n) {
                        return n.id == workitemId;
                    });
                }
                if (workitem && workitem.hasScan == 1) {
                    task.is_equip = 1;
                    task.hasScan = true;
                } else {
                    task.hasScan = false;
                }
            });
            $scope.selectWorkType = function (worktype) {
                $scope.workTypeChange(worktype.workTypeId);
            };
            $scope.workTypeChange(task.workTypeId);
            $scope.setDept = function (task, dept) {
                if (dept) {
                    if (dept.parkId != task.parkId) {
                        delete task.equipment_id;
                        delete task.equipment_name;
                        delete task.equipmentName;
                        delete task.STAGE;
                        delete task.FLOOR;
                        delete task.unit_no;
                        delete task.ground_no;
                        delete task.HOUSE_ID;
                    }
                    task.parkId = dept.parkId;
                    task.parkName = dept.parkName;
                    if (dept.parkId) {
                        houseTreePromiss = fac.getHouseTree(
                            $scope,
                            dept.parkId
                        );
                    }
                } else {
                    delete item.parkId;
                }
            };

            $scope.chooseEquipment = function (task) {
                if (!task.parkId) {
                    alert("请先选择项目！");
                    return;
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: "lg",
                    templateUrl: "/view/equipment/selector.equipment.html",
                    controller: "equipmentSelectorCtrl",
                    resolve: {
                        data: function () {
                            return {
                                parkId: task.parkId,
                                equipment_id: task.equipment_id,
                            };
                        },
                    },
                });
                modal.result.then(function (data) {
                    task.equipment_id = data.id;
                    task.equipment_name = data.name;
                    task.equipmentName = data.name;
                });
            };
            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if (!$scope.item.execPersonId) {
                    alert("请设置执行人");
                    return;
                }
                if (!$scope.item.managerPersonId) {
                    alert("请设置管理人");
                    return;
                }
                if (item.is_equip == 1) {
                    item.stageId && delete item.stageId;
                    item.stage_id && delete item.stage_id;
                    item.floor_id && delete item.floor_id;
                    item.floorId && delete item.floorId;
                    item.address && delete item.address;
                    item.houseId && delete item.houseId;
                    item.house_id && delete item.house_id;
                    item.unit_no && delete item.unit_no;
                    item.unitNo && delete item.unitNo;
                    item.groundNo && delete item.groundNo;
                    item.ground_no && delete item.ground_no;
                    item.buildId && delete item.buildId;
                } else {
                    item.equipmentNameList && delete item.equipmentNameList;
                    item.equipmentNames && delete item.equipmentNames;
                    item.equipment_id && delete item.equipment_id;
                    item.equipment_name && delete item.equipment_name;
                    item.equipmentName && delete item.equipmentName;
                    item.STAGE_ID = item.stageId;
                    item.FLOOR_ID = item.buildId;
                    item.unit_no = item.unitNo;
                    item.ground_no = item.groundNo;
                    item.HOUSE_ID = item.houseId;
                }

              

                $http
                    .post("/ovu-pcos/pcos/workunitplan/save", item)
                    .success(function (resp, status, headers, config) {
                        if (resp.code == 0) {
                            $uibModalInstance.close();
                            msg("保存成功!");
                        } else {
                            alert(resp.msg);
                        }
                    });
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
        }
    );
})();
