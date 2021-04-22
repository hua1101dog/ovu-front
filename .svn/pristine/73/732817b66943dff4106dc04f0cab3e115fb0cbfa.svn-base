/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    !app.registerSensorTree && app.directive("treeSensor", function() {
        return {
            restrict: "E",
            scope: {
                nodeList: '=',
                pnode:"="
            },
            templateUrl: '/view/equipment/treeSensor.html',
            controller: function($scope){
                $scope.config = $scope.$parent.config||{edit:true,sort:false};
                $scope.selectNode = $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.delNode = $scope.$parent.delNode;
                $scope.editNode = $scope.$parent.editNode;
            }
        };
    });
    app.registerSensorTree = true;

    //项目架构ctl
    app.controller('sensorCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-传感器台帐";

        $scope.pageModel = {};
        fac.setSensorTypeTree($scope)

        $scope.find = function(pageNo){
            if(!fac.hasActivePark($scope.search)){
                return;
            }
            $scope.search.sensorTypeId = $scope.curNode&&$scope.curNode.id;
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/sensor/queryByPage.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.config={edit:$rootScope.hasPower('传感器分类编辑')};
                $scope.find();
            },function(){
                $scope.find();
            })
        })


        $scope.showEditModal = function(sensor){

            if(!sensor &&!fac.hasActivePark($scope.search) ){
                return ;
            }
            var copy = angular.extend({},sensor);
            copy.isGroup = $scope.search.isGroup;
            if(!copy.park_id){
                angular.extend(copy,{park_id:$scope.search.parkId,park_name:$scope.search.PARK_NAME});
            }
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/equipment/modal.sensor.html',
                controller: 'sensorModalCtrl'
                ,resolve: {sensor: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.addTopNode = $scope.editNode = function(sensorType){
            var modal = $uibModal.open({
                animation: true,
                size:'lg',
                templateUrl: '/view/equipment/modal.sensorType.html',
                controller: 'sensorTypeCtrl'
                ,resolve: {sensorType: function(){return angular.extend({},sensorType);}}
            });
            modal.result.then(function (data) {
                if(sensorType){
                    angular.extend(sensorType,data)
                }else{
                    $scope.sensorTypeTree.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.selectNode= function (node) {
            if($scope.curNode != node){
                $scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
            }
            node.state = node.state||{};
            node.state.selected = !node.state.selected;
            if(node.state.selected){
                $scope.curNode = node;
                $scope.find(1);
            }else{
                delete $scope.curNode;
            }
        }

        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            del(ids,"确认删除选中的 "+ids.length+" 台传感器吗?");
        };
        $scope.del = function(item){
            del([item.id],"确认删除 "+item.name+" 吗?");
        }

        function del(ids,msg){
            confirm(msg,function(){
                $http.post("/ovu-pcos/pcos/sensor/del.do",{"ids":ids.join()},fac.postConfig).success(function(resp){
                    if(resp.success){
                        $scope.find();
                    }else{
                        alert(resp.error);
                    }
                })
            });
        }

        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length){
                alert("此节点有下级节点,不能删除！")
            }else{
                $http.get("/ovu-pcos/pcos/sensor/sensorType/getSensorCnt.do?ids="+node.id).success(function(resp){
                    if(resp.success && resp.cnt){
                        alert("此型号已存在"+resp.cnt+"个传感器，不可删除！");
                    }else{
                        confirm("确定删除 "+node.text,function(){
                            $http.post("/ovu-pcos/pcos/sensor/sensorType/del.do",{ids: node.id},fac.postConfig).success(function(resp){
                                if(resp.success){
                                    if($scope.curNode == node){
                                        delete $scope.curNode;
                                    }
                                    $scope.sensorTypeTree.splice($scope.sensorTypeTree.indexOf(node),1)
                                }
                            });
                        })
                    }
                });
            }
        }
        $scope.sort = function(nodeList,node,index){
            if(index<0){
                index +=  nodeList.length;
            } else if(index >= nodeList.length){
                index -=  nodeList.length;
            }
            var otherNode = nodeList[index];
            if(!node.did ||!otherNode.did){
                alert("请先保存编辑中节点！");
                return;
            }
            var pids = node.did+","+otherNode.did;
            var oriIndex = nodeList.indexOf(node);
            var sorts = index +","+oriIndex;
            $.post("/ovu-base/system/park/sort.do",{pids:pids,sorts:sorts},function(msg){
                if(msg!="success"){
                    alert();
                }else{
                    nodeList.splice(oriIndex,1);
                    nodeList.splice(index,0,node);
                    $scope.$apply();
                }
            });
        }

    });



    app.controller('sensorModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,sensor) {

        fac.setParkTree($scope);
        var houseTreePromiss = fac.getHouseTree($scope,sensor.park_id);
        //集团版, 用于选择项目

        $scope.selectPark = function(node){
            if(node.PARK_TYPE==1){
                sensor.park_id = node.parkId;
                sensor.park_name= node.fullPath;
                sensor.parkHover = sensor.parkFocus = false;
                houseTreePromiss = fac.getHouseTree($scope,sensor.park_id);
            }else{
                alert("请先择项目！");
            }
            console.log(node);
        }

        //用于获取自定义参数 及其值
        if(sensor.id){
            $http.get("/ovu-pcos/pcos/sensor/get.do?id="+sensor.id).success(function(resp) {
                if(resp.success){
                    angular.extend(sensor,resp.data);
                } else {
                    alert(resp.error);
                }
            })
        }

        //选择房号
        $scope.getHouseList = function(floor) {
            floor.houseList = [];
            if (sensor.ground_no) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do", {
                    floorId: floor.floorId,
                    unit_no: sensor.unit_no,
                    ground_no: sensor.ground_no
                }, fac.postConfig).success(function(list) {
                    floor.houseList = list;
                })
            }
        }

        //选择单元、楼层
        $scope.geneUnit = function(floor) {
            if (!floor) {
                return;
            }
            floor.groundList = [];
            var param = {
                pageSize:1000,
                pageIndex:0,
                floorId:floor.floorId||""
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do",{params:param}).success(function(resp){
                floor.unitList = resp.data;
            })
        }

        $scope.geneGround = function(floor) {
            if (!floor||!sensor.unit_no) {
                floor.groundList = [];
                return;
            }
            var param = {
                pageSize:1000,
                pageIndex:0,
                floorId:floor.floorId||"",
                unit_no:sensor.unit_no
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do",{params:param}).success(function(resp){
                floor.groundList = resp.data;
            })
        }

        $scope.item = sensor;

        houseTreePromiss.then(function(){
            if (sensor.stage_id) {
                sensor.STAGE = $scope.houseTree.find(function(n) {
                    return n.stageId == sensor.stage_id
                });
                if (sensor.STAGE && sensor.STAGE.nodes && sensor.floor_id) {
                    sensor.FLOOR = sensor.STAGE.nodes.find(function(n) {
                        return n.floorId == sensor.floor_id
                    });
                    if (sensor.FLOOR) {
                        $scope.geneUnit(sensor.FLOOR);
                        $scope.geneGround(sensor.FLOOR);
                        $scope.getHouseList(sensor.FLOOR);
                    }
                }
            }
        });

        $scope.selectNode = function(node){
            sensor.sensor_type_id  = node.id;
            sensor.type_name= (node.ptexts?node.ptexts+ " > ":"") +node.text;
            sensor.modelHover = sensor.modelFocus = false;
        }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            item.STAGE && (item.stage_id = item.STAGE.stageId);
            if(item.FLOOR){
                item.floor_id = item.FLOOR.floorId;
                item.unit_num = item.FLOOR.unit_num;
                item.ground_num =  item.FLOOR.ground_num;
            }
            $http.post("/ovu-pcos/pcos/sensor/save.do", item).success(function (data, status, headers, config) {
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
    });

})();
