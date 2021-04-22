(function () {
    var app = angular.module("angularApp");
    app.controller('publishPriceCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-发布管理";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.sellOptions = [{
            'name': '租赁',
            'value': 1
        }, {
            'name': '招商',
            'value': 2
        }, {
            'name': '租售',
            'value': 3
        }];
        fac.loadSelect($scope, "HOUSE_TYPE");
        // $scope.housePlanPurposesTypeList = [{
        //     'text': '办公用途',
        //     'id': 1
        // }, {
        //     'text': '商业用途',
        //     'id': 2
        // }, {
        //     'text': '工业用途',
        //     'id': 4
        // }, {
        //     'text': '停车位用途',
        //     'id': 5
        // }];

        //户规划用途
        $scope.spacePropertyList = [];
        $scope.initSpace = function () {
            $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {
                console.log(response)
                if (response.status == 200) {
                    $scope.spaceRentList = response.data;
                    $scope.spaceRentListCopy = angular.copy($scope.spaceRentList);
                    $scope.spaceRentListCopy.forEach((v, i) => {
                        if (v.code == 1) {
                            $scope.planPurposeList = v.nodes;
                            angular.forEach(v.nodes, function (item) {
                                angular.forEach(item.nodes, function (item1) {
                                    $scope.spacePropertyList.push(item1);
                                })
                            })
                        }
                    })
                    $scope.planPurposeListCopy = angular.copy($scope.planPurposeList);
                }
            })
        }
        $scope.initSpace();

        //获取物业名称
        $scope.getSpacePropertyName = function (params) {
            let name;
            $scope.spacePropertyList.forEach((v, i) => {
                if (v.dicCode == params) {
                    name = v.dicItem;
                }
            })
            return name;
        }


        // 选择户规划用途
        $scope.planPurposeChange = function (params) {
            console.log(params);
            if (params) {
                $scope.planPurposeListCopy.forEach((v, i) => {
                    if (v.code == params) {
                        $scope.propertyClassifyList = v.nodes;
                    }
                })
            } else {
                $scope.propertyClassifyList = [];
            }
        }





        $scope.isShow = true;
        $scope.isDisabled = false;
        $scope.isPublishAll = true;
        $scope.search.approveStatus = -3;
        $scope.isBackStatus = false;
        // $scope.search.rmCats = 'FW11,FW12,FW16';
        $scope.find = function (pageNo) {
            if (!app.park || !app.park.parkId) {
                window.msg("请先选择一个项目!");
                return false;
            }
            $scope.search.parkId = app.park.parkId;

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            $scope.search.isSperated = 0;
            if (!$scope.search.sellStatus) {
                $scope.search.sellStatus = -1;
            }
            $scope.search.rentsaleCharacter = 1;
            fac.getPageResult("/ovu-base/system/parkHouse/listByGrid", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.publishByTab = function (event, type) {
            $scope.isShow = true;
            $(".div-panel").removeClass("div-active");
            $(event.target).addClass("div-active");
            $scope.search = {};
            delete $scope.pageModel.currentPage;
            delete $scope.stageList;
            delete $scope.buildList;
            delete $scope.unitList;
            delete $scope.groundList;
            delete $scope.STAGE;
            delete $scope.BUILD;
            delete $scope.UNITNO;
            delete $scope.GROUNDNO;
            delete $scope.search.houseNo;
            delete $scope.search.approveStatus;
            // delete $scope.search.rmCats;
            if ('publishNo' == type) {
                $scope.isPublishAll = true;
                $scope.search.approveStatus = -3
                $scope.isBackStatus = false;
            } else if ('publishAl' == type) {
                $scope.isPublishAll = false;
                $scope.isShow = true;
                $scope.search.approveStatus = 1
                $scope.isBackStatus = true;
            } else if ('publishAbb' == type) {
                $scope.isPublishAll = false;
                $scope.isShow = false;
                $scope.search.approveStatus = 0
                $scope.isBackStatus = false;
            } else if ('back' == type) {
                $scope.isPublishAll = false;
                $scope.isShow = false;
                $scope.search.approveStatus = 2
                $scope.isBackStatus = false;
            } else {
                $scope.isPublishAll = false;
                $scope.isShow = false;
                $scope.search.approveStatus = ''
                $scope.isBackStatus = false;
            }
            loadStageListByParkId($scope.dept.parkId);
            // $scope.search.rmCats = 'FW11,FW12,FW16';
            $scope.find();
        }

        //	      对于对象进行操作的时候(点击)，会执行funcChange  
        //	      判断对象数组中isSelected 是否为 true或false，在决定select是否为true  
        // $scope.changeAll = function (selectAll) { //全选/取消全选  
        //     angular.forEach($scope.pageModel.data, function (v, k) {
        //         v.isSelected = $scope.selectAll;
        //     })
        // };

        // $scope.funcChange = function (isSelected) {
        //     $scope.select = true;
        //     angular.forEach($scope.pageModel.data, function (v, k) {
        //         $scope.select = $scope.select && v.isSelected;
        //     });

        // };

        //全选
        $scope.checkAll = function () {
            $scope.pageModel.checked = !$scope.pageModel.checked;
            if ($scope.pageModel.checked) {
                $scope.pageModel.list.forEach(function (n) {
                    n.checked = $scope.pageModel.checked
                    $scope.selCountMoney += n.contractAmount;
                });
                $scope.selCount = $scope.pageModel.list.length;

            } else {
                $scope.pageModel.list.forEach(function (n) {
                    n.checked = $scope.pageModel.checked

                });
                $scope.selCountMoney = 0
                $scope.selCount = 0;
            }

        }
        //单选
        $scope.checkOne = function (item) {
            item.checked = !item.checked;
            if ($scope.pageModel && $scope.pageModel.list) {
                $scope.pageModel.checked = $scope.pageModel.list.every(function (v) {
                    return v.checked;
                });
            }
            if (item.checked) {
                $scope.selCountMoney += item.contractAmount;
                $scope.selCount++;
            } else {
                $scope.selCountMoney -= item.contractAmount;
                $scope.selCount--;
            }
        }

        //选择分期
        $scope.changeStage = function (STAGE) {
            if (null == STAGE) {
                delete $scope.floorList;
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.stageId;
            } else {
                $scope.search.stageId = STAGE.id;
                loadFloorListByStageId(STAGE.id); //获得楼栋
            }
            $scope.find();

        }
        //选择楼栋
        $scope.changeBuild = function (BUILD) {
            if (null == BUILD) {
                delete $scope.unitList;
                delete $scope.groundList;
                delete $scope.search.buildId;
            } else {
                $scope.search.buildId = BUILD.id;
                loadUnitListByBuildId(BUILD.id) //获得单元
            }
            $scope.find();

        }
        //选择单元
        $scope.changeUnit = function (BUILD, UNITNO) {
            if (null == UNITNO) {
                delete $scope.groundList;
                delete $scope.search.unitId;
            } else {
                $scope.search.unitNo = UNITNO;
                loadGroundListByFloorId(BUILD.id, UNITNO); //获得楼层
            }
            $scope.find();

        }
        //选择楼层
        $scope.changeGround = function (GROUNDNO) {
            $scope.search.groundNo = GROUNDNO;

            $scope.find();
        }
        //批量发布
        $scope.batchPublishPrice = function () {
            var buf = [];
            var business = [];
            angular.forEach($scope.pageModel.data, function (value, key) {
                if (value.checked) {
                    buf.push(value.id);
                    if (value.sellStatus === 2 || value.sellStatus === 3) {
                        business.push(value.id);
                    }
                }
            });
            $scope.publishAll(buf.join(","), business.join(","));

        }
        $scope.publishAll = function (ids, list) {
            confirm("确认发布房屋信息吗?", function () {
                var param = {
                    approveStatus: 1,
                    houseIds: ids
                }
                $.post("/ovu-base/system/parkHouse/updateApproveStatusBath", param, function (data) {
                    if (data.code == 0) {
                        if (list.length > 0) {
                            $.post("/ovu-park/backstage/sale/saleparkhouse/add", {
                                "houseIds": list
                            }, function (data) {
                                if (data.code == 0) {
                                    window.msg(data.msg)
                                    $scope.find();
                                }
                            });
                        } else {
                            window.msg(data.msg);
                            $scope.find();
                        }
                        $scope.selectAll = false;
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }

        $scope.changeSellStatus = function () {
            $scope.find();
        }
        //发布
        $scope.publishPrice = function (status, item) {
            var msg;
            if (status == 0) {
                msg = "确认驳回房屋招商策略吗?";
            } else {
                msg = "确认发布房屋招商策略吗?";
            }
            confirm(msg, function () {
                var param = {
                    approveStatus: status,
                    id: item.id
                }
                console.log(item)
                if (status == 1) {
                    try {
                        let houseName = encodeURIComponent(item.houseName)
                        $.get(`/ovu-park/enterprise/service/event/receiveSpaceEvent?sellStatus=${item.sellStatus}&parkId=${item.parkId}&spaceName=${houseName}`,function(res) {
                            console.log(res)
                        })
                    } catch (error) {

                    }
                }
                $.post("/ovu-base/system/parkHouse/updateApproveStatus", param, function (data) {
                    if (data.code == 0) {
                        //若是招商且发布，则需要调用接口将数据写入到招商系统
                        if (status === 1 && (item.sellStatus === 2 || item.sellStatus === 3)) {
                            var param1 = {
                                houseIds: item.id
                            }
                            $.post("/ovu-park/backstage/sale/saleparkhouse/add", param1, function (data) {
                                if (data.code == 0) {
                                    if (($scope.pageModel.data.length == 1 || $scope.select) && $scope.pageModel.currentPage > 1) {
                                        $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                                    }
                                    window.msg(data.msg)
                                    $scope.find();
                                }
                            });
                        } else {
                            window.msg(data.msg);
                            $scope.find();
                        }
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }

        $scope.getBackeHouse = function (item) {
            confirm("确认收回空间吗?", function () {
                var param = {
                    houseIds: item.id
                }
                $.post("/ovu-park/backstage/parkHouse/getBackHouse", param, function (data) {
                    if (data.code == 0) {
                        window.msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                });
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
        function loadFloorListByStageId(stageId) {
            $scope.BuildList = [];
            $http.post("/ovu-base/system/parkBuild/getBuilds.do", {
                stageId: stageId
            }, fac.postConfig).success(function (data) {
                $scope.BuildList = data;
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
        function loadGroundListByFloorId(buildId, unit) {
            $scope.groundList = [];
            $http.post("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                buildId: buildId,
                unitNo: unit
            }, fac.postConfig).success(function (data) {
                $scope.groundList = data.data;
            });
        }

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                loadStageListByParkId($scope.dept.parkId);

                $scope.find();
            })
        });
    });
    app.filter("rmCatType2", function () {
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

    app.filter("spaceType2", function () {
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
    app.filter("approveType", function () {
        return function (status) {
            status += '';
            switch (status) {
                case '0':
                    return '驳回';
                    break;
                case '1':
                    return '通过 ';
                    break;
                case '2':
                    return '已回收 ';
                    break;
                case '':
                    return '待发布';
                    break;
            }
        }
    })

    app.filter("housePlanPurposesType2", function () {
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
                case 4:
                    return '工业用途';
                    break;
                case 5:
                    return '停车位用途';
                    break;
            }
        }
    })

})()
