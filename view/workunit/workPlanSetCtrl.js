(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller(
        "workPlanSetCtl",
        function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
            document.title = "工作计划设置";

            $scope.config = { edit: true, unAdd: true };
            $scope.pageModel = { data: [] };
            $scope.curTab = "list";
            $scope.search = { type: 1 };
            $scope.companyList = [];

            app.modulePromiss.then(function () {
                $scope.$watch("dept.id", function (deptId, oldValue) {
                    if (deptId) {
                        $scope.search.deptId = deptId;

                        if ($scope.dept.parkId) {
                            $scope.search.parkId = $scope.dept.parkId;
                            $scope.search.parkName = $scope.dept.parkName;
                            $scope.find(1);
                        } else {
                            $scope.search.parkId = "";
                            $scope.search.parkName = "";
                            $scope.pageModel.data=[]
                        }

                        
                    }
                });
            });
            $scope.dayList = [
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
                "周日",
            ];
            var param = {
                orgType: "maintenanceUnit,greenUnit,securityUnit",
                pageIndex: 0,
                pageSize: 10,
            };

            $http
                .post("/ovu-base/sys/domain/list.do", param, fac.postConfig)
                .success(function (resp) {
                    $rootScope.OutCompany = resp.data;
                });

            //判断该用户是否有编辑权限
            $scope.getCheckedData = function (data) {
                var arr = [];
                data.forEach((ele) => {
                    if (ele.checked == true) {
                        arr.push(ele);
                    }
                });
                return arr;
            };
            $scope.find = function (pageNo) {
           

                $scope.search.exec_person_id = $scope.search.exec
                    ? $scope.search.exec.id
                    : undefined;
                $scope.search.manage_person_id = $scope.search.manage
                    ? $scope.search.manage.id
                    : undefined;
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                });
                $scope.search.parkId = $scope.dept.parkId;
                $scope.search.parkName = $scope.dept.parkName;
                $scope.search.deptId = $rootScope.dept.id;
                var params = angular.copy($scope.search);
            
              
                if (app.domain.orgType == "propertyManagement") {
                    //如果是物业公司来查询,那么通过parkId 查询,如果是外包域，那么通过dept来查询
                    delete params.deptId;
                } else {
                    delete params.parkId;
                }

                if (
                    app.domain.orgType == "propertyManagement" &&
                    !$scope.dept.parkId
                ) {
                    alert("请选择跟项目关联的部门");
                    return;
                }

                fac.getPageResult(
                    "/ovu-pcos/pcos/wrokTaskNew/page",
                    params,
                    function (data) {
                        $scope.pageModel = data;
                        $scope.pageModel.data &&
                            $scope.pageModel.data.length &&
                            $scope.pageModel.data.forEach((v) => {
                                if (
                                    v.equipmentNameList &&
                                    v.equipmentNameList.length
                                ) {
                                    v.equipment_names = v.equipmentNameList.join();
                                    if (v.equipmentNameList.length > 2) {
                                        v.equipmentNames =
                                            v.equipmentNameList[1] +
                                            "," +
                                            v.equipmentNameList[2] +
                                            "...等" +
                                            v.equipmentNameList.length +
                                            "个设备";
                                    } else {
                                        v.equipmentNames = v.equipmentNameList.join();
                                    }
                                } else {
                                    v.equipmentNames = "";
                                    v.equipment_names = "";
                                }
                                if (v.execDate) {
                                    v.execDateList = v.execDate.split(",");
                                }
                            });
                    }
                );
            };
            $scope.setCurTab = function (tab) {
                if (
                    app.domain.orgType == "propertyManagement" &&
                    !$scope.dept.parkId
                ) {
                   
                    return;
                }
                if ($scope.curTab != tab) {
                    $scope.curTab = tab;
                }
               
                if ($scope.curTab == "list") {
                    $scope.search.isComplate && delete $scope.search.isComplate;
                    $scope.changeFre();
                } else {
                    $scope.search.isComplate = 1;
                    $scope.changeFre(1);
                }
            };
            $scope.selectNode = function (search, node) {
                if (node.state.selected) {
                    $scope.curNode = node;
                    $scope.search.WORKTYPE_ID = $scope.curNode.id;
                    $scope.pageModel.currentPage = 1;
                    $scope.find(1);
                } else {
                    delete $scope.curNode;
                }
            };
            //设置频次

            $scope.setFrequency = function (item) {
                if (!$scope.hasPower("编辑") && !item.hasAuthority) {
                    alert("暂无设置权限");
                    return;
                }
                //
                // a.当事项没有生成工单走到审批环节时，可以直接变更（注：集团版已设置好的不可变更）。
                // B.当事项在审批环节，频次不可以编辑。
                // C.当事项已生成工单，修改频次需要先冻结事项才可以进行编辑，否则要给相应的报错提示。
                //
                // 注：列表展示的频次信息为，只有设置完整才展示，例如：每月3次。
                if (item && item.status == 0 && item.is_frozen !== 1) {
                    alert("审批已通过且未冻结的事项不可以修改频次");
                    return;
                }
                if (item && item.status == 1) {
                    alert("审批中的事项不可以修改频次");
                    return;
                }

                var modal = $uibModal.open({
                    animation: false,
                    size: "max",
                    templateUrl: "/view/workunit/modal.setFrequency.html",
                    controller: "saveFrequencyModalCtrl",
                    resolve: { item: angular.extend({ hasPage: true }, item) },
                });
                modal.result.then(
                    function () {
                        $scope.find(1);
                    },
                    function () {
                        console.info("Modal dismissed at: " + new Date());
                    }
                );
            };
            $scope.clean = function (search) {
                delete $scope.search.WORKTYPE_ID;
                delete $scope.search.WORKITEM_ID;
                delete $scope.search.pid;
            };

            $scope.changeFre = function (value) {
                $scope.search.EXEC_CYCLE = value;
                if (value == 1) {
                    $scope.dayList = [
                        "周一",
                        "周二",
                        "周三",
                        "周四",
                        "周五",
                        "周六",
                        "周日",
                    ];
                } else if (value == 2) {
                    $scope.dayList = Array.from(
                        { length: 28 },
                        (v, k) => k + 1 + "日"
                    );
                } else {
                    $scope.dayList = Array.from(
                        { length: 12 },
                        (v, k) => k + 1 + "月"
                    );
                }
                $scope.find(1);
            };
            //批量提交审核
            $scope.submitAll = function () {
                //必须选择有操作权限的数据
                var hasAuthorityItem = $scope.pageModel.list.find(function (n) {
                    return !n.hasAuthority && n.checked;
                });
                if (!$scope.hasPower("编辑") && hasAuthorityItem) {
                    alert("请选择有操作权限的数据!");
                    return;
                }
                // 只有所有必填项都填写完毕的事项才可以提交审批，否则提交审批要给出相应报错信息。
                var list = $scope.pageModel.list.reduce(function (ret, n) {
                    n.checked &&
                        (n.status == 2 || n.status == 3) &&
                        n.manage_person_id &&
                        n.exec_person_id &&
                        n.isComplate == 1 &&
                        ret.push(n);
                    return ret;
                }, []);
                var checkLength = $scope.getCheckedData($scope.pageModel.list);
                if (!list.length || checkLength.length !== list.length) {
                    alert(
                        "请选择未审批或审批未通过且执行人、管理人、频次设置完毕的数据！"
                    );
                    return;
                }

                var modal = $uibModal.open({
                    animation: false,
                    size: "max",
                    templateUrl:
                        "/view/workunit/modal.submit.approval.all.html",
                    controller: "submitApprovalModalCtrl",
                    resolve: {
                        param: function () {
                            return {
                                list: list,
                                parkId: $scope.search.parkId,
                                deptId: $scope.search.deptId,
                            };
                        },
                    },
                });
                modal.result.then(
                    function () {
                        $scope.find(1);
                    },
                    function () {
                        console.info("Modal dismissed at: " + new Date());
                    }
                );
            };

            $scope.delAll = function () {
                // 必须要有操作权限
                var hasAuthorityItem = $scope.pageModel.list.find(function (n) {
                    return !n.hasAuthority && n.checked;
                });
                // 只有项目自己添加的事项，且事项没有被启用过,没有审批通过，才可以直接删除，否则给出相应报错提示。
                if (!$scope.hasPower("编辑") && hasAuthorityItem) {
                    alert("请选择有操作权限的数据!");
                    return;
                }
                var ids = $scope.pageModel.list.reduce(function (ret, n) {
                    n.checked &&
                        n.isRequired == 0 &&
                        (n.status == 2 || n.status == 3) &&
                        ret.push(n.id);
                    return ret;
                }, []);
                var checkLength = $scope.getCheckedData($scope.pageModel.list);
                if (!ids.length || checkLength.length !== ids.length) {
                    alert(
                        "审批中和审批已通过的事项以及集团版授权的事项不可以被删除！"
                    );
                    return;
                }
                delGroup(ids);
            };
            $scope.del = function (item) {
                // 只有项目自己添加的事项，且事项没有被启用过才可以直接删除，否则给出相应报错提示。
                if (item.isRequired == 1) {
                    alert("集团版授权的事项不可以被删除");
                    return;
                }
                if (item.status == 0) {
                    alert("审批已通过的事项不可以被删除");
                    return;
                }
                if (item.status == 1) {
                    alert("审批中的事项不可以被删除");
                    return;
                }
                if (!$scope.hasPower("编辑") && !item.hasAuthority) {
                    alert("暂无设置权限");
                    return;
                }
                delGroup([item.id]);
            };

            function delGroup(ids) {
                $http
                    .post(
                        "/ovu-pcos/pcos/wrokTaskNew/delete",
                        { ids: ids.join() },
                        fac.postConfig
                    )
                    .success(function (resp) {
                        if (resp.code == 0) {
                            var mes = "";
                            var notDel = resp.notDel;
                            if (notDel && notDel.length > 0) {
                                if (notDel.length == ids.length) {
                                    alert("选中的任务已被使用过，无法删除！");
                                    return;
                                }
                                var canDels = ids.filter(function (n) {
                                    return notDel.indexOf(n) == -1;
                                });
                                mes =
                                    "确认删除选中的 " +
                                    canDels.length +
                                    " 条任务? 另 " +
                                    notDel.length +
                                    " 条任务因存在生成的工单，无法删除！";
                                del(mes, canDels);
                            } else {
                                mes = "确认删除选中的" + ids.length + "条任务?";
                                del(mes, ids);
                            }
                        } else {
                            alert(resp.msg);
                        }
                    });

                function del(mes, ids) {
                    confirm(
                        "确认删除选中的" + ids.length + "条任务?",
                        function () {
                            $http
                                .post(
                                    "/ovu-pcos/pcos/worktask/remove.do",
                                    { ids: ids.join() },
                                    fac.postConfig
                                )
                                .success(function (resp) {
                                    if (resp.success) {
                                        fac.setWorktypeTree(
                                            $scope,
                                            $scope.search
                                        );

                                        msg("操作成功");
                                        $scope.find(1);
                                    } else {
                                        alert(resp.error);
                                    }
                                });
                        }
                    );
                }
            }

            //新增、编辑事项
            $scope.showEditModal = function (task) {
                // 弹出编辑tip框，可以修改是否设备，空间信息，详细位置，工作事项描述，修改后可以保存成功，剩余的其他项均只可查看不可编辑修改。
                // a当事项没有生成工单走到审批环节时，可以直接编辑保存。
                // C.当事项已生成工单，需要先冻结事项才可以进行编辑，否则要给相应的报错提示。
                if (
                    !task &&
                    app.domain.orgType == "propertyManagement" &&
                    !$scope.search.parkId
                ) {
                    alert("请选择跟项目关联的部门");
                    return;
                }

                if (task && task.status == 1) {
                    alert("审批中的事项不可以编辑");
                    return;
                }
                if (task && task.status == 0 && task.is_frozen !== 1) {
                    alert("请先冻结工单");
                    return;
                }
                function _openModal() {
                    var modal = $uibModal.open({
                        animation: false,
                        size: "lg",
                        templateUrl: "/view/workunit/modal.workPlanSet.html",
                        controller: "workPlanSetModalCtrl",
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
                            $scope.find(1);
                        },
                        function () {
                            console.info("Modal dismissed at: " + new Date());
                        }
                    );
                }

                var copy = $.extend(true, {}, task);
                copy.is_equip = copy.equipment_ids ? 1 : 2;
                copy.deptId = $scope.search.deptId;
                copy.isRequired = copy.isRequired || 0;

                if (!copy.id && $scope.curNode && $scope.curNode.WORKITEM_ID) {
                    copy.workTypeId = $scope.curNode.pid;
                    copy.wrokTypeName = $scope.curNode.ptexts;
                    copy.wORKITEM_ID = $scope.curNode.WORKITEM_ID;
                }
                if (!copy.id) {
                    copy.parkId = $scope.search.parkId;
                    copy.parkName = $scope.search.parkName;

                    if ($scope.curNode) {
                        if ($scope.curNode.ptexts) {
                            copy.wrokTypeName =
                                $scope.curNode.ptexts +
                                ">" +
                                $scope.curNode.text;
                        } else {
                            copy.wrokTypeName = "" + $scope.curNode.text;
                        }
                    } else {
                        copy.wrokTypeName = "";
                    }

                    copy.workTypeId = $scope.search.WORKTYPE_ID;
                }
                if (copy.id) {
                    $http
                        .get(
                            "/ovu-pcos/pcos/worktask/checkRemove_mute.do?ids=" +
                                copy.id
                        )
                        .success(function (resp) {
                            if (resp.success) {
                                var notDel = resp.notDel;
                                if (notDel && notDel.length > 0) {
                                    copy.hasWorkunit = true;
                                }
                                _openModal();
                            } else {
                                alert(resp.error);
                            }
                        });
                } else {
                    _openModal();
                }
            };
            // 授权
            $scope.editNode = function (node) {
                /*    
            可以把分类授权给外包公司的指定人员，也可以授权给本项目的指定人员。
             注a：当把某分类授权给外包公司时，要求分类下的事项执行人和协助人是空的，否则授权时要给提示先删除执行人和协助人。
            注b：当把某分类授权给外包公司后，物业部门此授权分类下的事项，执行人/协助人不可编辑只可查看，管理人和频次可以变更*/

                var modal = $uibModal.open({
                    animation: true,
                    size: "md",
                    templateUrl: "/view/workunit/modal.setWorkPlanAuth.html",
                    controller: "workPlanAuthCtrl",
                    resolve: {
                        param: function () {
                            return angular.extend(
                                {
                                    deptId: $scope.search.deptId,
                                    parkId: $scope.search.parkId,
                                },
                                node
                            );
                        },
                    },
                });
                modal.result.then(function (data) {
                    $scope.find(1)
                    fac.setWorktypeTree($scope, $scope.search);
                });
            };
            //查看审批意见
            $scope.showDetailModal = function (item) {
                var modal = $uibModal.open({
                    animation: true,
                    size: "md",
                    templateUrl: "/view/workunit/modal.showOpinion.html",
                    controller: "workPlanShowOpinionhCtrl",
                    resolve: {
                        param: function () {
                            return angular.extend({}, item);
                        },
                    },
                });
            };

            //批量设置执行人、管理人、协助人
            $scope.distributeModal = function (type, item) {
                // 最多可以设置4个执行人，最少设置1人
                // 最多可以设置1个协助人，可为空
                // 管理人有且仅有1个，如果集团版设置了管理人,则管理人不可编辑修改删除
                // a当事项没有生成工单走到审批环节时，可以直接新增/替换/删除。
                // B.当事项在审批环节，执行人、管理人、协助人不可以编辑。
                // C.当事项已生成工单，新增/修改/删除执行人、管理人、协助人需要先冻结事项才可以进行编辑，否则要给相应的报错提示。
                function _openModal() {
                    var modal = $uibModal.open({
                        animation: false,
                        size: "",
                        templateUrl: "workunit/modal.workunit.distribute.html",
                        controller: "personWorkUnitSelectorCtrl",
                        resolve: {
                            data: function () {
                                var data = {
                                    deptId: $rootScope.dept.id,
                                    parkId: parkId,
                                    setType: type,
                                    parkid: $scope.search.parkId,
                                };
                                if (groupList.length == 1) {
                                    var unit = groupList[0];
                                    data.exePerson = []; //执行人
                                    data.managePerson = {
                                        id: unit.manage_person_id,
                                        name: unit.managerName,
                                    }; //管理人
                                    data.assPersons = []; //协助人
                                    if (
                                        unit.execPersonNames &&
                                        unit.exec_person_id
                                    ) {
                                        var ids = unit.exec_person_id.split(
                                            ","
                                        );
                                        var names = unit.execPersonNames;
                                        if (ids.length == names.length) {
                                            ids.forEach(function (id, index) {
                                                data.exePerson.push({
                                                    id: id,
                                                    name: names[index],
                                                });
                                            });
                                        }
                                    }
                                    if (
                                        unit.assisPersonNames &&
                                        unit.assis_person_ids
                                    ) {
                                        var ids = unit.assis_person_ids.split(
                                            ","
                                        );
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
                                    data.exePerson = []; //执行人

                                    data.managePerson = {
                                        id: item.manage_person_id,
                                        name: item.managerName,
                                    }; //管理人
                                    data.assPersons = []; //协助人
                                    if (
                                        item.execPersonNames &&
                                        item.exec_person_id
                                    ) {
                                        var ids = item.exec_person_id.split(
                                            ","
                                        );
                                        var names = item.execPersonNames;
                                        if (ids.length == names.length) {
                                            ids.forEach(function (id, index) {
                                                data.exePerson.push({
                                                    id: id,
                                                    name: names[index],
                                                });
                                            });
                                        }
                                    }
                                    if (
                                        item.assisPersonNames &&
                                        item.assis_person_ids
                                    ) {
                                        var ids = item.assis_person_ids.split(
                                            ","
                                        );
                                        var names = item.assisPersonNames;
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
                                var ids = groupList
                                    .map(function (n) {
                                        return n.id;
                                    })
                                    .join();

                                var url = "";
                                var params = {};

                                if (item) {
                                    ids = item.id;
                                }

                                if (type == "gl") {
                                    url =
                                        "/ovu-pcos/pcos/wrokTaskNew/saveManager";
                                    params = {
                                        ids: ids,

                                        managerId: data.manageId,
                                    };
                                } else if (type == "xz" || type == "zx") {
                                    url =
                                        "/ovu-pcos/pcos/wrokTaskNew/saveExecPerson";
                                    params = {
                                        ids: ids,
                                        execPersonIds: data.execId,
                                        assisPersonId: data.assistanceIds,
                                    };
                                }

                                $http
                                    .get(url, { params: params })
                                    .success(function (resp) {
                                        if (resp.code == 0) {
                                            window.msg("操作成功");
                                            $scope.find(1);
                                        } else {
                                            alert(resp.msg);
                                        }
                                    });
                            }
                        },
                        function () {
                            console.info("Modal dismissed at: " + new Date());
                        }
                    );
                }
                var hasAuthorityItem = $scope.pageModel.list.find(function (n) {
                    return !n.hasAuthority && n.checked;
                });
                if (!$scope.hasPower("编辑") && hasAuthorityItem && !item) {
                    alert("请选择有操作权限的数据!");
                    return;
                }

                if (item && !$scope.hasPower("编辑") && !item.hasAuthority) {
                    alert("暂无操作权限!");
                    return;
                }
                var groupList = $scope.pageModel.list.filter(function (n) {
                    return n.checked;
                });
                if (item && item.status == 1) {
                    alert(`审批中的事项不可修改执行人、管理人、协助人！`);
                    return;
                }
                if (item && item.status == 0 && item.is_frozen !== 1) {
                    alert(
                        `审批已通过且未冻结的事项不可修改执行人、管理人、协助人！`
                    );
                    return;
                }

                if (groupList.length == 0 && !item) {
                    //如果是批量
                    var msg = "";
                    if (type == "gl") {
                        msg = "管理人";
                    } else if (type == "xz") {
                        msg = "协助人";
                    } else if (type == "zx") {
                        msg = "执行人";
                    }
                    alert(`请勾选待设置${msg}的任务！`);
                    return;
                }
                if (type == "gl" && item && item.isOut==1 &&   app.domain.orgType !== "propertyManagement" && item.manage_person_id)  {
                    alert(`集团和项目授权的管理人不可修改！`);
                    return;
                }
                if (type == "gl" && !item) {
                    var checkList = $scope.pageModel.list.filter(function (n) {
                        return (
                            n.checked &&
                            (n.status == 1 ||
                                (n.status == 0 && n.is_frozen !== 1))
                        );
                    });
                    if (checkList && checkList.length) {
                        alert(`审批中以及审批通过的事项的管理人不可修改！`);
                        return;
                    }
                    var isOutList = $scope.pageModel.list.filter(function (n) {
                        return (
                            n.checked && n.isOut==1 && n.manage_person_id
                           
                        );
                    });
                    if (isOutList && isOutList.length &&   app.domain.orgType !== "propertyManagement")  {
                        alert(`集团和项目授权的管理人不可修改！`);
                        return;
                    }
                } else if (type !== "gl" && !item) {
                    var checkList = $scope.pageModel.list.filter(function (n) {
                        return (
                            n.checked &&
                            (n.status == 1 ||
                                (n.status == 0 && n.is_frozen !== 1))
                        );
                    });
                    if (checkList && checkList.length) {
                        alert(
                            `审批中以及审批通过的事项不可修改执行人、管理人、协助人！`
                        );
                        return;
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
                //如果分类授权给外包公司，那么执行人、协助人只可看
                if (
                    (type == "zx" || type == "xz") &&
                    item &&
                    item.isOut == 1 &&
                    app.domain.orgType == "propertyManagement"
                ) {
                    //当授权给外包公司时，执行人只读
                    alert("授权给外包公司的工作分类，不可修改执行人/协助人");
                    return;
                }

                var hasSet = $scope.pageModel.list.find(function (n) {
                    return n.isOut == 1 && n.checked;
                });
                if (
                    !item &&
                    hasSet &&
                    app.domain.orgType == "propertyManagement"
                ) {
                    alert("授权给外包公司的工作分类，不可修改执行人/协助人");
                    return;
                }
                _openModal();
            };

            //查看任务下的工单
            $scope.showWorkunitsModal = function (task) {
                task.WORKTASK_NAME = task.workTaskName;
                task.ID = task.id;
                var modal = $uibModal.open({
                    animation: false,
                    size: "lg",
                    templateUrl: "/view/workunit/modal.workunitsNew.html",
                    controller: "workunitsNewModalCtrl",
                    resolve: {
                        task: function () {
                            return task;
                        },
                    },
                });
                modal.result.then(
                    function () {},
                    function () {
                        console.info("Modal dismissed at: " + new Date());
                    }
                );
            };

            function changeTaskFroze(task, url) {
                var params = {
                    ids: task.id,
                };
                var url = url || "/ovu-pcos/pcos/wrokTaskNew/frozen";
                $http
                    .get(url, {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.code == 0) {
                           
                            //解冻后要弹出详情
                             if(url!=='/ovu-pcos/pcos/wrokTaskNew/frozen'){
                                var message=''
                                resp.data.length && resp.data.forEach(function(task){
                                  
                                    message+='【'+task.workTaskNewName+'】事项生成了'+task.sum+'条计划工单'+ "</br>"
                                })
                               
                                   warn(message,1)
                             }else{
                                 msg(resp.msg);
                             }
                            $scope.find(1);
                        } else {
                            
                            alert(resp.msg);
                        }
                    });
            }

            $scope.frozeAll = function () {
                var hasAuthorityItem = $scope.pageModel.list.find(function (n) {
                    return !n.hasAuthority && n.checked;
                });
                if (!$scope.hasPower("编辑") && hasAuthorityItem) {
                    alert("请选择有操作权限的数据!");
                    return;
                }
                var taskList = $scope.pageModel.list.filter(function (n) {
                    return n.checked && n.is_frozen != 1 && n.status == 0;
                });
                var checkLength = $scope.getCheckedData($scope.pageModel.list);
                if (
                    taskList.length == 0 ||
                    checkLength.length !== taskList.length
                ) {
                    alert("请勾选的未冻结且已通过的事项！");
                    return;
                }
                confirm(
                    "确认冻结 " +
                        taskList.length +
                        " 个事项吗？未执行计划工单将被删除！",
                    function () {
                        taskList.forEach(function (n) {
                            var params = {
                                ids: n.id,
                            };
                            $http
                                .get("/ovu-pcos/pcos/wrokTaskNew/frozen", {
                                    params: params,
                                })
                                .success(function (resp) {
                                    if (resp.code == 0) {
                                        msg("操作成功");
                                        $scope.find(1);
                                    } else {
                                        alert(resp.msg);
                                    }
                                });
                        });
                    }
                );
            };

            $scope.frozeOrUnfroze = function (task) {
                //(执行人，管理人,频次)都填了才可以解冻

                if (task.is_frozen == 1) {
                    if (
                        task.isComplate == 0 ||
                        !task.managerName ||
                        !task.exec_person_id
                    ) {
                        alert("执行人，管理人,频次设置完整后才可解冻!");
                        return;
                    }
                    if (task.status !== 0) {
                        alert("只有审批状态为已通过的事项才可以解冻!");
                        return;
                    }
                    confirm(
                        "确认解除事项：" +
                            task.workTaskName +
                            " 的冻结状态吗？需重新生成计划工单！",
                        function () {
                            changeTaskFroze(
                                task,
                                "/ovu-pcos/pcos/wrokTaskNew/unfrozen"
                            );
                        }
                    );
                } else {
                    //只有审批状态为已通过的事项才可以点击冻结
                    if (task.status !== 0) {
                        alert("只有审批状态为已通过的事项才可以冻结");
                        return;
                    }
                   
                    confirm(
                        "确认冻结事项：" +
                            task.workTaskName +
                            " 吗？未执行计划工单将被删除！",
                        function () {
                            changeTaskFroze(task);
                        }
                    );
                }
            };
        }
    );

    app.controller(
        "workPlanSetModalCtrl",
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
            //用于获取步骤列表
        
            $scope.item = task;
            $scope.item.stepList = task.stepList || [];
             if($scope.item.parkBak){
                $scope.item.parkId=$scope.item.parkBak
             }

            $scope.item.stepList &&
                $scope.item.stepList.length &&
                $scope.item.stepList.forEach((v) => {
                    v.DESCRIPTION = v.dESCRIPTION;
                    v.WORKSTEP_NO = v.wORKSTEP_NO;
                    v.WORKSTEP_NAME = v.wORKSTEP_NAME;
                    v.SORT = v.sORT;
                    v.OPERATION_TYPE = v.oPERATION_TYPE;
                    v.OPTIONS_LIST = v.oPTIONS_LIST;
                });

            $scope.delStep = function (stepList, step) {
                confirm("确定删除此步骤吗?", function () {
                    stepList.splice(stepList.indexOf(step), 1);
                    $scope.$apply();
                });
            };

            if (task && task.parkId) {
                task.stageId = task.stageId;
                task.buildId = task.floorId;
                task.unitNo = task.unitNo;
                task.groundNo = task.groundNo;
                task.houseId = task.houseId;
            }

            $scope.setDept = function (task, dept) {
                if (dept) {
                    if (dept.parkId != task.parkId) {
                        delete task.equipment_id;
                        delete task.equipment_name;
                        delete task.STAGE;
                        delete task.FLOOR;
                        delete task.unitNo;
                        delete task.groundNo;
                        delete task.houseId;
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
                var cameraIds = [];
                var selectEqList = [];

                if (task.equipment_ids && task.equipment_names) {
                    cameraIds = task.equipment_ids.split(",");
                    task.equipmentNameList = task.equipment_names.split(",");

                    cameraIds.forEach((v, i) => {
                        selectEqList.push({
                            id: v,
                            equip_simple_name: task.equipmentNameList[i],
                        });
                    });
                }

                var modal = $uibModal.open({
                    animation: false,
                    size: "lg",
                    templateUrl: "/view/equipment/selector.equipmen.mult.html",
                    controller: "equipmentSelectorMultCtrl",
                    resolve: {
                        data: function () {
                            return {
                                parkId: task.parkId,
                                selectEqList: selectEqList,
                                cameraIds: task.equipment_ids,
                            };
                        },
                    },
                });
                modal.result.then(function (data) {
                    task.equipment_ids = data
                        .reduce(function (ret, n) {
                            ret.push(n.id);
                            return ret;
                        }, [])
                        .join();
                    task.equipment_names = data
                        .reduce(function (ret, n) {
                            ret.push(n.equip_simple_name);
                            return ret;
                        }, [])
                        .join();
                });
            };

            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                var flag = true; //如果操作类型为选择，则选项里面必须包含','
                item.stepList &&
                    item.stepList.forEach(function (v) {
                        if (
                            v.OPERATION_TYPE == "3" &&
                            v.OPTIONS_LIST.indexOf("，") == -1
                        ) {
                            flag = false;
                            return;
                        }
                    });
                if (!flag) {
                    alert('选项里面必须包含"，"请正确填写选项');
                    return;
                }
                if (item.is_equip == 1) {
                    item.stageId && delete item.stageId;
                    item.stage_id && delete item.stage_id;
                    item.floorId && delete item.floorId;
                    item.floor_id && delete item.floor_id;
                    item.address && delete item.address;
                    item.houseId && delete item.houseId;
                    item.house_id && delete item.house_id;
                    item.unitNo && delete item.unitNo;
                    item.unit_no && delete item.unit_no;
                    item.groundNo && delete item.groundNo;
                    item.ground_no && delete item.ground_no;
                    item.buildId && delete item.buildId;
                } else {
                    item.equipmentNameList && delete item.equipmentNameList;
                    item.equipmentNames && delete item.equipmentNames;
                    item.equipment_ids && delete item.equipment_ids;
                    item.equipment_names && delete item.equipment_names;
                }
             
                var params = angular.copy(item);
                params.parkBak=$scope.item.parkId
                if(app.domain.orgType == "propertyManagement"){
                    
                }else{
                   
                    delete params.parkId
                }
                  
                 
                   
                var url = "";
                if (item.id) {
                    url = "/ovu-pcos/pcos/wrokTaskNew/edit";
                } else {
                    url = "/ovu-pcos/pcos/wrokTaskNew/insert";
                }
                if(item.stepList.length==0){
                  
                   alert('请添加步骤!')
                   return
                }

                $http.post(url, params).success(function (resp) {
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
    //设置频次
    app.controller(
        "saveFrequencyModalCtrl",
        function ($scope, $http, $uibModalInstance, $filter, fac,$timeout, item) {
            $scope.search = {};
            $scope.pageModel = {};
         
           
             if (app.domain.orgType !== "propertyManagement" && item.isComplate==1 && item.isOut==1) {
                //如果是外包域并且频次已经设置完整了，那么频次不可修改
                $scope.unFrequencyAuth=true
            } 
         
            //获取选中的数组长度
            $scope.getSelectData = function (data) {
                var arr = [];
                data.forEach((ele) => {
                    if (ele.isSelected == true) {
                        arr.push(ele);
                    }
                });
                return arr;
            };

            $scope.item = item;
            $scope.item.WORKITEM_NAME = item.workTaskName;
            $scope.item.exec_num = item.execNum;
            $scope.item.exec_cycle = item.execCycle || 1;

            $scope.item.sendTime = item.send_time || item.sendTime;
            var copyItem=Object.assign({},item)
             var copySendTime= item.send_time || item.sendTime;
             var copyexec_num= item.execNum ;
            $scope.frelist = [];
            var execDateList = [];
            item.execDate && (execDateList = item.execDate.split(","));

            $scope.dayList=[
                {value:'周一',isSelected:false},
                {value:'周二',isSelected:false},
                {value:'周三',isSelected:false},
                {value:'周四',isSelected:false},
                {value:'周五',isSelected:false},
                {value:'周六',isSelected:false},
                {value:'周日',isSelected:false},
             
            ]

            $scope.find = function (pageNo) {
            
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    EXEC_CYCLE: $scope.item.exec_cycle,
                    deptId: item.deptId,
                    IDS: item.id,
                });

                fac.getPageResult(
                    "/ovu-pcos/pcos/wrokTaskNew/frequence",
                    $scope.search,
                    function (res) {
                        
                   
                        $scope.pageModel = res;
                       
                        $scope.pageModel.data &&
                            $scope.pageModel.data.length &&
                            $scope.pageModel.data.forEach((v) => {
                                if (v.execDate) {
                                    v.execDateList = v.execDate.split(",");
                                } else {
                                    v.execDateList = [];
                                }
                            });
                    }
                );
            };
            $scope.$watch("item.exec_cycle", function (newV, oldV) {
                if (newV && newV !== oldV && !$scope.msgFlag) {
                    $scope.item.exec_num && delete $scope.item.exec_num;
                    $scope.item.sendTime && delete $scope.item.sendTime;
                }
            });

            $scope.changeFre = function (value) {
                $scope.item.exec_cycle = value;

                if (value == 1) {
                    $scope.dayList=[
                        {value:'周一',isSelected:false},
                        {value:'周二',isSelected:false},
                        {value:'周三',isSelected:false},
                        {value:'周四',isSelected:false},
                        {value:'周五',isSelected:false},
                        {value:'周六',isSelected:false},
                        {value:'周日',isSelected:false},
                     
                    ]
                } else if (value == 2) {
                    $scope.dayList = Array.from(
                        { length: 28 },
                        (v, k) =>
                            (k = { value: k + 1 + "日", isSelected: false })
                    );
                } else {
                    $scope.dayList = Array.from(
                        { length: 12 },
                        (v, k) =>
                            (k = { value: k + 1 + "月", isSelected: false })
                    );
                }
                $scope.find(1);
            };
            $scope.changeFre($scope.item.exec_cycle);
            if (execDateList.length) {
                $scope.dayList.forEach((v, i) => {
                    if (execDateList.indexOf(i + 1 + "") !== -1) {
                        v.isSelected = true;
                    }
                });
            }
            $scope.selectOne = function (d) {
                if($scope.unFrequencyAuth){
                  return
                }
                d.isSelected = !d.isSelected;
                var execDate = $scope.dayList.reduce(function (ret, n, i) {
                    n.isSelected && ret.push(i + 1);
                    return ret;
                }, []);
                $scope.item.exec_num = execDate.length;
            };
            $scope.$watch("item.exec_num", function (newV, oldV) {
                if (newV == $scope.dayList.length) {
                    $scope.dayList.forEach((v) => {
                        v.isSelected = true;
                    });
                }
            });

            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                var execDate = $scope.dayList.reduce(function (ret, n, i) {
                    n.isSelected && ret.push(i + 1);
                    return ret;
                }, []);
                // 注：频次必须填写完整才可以保存成功。
                if ((!execDate && !execDate.length) || !$scope.item.exec_num) {
                    alert("频次必须设置完整！");
                    return;
                }
                if (!$scope.item.sendTime) {
                    alert("请设置派发时间!");
                    return;
                }

                if (execDate.length !== $scope.item.exec_num) {
                    alert("频次必须与设置的日期一致");
                    return;
                }

                var params = {
                    id: $scope.item.id,
                    EXEC_CYCLE: $scope.item.exec_cycle,
                    EXEC_NUM: $scope.item.exec_num + "",
                    EXEC_DATE: execDate.join(","),
                    sendTime: $scope.item.sendTime,
                };

                $http
                    .post("/ovu-pcos/pcos/wrokTaskNew/saveFrequency", params)
                    .success(function (resp, status, headers, config) {
                        if (resp.code == 0) {
                            msg("保存成功!");
                            $scope.msgFlag=false
                            $uibModalInstance.close();
                        } else {
                            $scope.msgFlag=true
                            layer.alert(resp.msg, {
                             
                                icon: 5,
                            },function(index){
                           
                                
                               
                                layer.close(index);
                               
                                $timeout(function(){
                                   
                                   //把数据还原成模态框的初始值
                           
                                    $scope.item.exec_num = copyexec_num;
                                    $scope.item.exec_cycle =copyItem.exec_cycle;
                                    $scope.item.sendTime = copySendTime
                                    
                                     var execDateList=[]
                                    execDateList = copyItem.execDate.split(",")
                                    
                                      if ( $scope.item.exec_cycle == 1) {
                                        $scope.dayList=[
                                            {value:'周一',isSelected:false},
                                            {value:'周二',isSelected:false},
                                            {value:'周三',isSelected:false},
                                            {value:'周四',isSelected:false},
                                            {value:'周五',isSelected:false},
                                            {value:'周六',isSelected:false},
                                            {value:'周日',isSelected:false},
                                         
                                        ]
                                    } else if ( $scope.item.exec_cycle == 2) {
                                        $scope.dayList = Array.from(
                                            { length: 28 },
                                            (v, k) =>
                                                (k = { value: k + 1 + "日", isSelected: false })
                                        );
                                    } else {
                                        $scope.dayList = Array.from(
                                            { length: 12 },
                                            (v, k) =>
                                                (k = { value: k + 1 + "月", isSelected: false })
                                        );
                                    }
                                 
                                    $scope.dayList.forEach((v, i) => {
                                      
                                        if (execDateList.indexOf(i + 1 + "") !== -1) {
                                            v.isSelected = true;
                                        }
                                    });
                                  
                                   
                                    $scope.$apply()
                                },200)
                              })
                           
                            
                            
                            
                        }
                       
                    });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
        }
    );

    //授权
    app.controller(
        "workPlanAuthCtrl",
        function ($scope, $http, $uibModalInstance, $rootScope, fac, param) {
            $scope.unique = function (quan_lst) {
                //去掉重复选取的数据
                for (var i = 0; i < quan_lst.length; i++) {
                    for (var j = i + 1; j < quan_lst.length; ) {
                        if (quan_lst[i].id == quan_lst[j].id) {
                            //通过photoid属性进行匹配；
                            quan_lst.splice(j, 1); //去除重复的对象；
                        } else {
                            j++;
                        }
                    }
                }
                return quan_lst;
            };

            $scope.companyList = $rootScope.OutCompany || [];
            $scope.item = param;
            $scope.item.users = [];
            var userIds = [];
            var personNames = [];
            var authId = [];
             var isOutSourcing
            $scope.item.isOutSourcing = $scope.item.isOutSourcing || 2;

            function getInfo(params) {
                $http
                    .post("/ovu-pcos/pcos/workunitauthority/query", params)
                    .success(function (data) {
                        if (data.data && data.data.length) {
                            userIds = data.data.reduce(function (ret, n) {
                                n.personId && ret.push(n.personId);
                                return ret;
                            }, []);
                            authId = data.data.reduce(function (ret, n) {
                                ret.push(n.id);
                                return ret;
                            }, []);
                            personNames = data.data.reduce(function (ret, n) {
                                n.personName && ret.push(n.personName);
                                return ret;
                            }, []);
                            $scope.item.isOutSourcing =
                                data.data[0].isOutSourcing;
                                isOutSourcing=data.data[0].isOutSourcing
                            if (data.data[0].domainCode) {
                                $scope.companyList.length &&
                                    $scope.companyList.forEach((v) => {
                                        if (
                                            v.domainCode ==
                                            data.data[0].domainCode
                                        ) {
                                            $scope.item.org = v;
                                        }
                                    });

                                $scope.item.outDeptName =
                                    data.data[0].outDeptName;
                                $scope.item.domainCode =
                                    data.data[0].domainCode;
                                $scope.item.domainId = data.data[0].domainId;
                                $scope.item.outDeptId = data.data[0].outDeptId;
                                getOrgTree(data.data[0].domainCode);
                            }
                        }

                        var users = [];
                        var userIdList = [];
                        var userNameList = [];
                        if (userIds.length) {
                            userIdList = userIds.join(",").split(",");
                        }
                        if (personNames.length) {
                            userNameList = personNames.join(",").split(",");
                        }
                       

                        if (userIdList.length) {
                            for (var i in userIdList) {
                                var obj = {
                                    id: userIdList[i],
                                    name: userNameList[i],
                                };

                             
                                users.push(obj);
                            }

                            $scope.item.users = $scope.unique(users);
                        }
                    });
            }
            //如果是物业域，那么就传parkId
            if (app.domain.orgType == "propertyManagement") {
                getInfo({
                    workTypeId: param.WORKTYPE_ID,
                    deptId: param.deptId,
                    parkId: param.parkId,
                });
            } else {
                $http
                    .get("/ovu-pcos/pcos/workunitauthority/queryout", {
                        params: {
                            deptId: param.deptId,
                            outDeptId: param.deptId,
                            workTypeId: param.WORKTYPE_ID,
                        },
                    })
                    .success((res) => {
                        $scope.isAuth = res.data; // 1是授权 2是自增 3是初始状态

                        var params = {
                            workTypeId: param.WORKTYPE_ID,
                        };
                        if ($scope.isAuth == 1) {
                            //是外包授权过来的
                            params.outDeptId = param.deptId;
                        } else {
                            params.deptId = param.deptId;
                        }
                        getInfo(params);
                    });
            }

            $scope.$watch("item.user", function (newV, oldV) {
                $scope.selectPerson(newV);
            });

            $scope.$watch("item.org", function (newV, oldV) {
                if (oldV !== undefined) {
                    $scope.item.users = [];
                    $scope.item.user = null;
                    $scope.outSourceDeptTree = [];
                    $scope.item.outDeptId && delete $scope.item.outDeptId;
                    $scope.item.outDeptName && delete $scope.item.outDeptName;
                }
            });
            $scope.selectOut = function () {
                $scope.item.users = [];
                $scope.item.user = null;
            };

            function getOrgTree(domainCode) {
                $http
                    .get(
                        "/ovu-base/system/dept/rightTree.do?domainCode=" +
                            domainCode
                    )
                    .success(function (resp) {
                        if (resp.code == 0) {
                            $scope.outSourceDeptTree = resp.data;
                        }
                    });
            }
            $scope.selectOrg = function (org) {
                $scope.item.domainCode && delete $scope.item.domainCode;
                $scope.item.domainId && delete $scope.item.domainId;
                $scope.outSourceDeptTree = [];
                $scope.item.outDeptId && delete $scope.item.outDeptId;
                $scope.item.outDeptName && delete $scope.item.outDeptName;
                $scope.item.domainCode = org.domainCode;
                $scope.item.domainId = org.id;
                $scope.item.users = [];
                $scope.item.user = null;

                getOrgTree(org.domainCode);
            };
            //切换类型
            $scope.changeType = function (type) {
                $scope.item.users = [];
                if (type == 1) {
                    //是外包公司，
                } else {
                    //不是外包公司，删除外包的所有相关信息
                    $scope.item.org && delete $scope.item.org;
                    //不是外包公司，删除域id
                    $scope.item.domainId && delete $scope.item.domainId;
                    $scope.item.domainCode && delete $scope.item.domainCode;
                    $scope.item.outDeptId && delete $scope.item.outDeptId;
                    $scope.item.outDeptName && delete $scope.item.outDeptName;
                }
            };

            //选择人员
            $scope.selectPerson = function (user) {
                if (!user) {
                    return;
                }
                if (!user.userId) {
                    alert("此用户“" + user.name + "”未分配系统账号！");
                    return;
                }

                if (
                    $scope.item.users.find(function (n) {
                        return n.id == user.id;
                    })
                ) {
                    alert("此用户“" + user.name + "”已存在！");
                    return;
                }
                $scope.item.users.push(user);
                $scope.item.user = null;
            };
            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if( $scope.item.isOutSourcing== 1 &&  $scope.item.users.length==0){
                    alert("请至少选择一位责任人！");
                    return;
                }
                var personIds = $scope.item.users
                    .reduce(function (ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, [])
                    .join();
                var params = {
                    personId: personIds,
                    workTypeId: $scope.item.WORKTYPE_ID,
                    isOutSourcing: $scope.item.isOutSourcing,
                    deptId: $scope.item.deptId,
                    parkId: $scope.item.parkId,
                    domainCode: $scope.item.domainCode,
                    outDeptId: $scope.item.outDeptId,
                    domainId: $scope.item.domainId,
                };
                if (authId.length) {
                    params.IDS = authId.join(",");
                }
                 if( isOutSourcing==1 && $scope.item.isOutSourcing==2){
                    // isFromOut 如果是从外包改为非外包 就传1
                    params.isFromOut=1
                 }else{
                    params.isFromOut && delete  params.isFromOut
                 }
                
                
                $http
                    .post("/ovu-pcos/pcos/workunitauthority/save", params)
                    .success(function (resp) {
                        if (resp.code == 0) {
                            msg("操作成功");
                            $uibModalInstance.close();
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
    //批量审核
    app.controller(
        "submitApprovalModalCtrl",
        function ($scope, $http, $uibModalInstance, param, fac) {
            $scope.showDetail = true;
            $scope.pageModel = {};

            $scope.pageModel.data = param.list;
            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                var taskNewIds = $scope.pageModel.data
                    .reduce(function (ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, [])
                    .join();
                var params = {
                    taskNewIds: taskNewIds,
                    parkId: param.parkId,
                    deptId: param.deptId,
                    comment: $scope.item.comment,
                };

                $http
                    .post("/ovu-pcos/pcos/wrokTaskNew/submit", params)
                    .success(function (resp, status, headers, config) {
                        if (resp.code == 0) {
                            $uibModalInstance.close();
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
    app.controller(
        "workPlanShowOpinionhCtrl",
        function ($scope, $http, $uibModalInstance, param) {
            $scope.item = param;
            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
        }
    );
    //查看工单
    app.controller(
        "workunitsNewModalCtrl",
        function (
            $scope,
            $http,
            $uibModal,
            $uibModalInstance,
            $filter,
            fac,
            task
        ) {
            $scope.task = task;
            $scope.search = {};
            $scope.pageModel = {};
            $scope.find = function (pageNo) {
         
                $.extend($scope.search, {
                    currentPage: pageNo || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    ID: task.id,
                });

                fac.getPageResult(
                    "/ovu-pcos/pcos/worktask/listWorkunitnew",
                    $scope.search,
                    function (data) {
                        $scope.pageModel = data;
                    }
                );
            };

            $scope.delAll = function () {
                var recs = $scope.pageModel.list.filter(function (n) {
                    return n.checked;
                });
                var canDels = recs.filter(function (n) {
                    return n.UNIT_STATUS < 5;
                });
                if (canDels.length == 0) {
                    alert("仅有未接单状态的工单可删除！");
                    return;
                }
                var cannotDelNum = recs.length - canDels.length;
                confirm(
                    "确认删除选中的 " +
                        canDels.length +
                        " 条工单?" +
                        (cannotDelNum
                            ? " " + cannotDelNum + "条工单因已接单不可删除！"
                            : ""),
                    function () {
                        var unitIds = canDels
                            .reduce(function (ret, n) {
                                ret.push(n.ID);
                                return ret;
                            }, [])
                            .join();
                        $http
                            .post(
                                "/ovu-pcos/pcos/workunit/remove.do",
                                {
                                    unitIds: unitIds,
                                },
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

            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
            $scope.find(1);
        }
    );
})();
