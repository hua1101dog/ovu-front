/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('spaceBacktrackCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $state, $location) {
        document.title = "OVU-空间回溯";
        $scope.pageModel = {};
        $scope.config = { edit: true };
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
        //去详情页面
        $scope.goDetail= function(url,param,$event) {
            $location.url('/projectSpace/spaceDetail/spaceDetail')
            $location.search({
                id: param.id,
                isSperated: param.isSperated,
                rmCats: param.rmCats
            });
        }
        //合并
        $scope.mergeSpace = function () {
        	
        	var spaceList = $scope.pageModel.list.filter(function (n) { return n.checked });
            var ids = [];
            angular.forEach(spaceList, function (space) {
                ids.push(space.id);
            });
        	var params = {
                    action:	'merge',
                    houseIds: ids.join(","),
                    isSperated: 0
            }
        	
        	$location.url('/projectSpace/sapceMerge/sapceBacktrackMerge');
            $location.search({ params: params });
           /* 
        	var spaceList = $scope.pageModel.list.filter(function (n) { return n.checked });
            var ids = [];
            angular.forEach(spaceList, function (space) {
                ids.push(space.id);
            });
            
            var params = {
                    action:	'merge',
                    houseIds: ids.join(","),
                    isSperated: 0,
                    rmCats: 'FW11,FW12,FW16'
            }
            $http.post('/ovu-base/system/parkHouse/sperate/validateIsAble', params, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    var flag = true;
                    angular.forEach(spaceList, function (space, item) {
                        $scope.staffSearch = {
                    			"houseId":space.id
                    			};
                    	fac.getPageResult("/ovu-park/backstage/position/queryPageWithStaff", $scope.staffSearch, function (resp) {
                            if (resp && resp.data.length>0) {
                            	alert("当前空间【"+space.houseName+"】下有工位，合并前请先解绑所有工位!");
                            	flag = false;
                            }
                        });
                    	//循环到最后一个
                    	if(item == spaceList.length-1){
                    		if(flag){
                            	$location.url('/projectSpace/sapceMerge/sapceMerge');
                                $location.search({ params: params });
                            }
                    	}
                    });
                    
                } else {
                    alert(resp.msg);
                }

            });
            */
        };
        //拆分
        $scope.separate = function (obj) {
        	$scope.staffSearch = {
        			"houseId":obj.id
        			};
        	/*fac.getPageResult("/ovu-park/backstage/position/queryPageWithStaff", $scope.staffSearch, function (data) {
                $scope.staffModel = data;
                if($scope.staffModel && $scope.staffModel.data.length>0){
                	alert("当前空间【"+obj.houseName+"】下有工位，拆分前请先解绑所有工位!");
                }else{
                	$location.url('/projectSpace/spaceSeparate/spaceSeparate')
                    $location.search({ houseId: obj.id, rmCats: obj.rmCats });
                }
            });*/
        	
        	$location.url('/projectSpace/spaceSeparate/spaceBacktrackSeparate')
            $location.search({ houseId: obj.id, rmCats: obj.rmCats });
            
        }
        // 复核
        $scope.check = function (id, status, isThrough, $event) {
            var param = {};
            param.curHouseCheck = status;
            param.houseId = id;
            param.isThrough = isThrough;
            param.userId = app.user.ID;
            $http.post('/ovu-base/system/parkHouseBacktrack/checkHouseSperate', param, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    $scope.find();
                } else {
                    alert(resp.msg);
                }
            });
        }
        //获取工位
        $scope.getPositon=function(item){
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
                $scope.find();
            });
        }
       
    });
    app.controller('positionDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        //获取工位列表
        $scope.search={};
        $scope.pageModel={};
        $scope.detail={};
        $scope.houseName=data.houseName
        //获取工位列表
       $scope.find=function(pageNo){
        $.extend($scope.search, {
            currentPage: pageNo || $scope.pageModel.currentPage || 1,
            pageSize: $scope.pageModel.pageSize || 10,
            houseId:data.id

        });
        fac.getPageResult("/ovu-park/backstage/position/queryPageWithStaff", $scope.search, function (data) {
            $scope.pageModel = data;
            if($scope.pageModel && $scope.pageModel.data.length>0){
                $scope.positionId=$scope.pageModel.data[0].id
                $scope.findDetail(1,$scope.pageModel.data[0].id);
            }
        });
       }
       $scope.find(1);
       
        $scope.show=function(item){
            $scope.findDetail(1,item.id);
        }
        //查看详情
       $scope.findDetail=function(pageNo,id){
        $.extend($scope.detail, {
            currentPage: pageNo || $scope.pageModel.currentPage || 1,
            pageSize: $scope.pageModel.pageSize || 10,
            positionId:id

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
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf($scope.bindList.pageTotal - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.bindList.pages = pages;
        });
       }
       
       //解绑
       $scope.unbind=function(item){
        confirm('确认解除【'+item.staff.name+'】使用【'+item.name+'】吗？', function () {
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
       }
        
       

      
        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
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
})();
