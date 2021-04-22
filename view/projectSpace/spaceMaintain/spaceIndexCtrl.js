/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('spaceIndexCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $state, $location) {
        document.title = "OVU-空间维护";
        $scope.pageModel = {};
        $scope.config = {
            edit: false
        };
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
                            $http.post("/ovu-base/system/park/getWithPath", {
                                ids: $scope.search.parkId
                            }, fac.postConfig).success(function (resp) {
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
            fac.getPageResult("/ovu-base/system/parkHouse/listByGrid", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.spacePropertyList = [];
        $scope.initSpace = function () {
            $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    $scope.spaceRentList = response.data;
                    $scope.spaceRentListCopy = angular.copy($scope.spaceRentList);
                    $scope.spaceRentListCopy.forEach((v, i) => {
                        angular.forEach(v.nodes, function (item) {
                            angular.forEach(item.nodes, function (item1) {
                                $scope.spacePropertyList.push(item1);
                            })
                        })
                    })
                    console.log("$scope.spacePropertyList",$scope.spacePropertyList)
                }
            })
        };
        $scope.initSpace();

        // 选择空间租售性质
        $scope.spaceRentChange = function (params) {
            console.log(params);
            if (params) {
                $scope.spaceRentListCopy.forEach((v, i) => {
                    if (v.code == params) {
                        $scope.planPurposeList = v.nodes;
                    }
                });
                $scope.planPurposeListCopy = angular.copy($scope.planPurposeList);
            } else {
                $scope.planPurposeList = [];
                $scope.propertyClassifyList = [];
            }
        };

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
        };

        //获取物业名称
        $scope.getSpacePropertyName = function (params) {
            let name;
            $scope.spacePropertyList.forEach((v, i) => {
                if (v.dicCode == params) {
                    name = v.dicItem;
                }
            });
            return name;
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
                } else if (node.level === 2) {
                    $scope.search.stageId = node.parentId;
                    $scope.search.buildId = node.id;

                    delete $scope.search.unitId;
                    delete $scope.search.floorId;
                } else if (node.level === 3) {
                    $scope.search.buildId = node.parentId;
                    $scope.search.unitId = node.id;
                    var build = $rootScope.getNode({
                        id: node.parentId
                    });
                    $scope.search.stageId = build.parentId;

                    delete $scope.search.floorId;
                } else {
                    $scope.search.unitId = node.parentId;
                    $scope.search.floorId = node.id;
                    var unit = $rootScope.getNode({
                        id: node.parentId
                    });
                    $scope.search.buildId = unit.parentId;
                    var build = $rootScope.getNode({
                        id: unit.parentId
                    });
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
        };
        //在只知道节点id下，获取节点完整信息
        $rootScope.getNode = function (node) {
            var ret;
            var flag = false;
            //使用array模拟栈
            var stack = [];
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
        };

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
        //去详情页面/ovu-base/system/parkHouse/spaceInfo.do
        $scope.goDetail = function (param) {
            //$location.url('/projectSpace/spaceDetail/spaceDetail')
            /*$location.search({
                id: param.id,
                isSperated: param.isSperated,
                rmCats: param.rmCats
            });*/
            $scope.searchCondition = {
                id: param.id,
                isSperated: param.isSperated,
                rmCats: param.rmCats,
                spacePropertyList: $scope.spacePropertyList
            };
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/projectSpace/spaceDetail/spaceDetail.html',
                controller: 'spaceInfoCtl',
                resolve: {
                    searchCondition: $scope.searchCondition
                }
            });
        };
        //拆合信息界面
        $scope.goSeparateMergeSpace = function (param) {
            $scope.searchCondition = {
                id: param.id,
                isSperated: param.isSperated,
                rmCats: param.rmCats
            };
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/projectSpace/spaceMaintain/model.separateMerge.html',
                controller: 'separateMergeCtl',
                resolve: {
                    searchCondition: $scope.searchCondition
                }
            });
        };


        //上传项目信息
        $scope.uploadSpaceInfo = function (item) {

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/projectSpace/spaceMaintain/modal.projInfo.html',
                controller: 'projInfoCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {});
        };


        //合并
        $scope.mergeSpace = function () {
            var spaceList = $scope.pageModel.list.filter(function (n) {
                return n.checked
            });
            var ids = [];
            angular.forEach(spaceList, function (space) {
                ids.push(space.id);
            });

            var params = {
                action: 'merge',
                houseIds: ids.join(",")
                // isSperated: 0,
                // rentsaleCharacter: 1
            };
            $http.post('/ovu-base/system/parkHouse/validateIsAble', params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var flag = true;
                    angular.forEach(spaceList, function (space, item) {
                        $scope.staffSearch = {
                            "houseId": space.id
                        };
                        fac.getPageResult("/ovu-park/backstage/position/queryPageWithStaff", $scope.staffSearch, function (resp) {
                            if (resp && resp.data.length > 0) {
                                alert("当前空间【" + space.houseName + "】下有工位，合并前请先解绑所有工位!");
                                flag = false;
                            }
                        });
                        //循环到最后一个
                        if (item == spaceList.length - 1) {
                            if (flag) {
                                $rootScope.target('projectSpace/sapceMerge/sapceMerge', "空间合并", false, ' ', params,"projectSpace/sapceMerge/sapceMerge");
                            }
                        }
                    });

                } else {
                    alert(resp.msg);
                }

            });

        };
        //拆分
        $scope.separate = function (obj) {
            if (!obj.recordNumber || obj.recordNumber == '') {
                alert("该空间没有备案号，请先维护备案号！");
                return;
            }
            var obj2 = {
                houseId: obj.id,
                //isSperated: 0,
                rmCats: obj.rmCat
            };
            $http.post('/ovu-base/system/parkHouse/getForSeperate', obj2, fac.postConfig).success(function (resp) {
                if (resp.code == 0){
                    $scope.staffSearch = {
                        "houseId": obj.id
                    };
                    fac.getPageResult("/ovu-park/backstage/position/queryPageWithStaff", $scope.staffSearch, function (data) {
                        $scope.staffModel = data;
                        if ($scope.staffModel && $scope.staffModel.data.length > 0) {
                            alert("当前空间【" + obj.houseName + "】下有工位，拆分前请先解绑所有工位!");
                        } else {
                            $rootScope.target('projectSpace/spaceSeparate/spaceSeparate', "空间拆分", false, '', {
                                houseId: obj.id,
                                rmCat: obj.rmCat
                            },"projectSpace/spaceSeparate/spaceSeparate");
                        }
                    });
                }else{
                    alert(resp.msg)
                    return
                }
            });
            
            

        };
        // 复核
        $scope.check = function (id, status, $event) {
            var param = {};
            param.curHouseCheck = status;
            param.houseId = id;
            param.userId = app.user.ID;

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/projectSpace/spaceMaintain/spaceCheckDetail.html',
                controller: 'spaceCheckCtl',
                resolve: {
                    house: param
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {});

            /* var param = {};
             param.curHouseCheck = status;
             param.houseId = id;
             param.isThrough = isThrough;
             param.userId = app.user.ID;
             $http.post('/ovu-base/system/parkHouse/checkHouseSperate', param, fac.postConfig).success(function (resp) {
                 if (resp.code==0) {
                     $scope.find();
                 } else {
                     alert(resp.msg);
                 }
             });*/
        };
        //获取工位
        $scope.getPositon = function (item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/projectSpace/spaceMaintain/modal.positionDetail.html',
                controller: 'positionDetailCtrl',
                resolve: {
                    data: copy
                }
            });
            modal.result.then(function (data) {
                $scope.find(1);
            });
        }

    });

    app.controller('positionDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        //获取工位列表
        $scope.search = {};
        $scope.pageModel = {};
        $scope.detail = {};
        $scope.houseName = data.houseName;
        //获取工位列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                houseId: data.id

            });
            fac.getPageResult("/ovu-park/backstage/position/queryPageWithStaff", $scope.search, function (data) {
                $scope.pageModel = data;
                if ($scope.pageModel && $scope.pageModel.data.length > 0) {
                    $scope.positionId = $scope.pageModel.data[0].id;
                    $scope.findDetail(1, $scope.pageModel.data[0].id);
                }
            });
        };
        $scope.find(1);

        $scope.show = function (item) {
            $scope.findDetail(1, item.id);
        };
        //查看详情
        $scope.findDetail = function (pageNo, id) {
            $.extend($scope.detail, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                positionId: id

            });
            fac.getPageResult("/ovu-park/backstage/position/getStaffByPositionId", $scope.detail, function (data) {
                $scope.bindList = data;
                $scope.bindList.currentPage = $scope.bindList.pageIndex + 1;
                $scope.bindList.totalPage = $scope.bindList.pageTotal;
                $scope.detail.totalCount = $scope.bindList.totalRecord = $scope.bindList.totalCount;
                if ($scope.bindList.data && $scope.bindList.data.length >= 0) {
                    $scope.bindList.list = $scope.bindList.data;
                }
                var pages = [];
                var hash = {};
                var list = [1, $scope.detail.currentPage - 1, $scope.detail.currentPage, $scope.detail.currentPage + 1, $scope.bindList.pageTotal];
                list.forEach(function (v) {
                    if (!hash[v] && v <= $scope.bindList.pageTotal && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                });
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf($scope.bindList.pageTotal - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.bindList.pages = pages;
            });
        };

        //解绑
        $scope.unbind = function (item) {
            confirm('确认解除【' + item.staff.name + '】使用【' + item.name + '】吗？', function () {
                $http.post("/ovu-park/backstage/position/unbindStaff", {
                    positionId: item.id,
                    staffId: item.staff.id
                }, fac.postConfig).success(function (data) {
                    if (data.code == 0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            });
        };


        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
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
                    return '其他用途';
                    break;
                case 4:
                    return '工业用途';
                    break;
                case 5:
                    return '停车位用途';
                    break;
            }
        }
    });



    
// 房屋类别
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
    });

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
    });

    app.filter("spaceSellType", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '租赁';
                    break;
                case 2:
                    return '招商';
                    break;
                case 3:
                    return '租售';
                    break;
            }
        }
    });

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
    });
    app.controller('projInfoCtrl', function ($state, $stateParams, $scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, item) {


        $scope.params = {};

        $scope.pics0 = [];

        $http.get('/ovu-base/system/parkHouse/getHouseDetail?id=' + item.id).success(function (resp) {
            if (resp.code === 0) {
                if (resp.data) {
                    $scope.params = resp.data;
                    if ($scope.params.createTime)
                        delete $scope.params.createTime;
                    if ($scope.params.updateTime)
                        delete $scope.params.updateTime;
                    if ($scope.params.houseImg)
                        $scope.pics0 = $scope.params.houseImg.split(',')
                }
            } else {
                alert(resp.msg)
            }
        });


        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if ($scope.pics0.length > 0)
                $scope.params.houseImg = $scope.pics0.join(',');
            else
                $scope.params.houseImg = '';

            $scope.params.id = item.id;
            $scope.params.parkId = app.park.parkId;

            console.log($scope.params);

            $http.post('/ovu-base/system/parkHouse/saveHouseDetail', $scope.params, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    msg(resp.msg);
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg)
                }
            })

        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }


    });


    app.controller('spaceInfoCtl', function ($state, $stateParams, $scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, $location, searchCondition) {

        /* var obj = {
             id: $location.search().id,
             isSperated: $location.search().isSperated,
             rmCats: $location.search().rmCats
         };*/

        $scope.getSpacePropertyName = function (params) {
            let name;
            searchCondition.spacePropertyList.forEach((v, i) => {
                if (v.dicCode == params) {
                    name = v.dicItem;
                }
            });
            return name;
        };

        var obj = {
            id: searchCondition.id,
            isSperated: searchCondition.isSperated,
            rmCats: searchCondition.rmCats
        };

        $http.post('/ovu-base/system/parkHouse/getHouseUnionDetailInfo', obj, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.spaceDetail = resp.data;

                $scope.getPriceUnit = function (item) {
                    // status-2:已发布 sellStatus-1:待租 2:待售
                    if (!item.price) {
                        return "待定价"
                    } else {
                        if (item.status == 2 && item.sellStatus == 1) {
                            return "￥" + item.price + "元/天/平米";
                        } else if (item.status == 2 && item.sellStatus == 2) {
                            return "￥" + item.price + "元/平米";
                        }

                    }
                };
                $scope.getHouseTotalPrice = function (item) {
                    if (!item.price) {
                        return "待定价"
                    } else {
                        if (item.status == 2 && item.sellStatus == 1) {
                            return "￥" + item.price * item.area + "元/天";
                        } else if (item.status == 2 && item.sellStatus == 2) {
                            return "￥" + item.price * item.area + "元";
                        }

                    }
                }
            }
        });

        // 回到空间维修主页面
        $scope.goSpace = function () {

            $location.url('/projectSpace/spaceMaintain/spaceIndex')
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        /**
         装修类型
         */
        $scope.getDecorateType = function (decoration) {
            var str = ""; //0-毛坯,1-简装,2-精装
            if (decoration == "0") {
                str = "毛坯";
            } else if (decoration == "1") {
                str = "简装";
            } else if (decoration == "2") {
                str = "精装";
            }
            return str;
        };

        /**
         空间类型
         0-写字楼 1-商铺 2-共享办公 3-开放办公 4-住宅 5-停车场
         */
        $scope.getHouseType = function (houseType) {
            var str = "";
            if (houseType == 0) {
                str = "写字楼";
            } else if (houseType == 1) {
                str = "商铺";
            } else if (houseType == 2) {
                str = "共享办公";
            } else if (houseType == 3) {
                str = "开放办公";
            } else if (houseType == 4) {
                str = "住宅";
            } else if (houseType == 5) {
                str = "停车场";
            }
            return str;
        };


        /**
         1-工位 2-车位
         获得空间类型
         */
        $scope.getType = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "工位";
            } else if (actionFrom == 2) {
                str = "车位";
            }
            return str;
        };


        /**
         1-自持 2-已租  3-已售
         获得空间状态
         */
        $scope.getSpaceStatus = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "自持";
            } else if (actionFrom == 2) {
                str = "已租";
            } else if (actionFrom == 3) {
                str = "已售";
            }
            return str;
        };

        /**
         1-空置 2-已租
         获得业务状态
         */
        $scope.getBusinessStatus = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "空置";
            } else if (actionFrom == 2) {
                str = "已租";
            }
            return str;
        };

        /**
         得到房屋的朝向
         */
        $scope.getHouseDirection = function (param) {
            var str;
            if (param == 1) {
                str = "东";
            } else if (param == 2) {
                str = "南";
            } else if (param == 3) {
                str = "西";
            } else if (param == 4) {
                str = "北";
            } else if (param == 5) {
                str = "东南";
            } else if (param == 6) {
                str = "西南";
            } else if (param == 7) {
                str = "东北";
            } else if (param == 8) {
                str = "西北";
            } else {
                str = "";
            }
            return str;
        };

        /**
         得到户型
         [{"text":"三室两厅","value":"1"},{"text":"一室一厅","value":"2"},{"text":"两室一厅","value":"3"}]
         */
        $scope.getHouseTheme = function (houseTheme) {
            var str;
            if (houseTheme == 1) {
                str = "三室两厅";
            } else if (houseTheme == 2) {
                str = "一室一厅";
            } else if (houseTheme == 3) {
                str = "两室一厅";
            }
            return str;
        };

        /**
         获取是否是设备房
         1是 2否
         */
        $scope.getIsEquip = function (equipType) {
            var str;
            if (1 == equipType) {
                str = "是";
            } else if (2 == equipType) {
                str = "否";
            }
            return str;
        };

        /**
         获取面积单位
         */
        $scope.getAreaUnit = function (area) {
            if (area || area == 0) {
                return area + "㎡";
            } else {
                return 0;
            }
        };

        // 获取预售公摊面积
        $scope.areaPresellChargable = function (area, areaSu) {
            if (!area || !areaSu) {
                return '--';
            }
            let char = area-areaSu;
            if (char<0) {
                return '--';
            }
            char = char.toFixed(2);
            return char+'㎡';
        }


        /**
         获取文件类型
         1-建筑 2-电气 3-弱电 4-给排水 5-暖通空调 6-装修 7-BIM 8-室内地图 9-房屋平面图
         */
        $scope.getFileType = function (fileType) {
            var str = "";
            if (fileType == 1) {
                str = "建筑";
            } else if (fileType == 2) {
                str = "电气";
            } else if (fileType == 3) {
                str = "弱电";
            } else if (fileType == 4) {
                str = "给排水";
            } else if (fileType == 5) {
                str = "暖通空调";
            } else if (fileType == 6) {
                str = "装修";
            } else if (fileType == 7) {
                str = "BIM";
            } else if (fileType == 8) {
                str = "室内地图";
            } else if (fileType == 9) {
                str = "房屋平面图";
            }
            return str;
        }

    });

    app.controller('separateMergeCtl', function ($state, $stateParams, $scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, $location, searchCondition) {

        var obj = {
            id: searchCondition.id,
        };

        $http.post('/ovu-base/system/parkHouse/getParentHouseInfo', obj, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.parentHouseList = resp.data;
            } else {
                alert(resp.msg);
                $scope.cancel();
            }
        });


        $scope.getPriceUnit = function (item) {
            // status-2:已发布 sellStatus-1:待租 2:待售
            if (!item.price) {
                return "待定价"
            } else {
                if (item.status == 2 && item.sellStatus == 1) {
                    return "￥" + item.price + "元/天/平米";
                } else if (item.status == 2 && item.sellStatus == 2) {
                    return "￥" + item.price + "元/平米";
                }

            }
        };
        $scope.getHouseTotalPrice = function (item) {
            if (!item.price) {
                return "待定价"
            } else {
                if (item.status == 2 && item.sellStatus == 1) {
                    return "￥" + item.price * item.area + "元/天";
                } else if (item.status == 2 && item.sellStatus == 2) {
                    return "￥" + item.price * item.area + "元";
                }

            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        /**
         装修类型
         */
        $scope.getDecorateType = function (decoration) {
            var str = ""; //0-毛坯,1-简装,2-精装
            if (decoration == "0") {
                str = "毛坯";
            } else if (decoration == "1") {
                str = "简装";
            } else if (decoration == "2") {
                str = "精装";
            }
            return str;
        };

        /**
         空间类型
         0-写字楼 1-商铺 2-共享办公 3-开放办公 4-住宅 5-停车场
         */
        $scope.getHouseType = function (houseType) {
            var str = "";
            if (houseType == 0) {
                str = "写字楼";
            } else if (houseType == 1) {
                str = "商铺";
            } else if (houseType == 2) {
                str = "共享办公";
            } else if (houseType == 3) {
                str = "开放办公";
            } else if (houseType == 4) {
                str = "住宅";
            } else if (houseType == 5) {
                str = "停车场";
            }
            return str;
        };


        /**
         1-工位 2-车位
         获得空间类型
         */
        $scope.getType = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "工位";
            } else if (actionFrom == 2) {
                str = "车位";
            }
            return str;
        };


        /**
         1-自持 2-已租  3-已售
         获得空间状态
         */
        $scope.getSpaceStatus = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "自持";
            } else if (actionFrom == 2) {
                str = "已租";
            } else if (actionFrom == 3) {
                str = "已售";
            }
            return str;
        };

        /**
         1-空置 2-已租
         获得业务状态
         */
        $scope.getBusinessStatus = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "空置";
            } else if (actionFrom == 2) {
                str = "已租";
            }
            return str;
        };

        /**
         得到房屋的朝向
         */
        $scope.getHouseDirection = function (param) {
            var str;
            if (param == 1) {
                str = "东";
            } else if (param == 2) {
                str = "南";
            } else if (param == 3) {
                str = "西";
            } else if (param == 4) {
                str = "北";
            } else if (param == 5) {
                str = "东南";
            } else if (param == 6) {
                str = "西南";
            } else if (param == 7) {
                str = "东北";
            } else if (param == 8) {
                str = "西北";
            } else {
                str = "";
            }
            return str;
        };

        /**
         得到户型
         [{"text":"三室两厅","value":"1"},{"text":"一室一厅","value":"2"},{"text":"两室一厅","value":"3"}]
         */
        $scope.getHouseTheme = function (houseTheme) {
            var str;
            if (houseTheme == 1) {
                str = "三室两厅";
            } else if (houseTheme == 2) {
                str = "一室一厅";
            } else if (houseTheme == 3) {
                str = "两室一厅";
            }
            return str;
        };

        /**
         获取是否是设备房
         1是 2否
         */
        $scope.getIsEquip = function (equipType) {
            var str;
            if (1 == equipType) {
                str = "是";
            } else if (2 == equipType) {
                str = "否";
            }
            return str;
        };

        /**
         获取面积单位
         */
        $scope.getAreaUnit = function (area) {
            if (area) {
                return area + "㎡";
            }
        };


        /**
         获取文件类型
         1-建筑 2-电气 3-弱电 4-给排水 5-暖通空调 6-装修 7-BIM 8-室内地图 9-房屋平面图
         */
        $scope.getFileType = function (fileType) {
            var str = "";
            if (fileType == 1) {
                str = "建筑";
            } else if (fileType == 2) {
                str = "电气";
            } else if (fileType == 3) {
                str = "弱电";
            } else if (fileType == 4) {
                str = "给排水";
            } else if (fileType == 5) {
                str = "暖通空调";
            } else if (fileType == 6) {
                str = "装修";
            } else if (fileType == 7) {
                str = "BIM";
            } else if (fileType == 8) {
                str = "室内地图";
            } else if (fileType == 9) {
                str = "房屋平面图";
            }
            return str;
        }

    });


    app.controller('detailCtrl', function ($scope, $uibModalInstance, data) {
        $scope.item = data;
        switch ($scope.item.customer.sTATUS) {
            case 1:
                $scope.item.customer.sTATUS = "拟注册";
                break;
            case 2:
                $scope.item.customer.sTATUS = "存续";
                break;
            case 3:
                $scope.item.customer.sTATUS = "在业";
                break;
            case 4:
                $scope.item.customer.sTATUS = "吊销";
                break;
            case 5:
                $scope.item.customer.sTATUS = "注销";
                break;
            case 6:
                $scope.item.customer.sTATUS = "迁出";
                break;
            case 7:
                $scope.item.customer.sTATUS = "迁入";
                break;
            case 8:
                $scope.item.customer.sTATUS = "停业";
                break;
            case 9:
                $scope.item.customer.sTATUS = "结算";
                break;
        }
        switch ($scope.item.customer.sIZE) {
            case 1:
                $scope.item.customer.sIZE = "50人以内";
                break;
            case 2:
                $scope.item.customer.sIZE = "50-100";
                break;
            case 3:
                $scope.item.customer.sIZE = "100-300";
                break;
            case 4:
                $scope.item.customer.sIZE = "300-500";
                break;
            case 5:
                $scope.item.customer.sIZE = "500-1000";
                break;
            case 6:
                $scope.item.customer.sIZE = "1000以上";
                break;
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('spaceCheckCtl', function ($state, $stateParams, $scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, $location, house) {

        $scope.orgHouseList = [];
        $scope.newHouseList = [];
        var obj = {
            houseId: house.houseId
        };
        $http.post('/ovu-base/system/parkHouse/previewSeperate', obj, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.operateType = resp.data.operateType;
                angular.forEach(resp.data.orgHouseList, function (item) {
                    var house = item;
                    house.isEmtHouse = $scope.getIsEquip(item.isEmtHouse);
                    house.rmCat = $scope.getHouseType(item.rmCat);
                    house.isDecoration = $scope.getDecorateType(item.isDecoration);
                    $scope.orgHouseList.push(house);
                });
                angular.forEach(resp.data.newHouseList, function (item) {
                    var house = item;
                    house.isEmtHouse = $scope.getIsEquip(item.isEmtHouse);
                    //house.rmCat = $scope.getHouseType(item.rmCat);
                    house.rmCat = resp.data.orgHouseList[0].rmCat;
                    house.isDecoration = $scope.getDecorateType(item.isDecoration);
                    $scope.newHouseList.push(house);
                });
            }
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.save = function (isThrough) {
            var param = {};
            param.curHouseCheck = house.curHouseCheck;
            param.houseId = house.houseId;
            param.isThrough = isThrough;
            param.userId = house.userId;
            $http.post('/ovu-base/system/parkHouse/checkHouseSperate', param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            });
        };

        /**
         装修类型
         */
        $scope.getDecorateType = function (decoration) {
            var str = ""; //0-毛坯,1-简装,2-精装
            if (decoration == "0") {
                str = "毛坯";
            } else if (decoration == "1") {
                str = "简装";
            } else if (decoration == "2") {
                str = "精装";
            }
            return str;
        };

        /**
         空间类型
         0-写字楼 1-商铺 2-共享办公 3-开放办公 4-住宅 5-停车场
         */
        $scope.getHouseType = function (houseType) {
            var str = "";
            if (houseType == "FW11") {
                str = "办公类型";
            } else if (houseType == "FW16") {
                str = "商铺";
            } else if (houseType == "FW12") {
                str = "住宅";
            }
            return str;
        };


        /**
         1-工位 2-车位
         获得空间类型
         */
        $scope.getType = function (actionFrom) {
            var str = "";
            if (actionFrom == 1) {
                str = "工位";
            } else if (actionFrom == 2) {
                str = "车位";
            }
            return str;
        };

        /**
         得到房屋的朝向
         */
        $scope.getHouseDirection = function (param) {
            var str;
            if (param == 1) {
                str = "东";
            } else if (param == 2) {
                str = "南";
            } else if (param == 3) {
                str = "西";
            } else if (param == 4) {
                str = "北";
            } else if (param == 5) {
                str = "东南";
            } else if (param == 6) {
                str = "西南";
            } else if (param == 7) {
                str = "东北";
            } else if (param == 8) {
                str = "西北";
            } else {
                str = "";
            }
            return str;
        };

        /**
         获取是否是设备房
         1是 2否
         */
        $scope.getIsEquip = function (equipType) {
            var str = "否";
            if (1 == equipType) {
                str = "是";
            } else if (2 == equipType) {
                str = "否";
            }
            return str;
        };

        /**
         获取面积单位
         */
        $scope.getAreaUnit = function (area) {
            if (area) {
                return area + "㎡";
            }
        };

        /**
         获取文件类型
         1-建筑 2-电气 3-弱电 4-给排水 5-暖通空调 6-装修 7-BIM 8-室内地图 9-房屋平面图
         */
        $scope.getFileType = function (fileType) {
            var str = "";
            if (fileType == 1) {
                str = "建筑";
            } else if (fileType == 2) {
                str = "电气";
            } else if (fileType == 3) {
                str = "弱电";
            } else if (fileType == 4) {
                str = "给排水";
            } else if (fileType == 5) {
                str = "暖通空调";
            } else if (fileType == 6) {
                str = "装修";
            } else if (fileType == 7) {
                str = "BIM";
            } else if (fileType == 8) {
                str = "室内地图";
            } else if (fileType == 9) {
                str = "房屋平面图";
            }
            return str;
        }

    });

})();
