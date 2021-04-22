(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    window.WdatePicker({
                        onpicked: function () { element.change() },
                        oncleared: function () { element.change() }
                    })
                });
            }
        }
    });
    app.controller('unpaidExpensesManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
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
                getExpenseList($scope.search.parkId);
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
            fac.getPageResult("/ovu-park/backstage/property/expenseBillManage/listByPage", $scope.search, function (data) {
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
                    delete $scope.search.unitNo;
                    delete $scope.search.groundNo;
                }
                else if (node.level === 2) {
                    $scope.search.stageId = node.parentId;
                    $scope.search.buildId = node.id;

                    delete $scope.search.unitNo;
                    delete $scope.search.groundNo;
                }
                else if (node.level === 3) {
                    $scope.search.buildId = node.parentId;
                    $scope.search.unitNo = getNum(node.text)[0];
                    var build = $rootScope.getNode({ id: node.parentId });
                    $scope.search.stageId = build.parentId;

                    delete $scope.search.groundNo;
                }
                else {
                    $scope.search.unitNo = getNum(node.ptext)[0];
                    $scope.search.groundNo = getNum(node.text)[0];
                    var unit = $rootScope.getNode({ id: node.parentId });
                    $scope.search.buildId = unit.parentId;
                    var build = $rootScope.getNode({ id: unit.parentId });
                    $scope.search.stageId = build.parentId;
                }
            } else {
                delete $scope.curNode;
                delete $scope.search.stageId;
                delete $scope.search.buildId;
                delete $scope.search.unitNo;
                delete $scope.search.groundNo;
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
        // 新增&批量新增
        $scope.editUnpaid = function (type) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/propertyCharges/unpaidExpenses/modal.unpaidEdit.html',
                controller: 'unpaidEditCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, { parkId: $scope.search.parkId, type: type });
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 模板下载
        $scope.templateDownload = function () {
            var url = "/ovu-park/backstage/property/expenseBillManage/downLoadExcelModel";
            getBlankTmpl(url, 'payModel');
        }
        // 批量导入
        $scope.batchImport = function () {
            fac.upload({
                url: "/ovu-park/backstage/property/expenseBillManage/importExcel", params: { type: "park", parkId: $scope.search.parkId },
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $scope.find();
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        // 缴费操作
        $scope.getPaid = function (item) {
            if (item.status === 1) {
                return false;
            }
            let params = {
                id: item.id,
                status: 1
            }
            $http.post("/ovu-park/backstage/property/expenseBillManage/paid", params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $scope.find();
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        // 获取收费项目
        function getExpenseList(parkId) {
            console.log(parkId)
            $http.post("/ovu-park/backstage/property/expenseChildType/select", {
                parkId: parkId
            }, fac.postConfig).success(function (data) {
                console.log(data)
                $scope.expenseList = data.data;
            })
        };
        function getBlankTmpl(url, type) {
            var elemIF = document.createElement("iframe");
            elemIF.src = url + "?type=" + type;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        // 提取字符串中的数字
        function getNum(Str, isFilter) {
            //用来判断是否把连续的0去掉
            isFilter = isFilter || false;
            if (typeof Str === "string") {
                // var arr = Str.match(/(0\d{2,})|([1-9]\d+)/g);
                //"/[1-9]\d{1,}/g",表示匹配1到9,一位数以上的数字(不包括一位数).
                //"/\d{2,}/g",  表示匹配至少二个数字至多无穷位数字
                var arr = Str.match(isFilter ? /[1-9]\d{1,}/g : /\d{2,}/g);
                console.log(arr);
                return arr.map(function (item) {
                    return item;
                });
            } else {
                return [];
            }
        }
    });
    // 新增&批量新增
    app.controller('unpaidEditCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.search = item;
        $scope.HOUSE = '';
        if ($scope.search.type === 1) {
            $scope.title = '新增';
            $scope.showName = true;
        } else if ($scope.search.type === 2) {
            $scope.title = '批量新增';
            $scope.showName = false;
        }
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
                size: 'lg',
                templateUrl: '/view/propertyCharges/unpaidExpenses/modal.chooseHouse.html',
                controller: 'houseUnpaidEditCtrl',
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
                $scope.search.houseName = $scope.HOUSE;
                $scope.search.houseIds = houseIds.join();
                if ($scope.search.type === 1) {
                    $scope.search.houseId = houseIds.join();
                    $scope.search.ownerName = data.houseList[0].ownerName;
                    $scope.search.ownerId = data.houseList[0].ownerId;
                }
                getExpenseList($scope.search.houseIds, $scope.search.parkId);
            });
        }
        // 数字输入有效性控制
        $scope.payableChange = function (type) {
            if (type === 1) {
                $scope.search.payable = $scope.search.payable.toFixed(2);
                $scope.search.payable = Number($scope.search.payable);
            } else if (type === 2) {
                $scope.search.preFlow = $scope.search.preFlow.toFixed(2);
                $scope.search.preFlow = Number($scope.search.preFlow);
            } else if (type === 3) {
                $scope.search.nowFlow = $scope.search.nowFlow.toFixed(2);
                $scope.search.nowFlow = Number($scope.search.nowFlow);
            }
        }
        // 收费项目编码
        $scope.changeExpense = function (expenseChild) {
            if (null == expenseChild) {
                delete $scope.search.expenseChildId;
                delete $scope.search.payType;
                delete $scope.search.taxRate;
            } else {
                $scope.search.expenseChildId = expenseChild.id;
                $scope.search.payType = expenseChild.payType;
                $scope.search.taxRate = expenseChild.taxRate;
            }
        }
        $scope.save = function (form) {
            let url = '';
            if (!form.$valid) {
                window.alert("请完成必填项!");
                return false;
            }
            if ($scope.search.type === 1) {
                url = "/ovu-park/backstage/property/expenseBillManage/saveOrEdit";
            } else if ($scope.search.type === 2) {
                url = "/ovu-park/backstage/property/expenseBillManage/manySave";
            }
            $http.post(url, $scope.search, fac.postConfig).success(function (resp) {
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
        };
        // 获取收费项目
        function getExpenseList(houseId, parkId) {
            $scope.expenseList = [];
            $http.post("/ovu-park/backstage/property/expenseHouse/select", {
                houseId: houseId,
                parkId: parkId
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
            loadStageListByParkId($scope.search.parkId);
        })
    });

    // 选择房屋
    app.controller('houseUnpaidEditCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.search = item;
        $scope.type = $scope.search.type;
        $scope.chooseAll = function (status) {
            $scope.houseList.data.forEach((value, index) => {
                value.status = status;
            })
            $scope.isPermit = sureState($scope.houseList.data, 1);
        }
        $scope.chooseOne = function (status, index) {
            if ($scope.type === 1) {
                $scope.houseList.data.forEach((v, i) => {
                    if (i !== index) {
                        v.status = false;
                    }
                })
            } else if ($scope.type === 2) {
                $scope.search.allState = sureState($scope.houseList.data, 2);
                $scope.isPermit = sureState($scope.houseList.data, 1);
            }
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
        function loadHouseListByFloorId(param) {
            let params = {
                parkId: param.parkId,
                stageId: param.stageId,
                buildId: param.buildId,
                unitNo: param.unitNo,
                groundNo: param.groundNo
            }
            $scope.groundList = [];
            $http.post("/ovu-park/backstage/property/expenseBillManage/getEnter", params, fac.postConfig).success(function (resp) {
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
})()
