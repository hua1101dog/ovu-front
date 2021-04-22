/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('ownerCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        $scope.pageModel = {};

        app.modulePromiss.then(function(){
            fac.initPage($scope,function(){
                loadHouseTree($scope.search.parkId);
                $scope.find(1);
            })
        })

        $scope.find = function(pageNo){
            if(!fac.hasActivePark($scope.search)){
                return;
            }
            $scope.curStage ? ($scope.search.stageId = $scope.curStage.stageId):(delete $scope.search.stageId);
            $scope.curFloor ? ($scope.search.floorId = $scope.curFloor.floorId):(delete $scope.search.floorId);

            $.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/pcos/owner/listByGrid.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.editRelative = function(relative){
            var copy =angular.extend({},relative);
            relative.copy = copy;
            relative.edit = true;
        }

        $scope.editTenant = function(tenant){
            var copy =angular.extend({},tenant);
            tenant.copy = copy;
            tenant.edit = true;
        }

        //批量删除
        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.ID);return ret},[]);
            if(ids.length==0){
                alert("请选择要删除的业主！");
                return;
            }
            dodel(ids.join());
        };
        $scope.del = function(item){
            dodel(item.ID);
        }
        function dodel(ids){
            confirm("确认删除业主吗?",function(){
                $.post("/ovu-base/pcos/owner/dels.do",{"ids":ids},function(msg){
                    if(msg == 'success'){
                        $scope.find();
                    }else{
                        alert();
                    }
                });
            })
        }
        $scope.delRelative = function(owner,relative){
            confirm("确认删除该亲属吗?",function(){
                $.post("/ovu-base/pcos/owner/delRelativeById.do",{"ID":relative.ID},function(data){
                    debugger;
                    if(data[0]){
                        owner.relatives.splice(owner.relatives.indexOf(relative),1);
                        $scope.$apply();
                    }else{
                        alert();
                    }
                });
            })
        }
        $scope.delTenant = function(owner,tenant){
            confirm("确认删除该租户吗?",function(){
                $.post("/ovu-base/pcos/owner/delTenantById.do",{"ID":tenant.ID},function(data){
                    if(data[0]){
                        owner.tenants.splice(owner.tenants.indexOf(tenant),1);
                        $scope.$apply();
                    }else{
                        alert();
                    }
                });
            })
        }

        $scope.addRelative = function(owner){
            owner.relatives =owner.relatives||[];
            var relative = {OWNER_ID:owner.ID,REGISTER_DATE:$filter('date')(new Date(), "yyyy-MM-dd")};
            owner.relatives.push({edit:true,copy:relative});
        }

        $scope.addTenant = function(owner){
            owner.tenants =owner.tenants||[];
            var tenant = {OWNER_ID:owner.ID,REGISTER_DATE:$filter('date')(new Date(), "yyyy-MM-dd")};
            owner.tenants.push({edit:true,copy:tenant});
        }

        //保存亲属信息
        $scope.saveRelative = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("/ovu-base/pcos/owner/saveRelative.do",item.copy,fac.postConfig).success(function(data, status, headers, config) {
                if(data.success){
                    msg("保存成功");
                    delete item.copy;
                    item.edit = false;
                    angular.extend(item,data.relative);
                } else {
                    alert(data.error);
                }
            })
        }

        //保存租户信息
        $scope.saveTenant = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("/ovu-base/pcos/owner/saveTenant.do",item.copy,fac.postConfig).success(function(data, status, headers, config) {
                if(data.success){
                    msg("保存成功");
                    delete item.copy;
                    item.edit = false;
                    angular.extend(item,data.tenant);
                } else {
                    alert(data.error);
                }
            })
        }

        $scope.banRelative=function (relative){
            relative.VALID == 1?(relative.VALID = 0):(relative.VALID = 1);
            $http.post("/ovu-base/pcos/owner/saveRelative.do",relative,fac.postConfig).success(function(data, status, headers, config) {
                if(data.success){
                    msg("修改成功");
                } else {
                    alert(data.error);
                    relative.VALID == 1?(relative.VALID = 0):(relative.VALID = 1);
                }
            })
        }

        $scope.banTenant=function (tenant){
            tenant.VALID == 1?(tenant.VALID = 0):(tenant.VALID = 1);
            $http.post("/ovu-base/pcos/owner/saveTenant.do",tenant,fac.postConfig).success(function(data, status, headers, config) {
                if(data.success){
                    msg("修改成功");
                } else {
                    alert(data.error);
                    tenant.VALID == 1?(tenant.VALID = 0):(tenant.VALID = 1);
                }
            })
        }

        $scope.cancelRelative = function(owner,relative){
            if(relative.ID){
                delete relative.copy;
                relative.edit = false;
            }else{
                owner.relatives.splice(owner.relatives.indexOf(relative),1);
            }
        }
        $scope.cancelTenant = function(owner,tenant){
            if(tenant.ID){
                delete tenant.copy;
                tenant.edit = false;
            }else{
                owner.tenants.splice(owner.tenants.indexOf(tenant),1);
            }
        }



        //展开获取业主的亲戚与租户信息
        $scope.expand = function(item){
            if(item.expanded){
                item.expanded = false;
            }else{
                item.expanded = true;
                item.relatives = [];
                item.tenants = [];
                $http.get("/ovu-base/pcos/owner/getRelatives.do?ownerId="+item.ID).success(function(list){
                    item.relatives =list;
                })
                $http.get("/ovu-base/pcos/owner/getTenants.do?ownerId="+item.ID).success(function(list){
                    item.tenants =list;
                })
            }
        }

        function loadHouseTree(parkId){
            $http.post("/ovu-base/system/parkStage/tree.do", {
                parkId : parkId,
                onlyFloor:true
            },fac.postConfig).success(function(data){
                $rootScope.treeData = data;
                $('#house_tree').treeview({ data : data});
                var treeView = $("#house_tree").data('treeview');
                $scope.oriList = treeView.getUnchecked();

                $('#house_tree').on('nodeSelected', function(event, node) {
                    if(node.floorId){//选中楼栋
                        $scope.curStage = treeView.getParent(node);
                        $scope.curFloor = node;
                        $scope.unitList = [];

                        var param = {
                            pageSize:1000,
                            pageIndex:0,
                            floorId:$scope.curFloor.floorId||""
                        };
                        $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do",{params:param}).success(function(resp){
                            $scope.unitList = resp.data;
                        })

                    }else{//选中分期
                        $scope.curStage =node;
                        delete $scope.curFloor;
                        delete $scope.unitList;
                        delete $scope.groundList;
                    }
                    $scope.find(1);
                });
                $('#house_tree').on('nodeUnselected', function(event, node) {
                    delete $scope.curStage;
                    delete $scope.curFloor;
                    delete $scope.unitList;
                    delete $scope.groundList;
                    $scope.$apply();
                });

            });
        }
        $scope.geneSearchGround = function(){
            if (!$scope.search.unitNo) {
                $scope.groundList = [];
                return;
            }
            var param = {
                pageSize:1000,
                pageIndex:0,
                floorId:$scope.curFloor.floorId||"",
                unit_no:$scope.search.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do",{params:param}).success(function(resp){
                $scope.groundList = resp.data;
            })
        }

        $scope.showEditModal = function (owner) {
            if (!fac.hasActivePark($scope.search)) {
                return;
            }
            if(!owner){
                owner = {};
                if($scope.curStage){
                    owner.STAGE_ID = $scope.curStage.ID;
                }
                if($scope.curFloor){
                    owner.FLOOR_ID = $scope.curFloor.ID;
                    if($scope.search.unitNo){
                        owner.unit_no = $scope.search.unitNo;
                    }
                    if($scope.search.groundNo){
                        owner.ground_no = $scope.search.groundNo;
                    }
                }
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'owner/owner.modal.html',
                controller: 'ownerModalCtrl'
                , resolve: {owner: angular.extend({},owner)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    app.controller('ownerModalCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, owner) {

        //选择单元、楼层
        $scope.geneUnit = function(owner) {
            if (!owner||!owner.FLOOR) {
                $scope.unitList = [];
                return;
            }
            var param = {
                pageSize:1000,
                pageIndex:0,
                floorId:owner.FLOOR.floorId||""
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do",{params:param}).success(function(resp){
                $scope.unitList = resp.data;
            })
        }

        $scope.geneGround = function(owner) {
            if (!owner||!owner.FLOOR||!owner.unit_no) {
                $scope.groundList = [];
                return;
            }
            var param = {
                pageSize:1000,
                pageIndex:0,
                floorId:owner.FLOOR.floorId||"",
                unit_no:owner.unit_no
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do",{params:param}).success(function(resp){
                $scope.groundList = resp.data;
            })
        }

        /*$scope.getHouseList = function(owner) {
            $scope.houseList = [];
            if (owner.ground_no) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do", {
                    floorId: owner.FLOOR.floorId,
                    unit_no: owner.unit_no,
                    ground_no: owner.ground_no
                }, fac.postConfig).success(function(list) {
                    $scope.houseList = list;
                })
            }
        }*/

        $scope.getHouseList = function(owner){
            $scope.houseList = [];
            if(owner.ground_no){
                $http.post("/ovu-base/system/parkHouse/getHouses.do",
                    {floorId:owner.FLOOR.floorId,
                        unit_no:owner.unit_no,
                        ground_no:owner.ground_no},fac.postConfig).success(function(list){
                    list.forEach(function(n){
                        if(owner.HOUSE_ID == n.ID){
                            owner.HOUSE = n;
                        } else if(n.OWNER_ID ){
                            n.HOUSE_NAME += "(已关联其它业主)";
                            n.ID =0;
                        }
                    })
                    $scope.houseList = list;
                })
            }
        }


        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-base/pcos/owner/save.do", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.item = owner;
        if(owner.STAGE_ID){
            owner.STAGE = $scope.treeData.find(function(n){return n.stageId == owner.STAGE_ID});
            if(owner.FLOOR_ID){
                owner.FLOOR = owner.STAGE.nodes.find(function(n){return n.floorId == owner.FLOOR_ID});
                if(owner.FLOOR){
                    $scope.geneUnit(owner);
                    $scope.geneGround(owner);
                    $scope.getHouseList(owner);
                }
            }
        }
    });

})();