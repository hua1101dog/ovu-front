// 变配电管理
/**
 * Created by Cx on 2018/10/23.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('distributionManageCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = '变配电管理';
        $scope.msg = {};
        $scope.search = {};
        $scope.item = { refTr: 0 }
        $scope.config = {
            edit: false
        };
        $scope.isNode = false // 是否展示配电柜

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.init();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }

            })

        })
        $scope.init = function () {
            // fac.setInsitemtypeTree({ parkId: $scope.search.parkId }).then(function (trmTreeData) {
            //     if (trmTreeData && trmTreeData[0]) {
            //         $scope.selectNode($scope.trmTreeData[0]);
            //     }
            // });
            $scope.findTree()

        }
        $scope.findTree=function(){
             //树数据
             $http.get("/ovu-energy/energy/transformer/tree.do?parkId="+$scope.search.parkId).success(function(data){
                $scope.trmTreeData  = data.data || [];
                !$scope.trmTreeData[0] && ($scope.pageModel={});
                $scope.trmTreeData[0] && ($scope.trmTreeData[0].state={selected:true})
                $scope.trmTreeData[0] && $scope.selectNode('',$scope.trmTreeData[0]);
            });
        }


        $scope.title = '新增'
        //变压器列表
        $scope.transformList = [];
        // //点击一级菜单默认修改一级菜单
        $scope.clickMainMenu = function (id) {
            $scope.isNode = false;
            $scope.isbyq = true;
            $http.get("/ovu-energy/energy/transformer/list", {
                params: {
                    parkId: $scope.search.parkId,
                    dtId: id
                }
            }).success(function (resp) {
                $scope.transformList = resp.data;//下拉框选项
            });


        };
        // //点击二级菜单默认修改二级菜单
        $scope.clickSubMenu = function () {
            $scope.isbyq = false;
            $scope.isNode = true;
            $scope.title = '编辑'
        };
        $scope.selected={}
        $scope.selectNode = function (search,node) {
            
            if (!$scope.search.parkId) {
                alert('请选择项目')
            }
            if (node.state.selected) {
                $scope.checkId=node.id
                if (node.parentId == '0') {
                   
                    $scope.clickMainMenu(node.id);
                    $scope.isNode = false;
                    $http.post('/ovu-energy/energy/transformer/get', {
                        trId: node.id
                    }, fac.postConfig).success(function (data) {
                        $scope.item = data.data || [];
                        $scope.item.modifyTime && delete  $scope.item.modifyTime
                        $scope.item.createTime && delete  $scope.item.createTime
                        $scope.item.creatorId   && delete  $scope.item.creatorId
                        $scope.item.domainId && delete  $scope.item.domainId
                        if(data.data.refTrId){
                            $scope.transformList && $scope.transformList.forEach(function(v){
                                if($scope.item.refTrId==v.trId){
                                    $scope.selected.value = v
                                }
                            })
                        
                          
                        }
                     })
                } else {
                    $scope.isNode = true;
                    $scope.clickSubMenu();
                    $http.post('/ovu-energy/energy/distributor/get', {
                        dtId: node.id
                    }, fac.postConfig).success(function (data) {
                        $scope.item = data.data
                        $scope.item.modifyTime && delete  $scope.item.modifyTime
                        $scope.item.createTime && delete  $scope.item.createTime
                        $scope.item.creatorId   && delete  $scope.item.creatorId
                        $scope.item.domainId && delete  $scope.item.domainId
                       

                    })
                }
            } 



        };
        //新增配电柜
        $scope.addPdg = function (id) {
            $scope.isNode = true;
            $scope.isbyq=false;
            $scope.item.trId=id
        };

        //选择变压器监测

        $scope.chooseByq = function (id, name) {

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'energy/modal.choosePoint.html',
                controller: 'choosePointModalCtrl',
                resolve: {
                    parm: function () {
                        return {
                            parkId: $scope.search.parkId,
                            pointId: id,
                            pointName: name

                        }
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.item.monitorMeterName = data.pointName,
                    $scope.item.monitorMeterId = data.pointId
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //选择进线表
        $scope.chooseJinxian = function (id, name) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'energy/modal.choosePoint.html',
                controller: 'choosePointModalCtrl',
                resolve: {
                    parm: function () {
                        return {
                            parkId: $scope.search.parkId,
                            pointId: id,
                            pointName: name
                        }
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.item.inMeterName = data.pointName,
                    $scope.item.inMeterId = data.pointId
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //选择母联表
        $scope.chooseM = function (id, name) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'energy/modal.choosePoint.html',
                controller: 'choosePointModalCtrl',
                resolve: {
                    parm: function () {
                        return {
                            parkId: $scope.search.parkId,
                            pointId: id,
                            pointName: name
                        }
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.item.parentMeterName = data.pointName,
                    $scope.item.parentMeterId = data.pointId
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //选择配电柜
        $scope.chooseEquipment = function (item) {
            if (!$scope.search.parkId) {
                msg("请先选择项目！");
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/selector.equipment.html',
                controller: 'equipmentSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            parkId: $scope.search.parkId,
                            preSetEquipType:'distribution'
                        };
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.item.dtId = data.id;  //配电柜id
                $scope.item.dtName = data.name;
                $scope.item.dtSimpleName = data.equip_simple_name; //曾用名

            });

        };




       
       
        //将下拉选的数据值赋值给文本框
        $scope.change = function (x) {
        
         $scope.item.refTrId=x.trId
         $scope.item.byqName=x.trSimpleName
        }
       
        $scope.del = function () {
            if (!$scope.isNode) {
                confirm("是否删除该变压器配置信息？", function () {
                    $http.post('/ovu-energy/energy/transformer/delete', {
                        trId: $scope.item.trId
                    }, fac.postConfig).success(function (data) {
                        if (data.code == 0) {
                            msg(data.msg);
                            // fac.setEquipTypeTree();
                            $scope.findTree()

                        } else {
                            alert(data.msg);
                        }
                    });
                })
            } else {
                confirm("是否删除该配电柜信息？", function () {
                    $http.post('/ovu-energy/energy/distributor/delete', {
                        dtId: $scope.item.dtId
                    }, fac.postConfig).success(function (data) {
                        if (data.code == 0) {
                            msg(data.msg);
                            // fac.setEquipTypeTree();
                            $scope.findTree()
                        } else {
                            alert(data.msg);
                        }
                    });
                })
            }
            // scope.isNode = false;
            
        };
        $scope.save = function (form, item) {
           
            form.$setSubmitted(true);
   
            if (!form.$valid) {
                return;
            }
              if($scope.item.refTr=='0'){
                $scope.item.refTrId && delete $scope.item.refTrId
                $scope.item.refParentMeter && delete $scope.item.refParentMeter
                $scope.item.parentMeterId && delete $scope.item.parentMeterId
              }
            if($scope.item.refParentMeter==0){
                   delete $scope.item.parentMeterId
            }
          
            (!$scope.item.parkId) && angular.extend($scope.item,{parkId:$scope.search.parkId})
            if (!$scope.isNode) {
                $http.post('/ovu-energy/energy/transformer/edit', $scope.item, fac.postConfig).success(function (data) {
                    if (data.code == 0) {
                        msg(data.msg);
                        // fac.setEquipTypeTree();
                       
                       
                    } else {
                        alert(data.msg);
                    }
                });
            } else {
                $http.post('/ovu-energy/energy/distributor/edit', { dtId: $scope.item.dtId, trId: $scope.item.trId,parkId:$scope.search.parkId }, fac.postConfig).success(function (data) {
                    if (data.code == 0) {
                        msg(data.msg);
                        // fac.setEquipTypeTree();
                      


                    } else {
                        alert(data.msg);
                    }
                });
            }
            // $scope.isNode = false;
            // fac.setEquipTypeTree();
            $scope.findTree()
        };

        $scope.cancel = function () {
         
           $scope.item={
               parkId:$scope.item.parkId,
               trId:$scope.item.trId,
               trName:$scope.item.trName,
               trSimpleName:$scope.item.trSimpleName,
           }
            // $window.location.reload();

        };




    });
 
})(angular)
