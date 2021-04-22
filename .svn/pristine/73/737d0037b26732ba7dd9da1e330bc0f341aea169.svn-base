/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('ownerHouseChargeSetCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $state, $location) {
        document.title = "房屋信息管理";
        $scope.pageModel = {};
        $scope.config = { edit: false };
        $scope.search = {};
        var park;
        fac.loadSelect($scope, "HOUSE_TYPE");
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName;
                        $scope.loadHouseTree();
                        if ($scope.search.parkId) {
                            $http.post("/ovu-base/system/park/getWithPath", { ids: $scope.search.parkId }, fac.postConfig).
                                success(function (resp) {
                                    if (resp.data && resp.data.length > 0) {
                                        park = resp.data[0];
                                    }
                                })
                        } else {
                            park = undefined;
                        }
                    } else {
                        $scope.search = {};
                    }
                } else {
                    $scope.search = {};
                }
                $scope.find(1);
            })
        });

        //获取列表
        $scope.find = function (pageNo) {
            if (!fac.hasOnlyPark($scope.search)) {
                $scope.search = {};
                delete $rootScope.treeData;
                delete $scope.treeData;
                $scope.pageModel = {};
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.isSperated = 0;
            $scope.search.spaceStatus = -1;
            fac.getPageResult("/ovu-base/system/parkHouse/listByGrid", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //选中节点
        $scope.selectNode = function (node) {

            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;

            if (node.state.selected) {
                $scope.curNode = node;

                if (node.level === 1) {
                    $scope.search.stageId = node.id;

                    delete $scope.search.buildId;
                    delete $scope.search.unitId;
                    delete $scope.search.floorId;
                }
                else if (node.level === 2) {
                    $scope.search.stageId = node.parentId;
                    $scope.search.buildId = node.id;

                    delete $scope.search.unitId;
                    delete $scope.search.floorId;
                }
                else if (node.level === 3) {
                    $scope.search.buildId = node.parentId;
                    $scope.search.unitId = node.id;
                    var build = $rootScope.getNode({ id: node.parentId });
                    $scope.search.stageId = build.parentId;

                    delete $scope.search.floorId;
                }
                else {
                    $scope.search.unitId = node.parentId;
                    $scope.search.floorId = node.id;
                    var unit = $rootScope.getNode({ id: node.parentId });
                    $scope.search.buildId = unit.parentId;
                    var build = $rootScope.getNode({ id: unit.parentId });
                    $scope.search.stageId = build.parentId;
                }
            } else {
                delete $scope.curNode;
                delete $scope.search.stageId;
                delete $scope.search.buildId;
                delete $scope.search.unitId;
                delete $scope.search.floorId;
            }
            $scope.find(1);
        }
        //在只知道节点id下，获取节点完整信息
        $rootScope.getNode = function (node) {
            var ret;
            var flag = false;
            //使用array模拟栈
            var stack = new Array();
            var nodes = $rootScope.treeData;
            for (let i = 0; i < nodes.length; i++) {
                stack.push(nodes[i]);
            }
            while (stack.length > 0 && !flag) {
                //出栈
                var curNode = stack.pop();
                if (curNode.id === node.id) {
                    ret = curNode;
                    flag = true;
                    break;
                }
                if (!flag && curNode.nodes && curNode.nodes.length > 0) {
                    for (let j = 0; j < curNode.nodes.length; j++) {
                        stack.push(curNode.nodes[j]);
                    }
                }
            }
            return ret;
        }

        //获取树
        $scope.loadHouseTree = function () {
            $http.post("/ovu-base/system/parkStage/treeNew", {
                parkId: $scope.search.parkId,
                //level:2
                //新增对单元以及楼层管理，展示到第四层级
                level: 4
            }, fac.postConfig).success(function (treeData) {
                if (treeData) {
                    $rootScope.flatData = fac.treeToFlat(treeData);
                    $rootScope.flatData.forEach(function (n) {
                        //n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                        //n.level === 2 ? (n.isLeaf = true) : (n.isLeaf = false);
                        n.level === 4 ? (n.isLeaf = true) : (n.isLeaf = false);
                    });
                }
                $rootScope.treeData = treeData;
                //没有这行代码，首次创建用户创建分期时点击node展示的结构和刷新后展示的结构不一致，导致多处逻辑错误
                $scope.treeData = treeData;
            });
        };
        // 批量设置房屋收费项目
        $scope.addHouse = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/propertyCharges/ownerHouseCharge/modal.houseChargeAdd.html',
                controller: 'houseChargeAddCtrl',
                resolve: {
                    item: { parkId: $scope.search.parkId }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }
        // 设置房屋收费项目
        $scope.editHouse = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/propertyCharges/ownerHouseCharge/modal.chargeEdit.html',
                controller: 'houseChargeEditCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }

        //收费项目
        $scope.houseCList = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/propertyCharges/ownerHouseCharge/modal.chargeCheck.html',
                controller: 'chargeCheckCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            });
        }

    });

    app.controller('chargeCheckCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        //获取工位列表
        $scope.search = {};
        $scope.pageModel = {};
        $scope.search.houseId = item.id;
        $scope.search.parkId = item.parkId;
        //获取工位列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/property/expenseHouse/listByPage", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        }
        // 删除
        $scope.delete = function (id) {
            $http.post("/ovu-park/backstage/property/expenseHouse/delete", { id: id }, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $scope.find();
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        app.modulePromiss.then(function () {
            $scope.find(1);
        })
    });

    app.controller('houseChargeEditCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac, item) {
        $scope.search = item;
        // 减免折扣控制和减免额
     /*   $scope.discountEditChange = function (type) {
            if (type === 1) {
                if (!$scope.search.discount) {
                    return false;
                }
                if ($scope.search.discount > 100) {
                    window.alert("减免折扣不能大于100!");
                    $scope.search.discount = '';
                    return false;
                }
                $scope.search.discount = $scope.search.discount.toFixed(2);
                $scope.search.discount = Number($scope.search.discount);
            } else if (type === 2) {
                if (!$scope.search.deductions) {
                    return false;
                }
                if ($scope.search.deductions > 100000000) {
                    window.alert("减免折扣不能大于1亿!");
                    $scope.search.deductions = '';
                    return false;
                }
                $scope.search.deductions = $scope.search.deductions.toFixed(2);
                $scope.search.deductions = Number($scope.search.deductions);
            }
        }*/

        $scope.setRemark = function () {
            $scope.expenseList.forEach((value, index) => {
                if (value.expenseChildId === $scope.search.expenseChildId) {
                    $scope.search.remark = value.remark;
                }
            })
        }
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项!");
                return false;
            }
            let params = {
                parkId: $scope.search.parkId,
                /*discount: $scope.search.discount,
                deductions: $scope.search.deductions,*/
                remark: $scope.search.remark
            };
            $scope.expenseList.forEach((value, index) => {
                if (value.expenseChildId === $scope.search.expenseChildId) {
                    params.id = value.id;
                    params.houseId = value.houseId;
                    params.expenseChildId = value.expenseChildId;
                }
            })
            $http.post("/ovu-park/backstage/property/expenseHouse/saveOrEdit", params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        // 获取收费项目
        function getExpenseList(parkId, houseId) {
            $http.post("/ovu-park/backstage/property/expenseHouse/selectByHouseId", {
                houseId: houseId
            }, fac.postConfig).success(function (data) {
                console.log(data)
                $scope.expenseList = data.data;
            })
        }
        app.modulePromiss.then(function () {
            getExpenseList($scope.search.parkId, $scope.search.id);
        })
    });


    app.controller('houseChargeAddCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, item) {
        $scope.title = "批量设置房屋收费项目"
        $scope.search = item;
        $scope.HOUSE = '';
        //选择分期
        $scope.changeStage = function (STAGE) {
            if (null == STAGE) {
                delete $scope.buildList;
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.groundNo;
            } else {
                $scope.search.stageId = STAGE.id;
                loadBuildListByStageId(STAGE.id);//获得楼栋
            }
        }
        //选择楼栋
        $scope.changeBuild = function (BUILD) {
            if (null == BUILD) {
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.groundNo;
            } else {
                $scope.search.buildId = BUILD.id;
                loadUnitListByBuildId(BUILD.id)//获得单元
            }
        }
        //选择单元
        $scope.changeUnit = function (BUILD, UNITNO) {
            if (null == UNITNO) {
                delete $scope.groundList;
                delete $scope.search.groundNo;
            } else {
                $scope.search.unitNo = UNITNO;
                loadGroundListByUnit(BUILD.id, UNITNO);//获得楼层
            }
        }
        //选择楼层
        $scope.changeGround = function (GROUNDNO) {
            if (null == GROUNDNO) {
                $scope.search.house = '';
            } else {
                $scope.search.groundNo = GROUNDNO;
            }
        }
        // 选择房屋
        $scope.changeHouse = function () {
            if (!$scope.search.stageId) {
                window.alert("请选择分区!");
                return false;
            }
            if (!$scope.search.buildId) {
                window.alert("请选择楼栋!");
                return false;
            }
            if (!$scope.search.unitNo) {
                window.alert("请选择单元!");
                return false;
            }
            if (!$scope.search.groundNo) {
                window.alert("请选择楼层!");
                return false;
            }
            let params = {
                isSperated: 0,
                spaceStatus: -1,
                rentsaleCharacter: 1
            }
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/propertyCharges/ownerHouseCharge/modal.chooseHouse.html',
                controller: 'chooseHouseCtrl',
                resolve: {
                    item: $.extend({}, params, $scope.search)
                }
            });
            modal.result.then(function (data) {
                let houseNames = [];
                let houseIds = [];
                data && data.houseList && data.houseList.forEach((value, index) => {
                    houseNames.push(value.houseName);
                    houseIds.push(value.id);
                })
                $scope.HOUSE = houseNames.join();
                $scope.search.houseIds = houseIds.join();
            });
        }
        // 减免折扣控制和减免额
      /*  $scope.discountEditChange = function (type) {
            if (type === 1) {
                if (!$scope.search.discount) {
                    return false;
                }
                if ($scope.search.discount > 100) {
                    window.alert("减免折扣不能大于100!");
                    $scope.search.discount = '';
                    return false;
                }
                $scope.search.discount = $scope.search.discount.toFixed(2);
                $scope.search.discount = Number($scope.search.discount);
            } else if (type === 2) {
                if (!$scope.search.deductions) {
                    return false;
                }
                if ($scope.search.deductions > 100000000) {
                    window.alert("减免折扣不能大于1亿!");
                    $scope.search.deductions = '';
                    return false;
                }
                $scope.search.deductions = $scope.search.deductions.toFixed(2);
                $scope.search.deductions = Number($scope.search.deductions);
            }
        }*/
        $scope.save = function (form) {
            if (!form.$valid) {
                window.alert("请完成必填项!");
                return false;
            }
            $http.post("/ovu-park/backstage/property/expenseHouse/manySave", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $uibModalInstance.close({ result: $scope.search });
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 获取收费项目
        function getExpenseList(parkId) {
            $scope.expenseList = [];
            $http.post("/ovu-park/backstage/property/expenseChildType/select", {
                parkId: parkId,
                isUsing: 1
            }, fac.postConfig).success(function (data) {
                $scope.expenseList = data.data;
            })
        }

        //获取分期
        function loadStageListByParkId(parkId) {
            $scope.stageList = [];
            $http.post("/ovu-base/system/park/stageList.do", {
                parkId: parkId
            }, fac.postConfig).success(function (data) {
                $scope.stageList = data.data;
            });
        }
        //获取楼栋
        function loadBuildListByStageId(stageId) {
            $scope.BuildList = [];
            $http.post("/ovu-base/system/parkBuild/getBuilds.do", {
                stageId: stageId
            }, fac.postConfig).success(function (data) {
                $scope.buildList = data;
            });
        }
        //获取单元
        function loadUnitListByBuildId(buildId) {
            $scope.unitList = [];
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                buildId: buildId
            }, fac.postConfig).success(function (data) {
                $scope.unitList = data.data;
            });
        }
        //获取楼层
        function loadGroundListByUnit(buildId, unit) {
            $scope.groundList = [];
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                buildId: buildId,
                unitNo: unit
            }, fac.postConfig).success(function (data) {
                $scope.groundList = data.data;
            });
        }

        app.modulePromiss.then(function () {
            getExpenseList($scope.search.parkId);
            loadStageListByParkId($scope.search.parkId);
        })
    });
    // 选择房屋
    app.controller('chooseHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.search = item;
        $scope.chooseAll = function (status) {
            $scope.houseList.data.forEach((value, index) => {
                value.status = status;
            })
            $scope.isPermit = sureState($scope.houseList.data, 1);
        }
        $scope.chooseOne = function (status, index) {
            $scope.allState = sureState($scope.houseList.data, 2);
            $scope.isPermit = sureState($scope.houseList.data, 1);
        }

        $scope.save = function () {
            let chooseHouse = sureState($scope.houseList.data, 3);
            if (chooseHouse.length === 0) {
                window.alert("请选择房屋!");
                return false;
            }
            $uibModalInstance.close({ houseList: chooseHouse });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //获取房屋
        function loadHouseListByFloorId(params) {
            $scope.groundList = [];
            $http.post("/ovu-base/system/parkHouse/listByGrid", params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    $scope.houseList = resp.data;
                }
            });
        }
        function sureState(data, type) {
            if (type === 1) {
                return data.some(function (value, index) {
                    return value.status;
                })
            } else if (type === 2) {
                return data.every(function (value, index) {
                    return value.status;
                })
            } else if (type === 3) {
                return data.filter(function (value, index) {
                    return value.status;
                })
            }
        }
        app.modulePromiss.then(function () {
            loadHouseListByFloorId($scope.search)
        })
    });


    app.filter("housePlanPurposesType", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '办公用途';
                    break;
                case 2:
                    return '商业用途';
                    break;
                case 3:
                    return '其他';
                    break;
            }
        }
    })


    app.filter("rmCatType", function () {
        return function (status) {
            switch (status) {
                case 'FW10':
                    return '设备房';
                    break;
                case 'FW11':
                    return '办公用房';
                    break;
                case 'FW12':
                    return '住宅用房';
                    break;
                case 'FW13':
                    return '公共用房';
                    break;
                case 'FW14':
                    return '厨房酒店用房';
                    break;
                case 'FW15':
                    return '艺术类用房';
                    break;
                case 'FW16':
                    return '商业用房';
                    break;
                case 'FW17':
                    return '工厂用房';
                    break;
                case 'FW18':
                    return '公共区域';
                    break;
            }
        }
    })

    app.filter("spaceType", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '自持';
                    break;
                case 2:
                    return '已租';
                    break;
                case 3:
                    return '已售';
                    break;
            }
        }
    })

    app.filter("isBaseType", function () {
        return function (status) {
            switch (status) {
                case 0:
                    return '拆合空间';
                    break;
                case 1:
                    return '基础空间';
                    break;
            }
        }
    })

})();
