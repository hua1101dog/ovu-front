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
        //????????????
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
        //????????????
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
        //??????????????????id??????????????????????????????
        $rootScope.getNode = function (node) {
            var ret;
            var flag = false;
            //??????array?????????
            var stack = new Array();
            var nodes = $rootScope.treeData;
            for (let i = 0; i < nodes.length; i++) {
                stack.push(nodes[i]);
            }
            while (stack.length > 0 && !flag) {
                //??????
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
        //?????????
        $scope.loadHouseTree = function () {
            $http.post("/ovu-base/system/parkStage/treeNew", {
                parkId: $scope.search.parkId,
                //level:2
                //?????????????????????????????????????????????????????????
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
                //????????????????????????????????????????????????????????????node??????????????????????????????????????????????????????????????????????????????
                $scope.treeData = treeData;
            });
        };
        // ??????&????????????
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
        // ????????????
        $scope.templateDownload = function () {
            var url = "/ovu-park/backstage/property/expenseBillManage/downLoadExcelModel";
            getBlankTmpl(url, 'payModel');
        }
        // ????????????
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
        // ????????????
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
        // ??????????????????
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
        // ???????????????????????????
        function getNum(Str, isFilter) {
            //??????????????????????????????0??????
            isFilter = isFilter || false;
            if (typeof Str === "string") {
                // var arr = Str.match(/(0\d{2,})|([1-9]\d+)/g);
                //"/[1-9]\d{1,}/g",????????????1???9,????????????????????????(??????????????????).
                //"/\d{2,}/g",  ???????????????????????????????????????????????????
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
    // ??????&????????????
    app.controller('unpaidEditCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.search = item;
        $scope.HOUSE = '';
        if ($scope.search.type === 1) {
            $scope.title = '??????';
            $scope.showName = true;
        } else if ($scope.search.type === 2) {
            $scope.title = '????????????';
            $scope.showName = false;
        }
        //????????????
        $scope.changeStage = function (STAGE) {
            if (null == STAGE) {
                delete $scope.buildList;
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.groundNo;
            } else {
                $scope.search.stageId = STAGE.id;
                loadBuildListByStageId(STAGE.id);//????????????
            }
        }
        //????????????
        $scope.changeBuild = function (BUILD) {
            if (null == BUILD) {
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.groundNo;
            } else {
                $scope.search.buildId = BUILD.id;
                loadUnitListByBuildId(BUILD.id)//????????????
            }
        }
        //????????????
        $scope.changeUnit = function (BUILD, UNITNO) {
            if (null == UNITNO) {
                delete $scope.groundList;
                delete $scope.search.groundNo;
            } else {
                $scope.search.unitNo = UNITNO;
                loadGroundListByUnit(BUILD.id, UNITNO);//????????????
            }
        }
        //????????????
        $scope.changeGround = function (GROUNDNO) {
            if (null == GROUNDNO) {
                $scope.search.house = '';
            } else {
                $scope.search.groundNo = GROUNDNO;
            }
        }
        // ????????????
        $scope.changeHouse = function () {
            if (!$scope.search.stageId) {
                window.alert("???????????????!");
                return false;
            }
            if (!$scope.search.buildId) {
                window.alert("???????????????!");
                return false;
            }
            if (!$scope.search.unitNo) {
                window.alert("???????????????!");
                return false;
            }
            if (!$scope.search.groundNo) {
                window.alert("???????????????!");
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
        // ???????????????????????????
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
        // ??????????????????
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
                window.alert("??????????????????!");
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
        // ??????????????????
        function getExpenseList(houseId, parkId) {
            $scope.expenseList = [];
            $http.post("/ovu-park/backstage/property/expenseHouse/select", {
                houseId: houseId,
                parkId: parkId
            }, fac.postConfig).success(function (data) {
                $scope.expenseList = data.data;
            })
        }
        //????????????
        function loadStageListByParkId(parkId) {
            $scope.stageList = [];
            $http.post("/ovu-base/system/park/stageList.do", {
                parkId: parkId
            }, fac.postConfig).success(function (data) {
                $scope.stageList = data.data;
            });
        }
        //????????????
        function loadBuildListByStageId(stageId) {
            $scope.BuildList = [];
            $http.post("/ovu-base/system/parkBuild/getBuilds.do", {
                stageId: stageId
            }, fac.postConfig).success(function (data) {
                $scope.buildList = data;
            });
        }
        //????????????
        function loadUnitListByBuildId(buildId) {
            $scope.unitList = [];
            $http.post("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                buildId: buildId
            }, fac.postConfig).success(function (data) {
                $scope.unitList = data.data;
            });
        }
        //????????????
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

    // ????????????
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
                window.alert("???????????????!");
                return false;
            }
            $uibModalInstance.close({ houseList: chooseHouse });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //????????????
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
